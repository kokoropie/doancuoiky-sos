<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(collect(request()->user('sanctum'))->merge([
            'details' => request()->user('sanctum')->details
        ]));
    }

    public function update(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($request->user('sanctum')->user_id, 'user_id')],
            'name' => 'required|string|max:255',
            'dateOfBirth' => 'nullable|date',
            'phone' => 'nullable',
            'gender' => 'required|in:0,1'
        ]);

        $request->user('sanctum')->fill([
            "name" => $request->input("name"),
            "email" => $request->input("email"),
        ]);

        $request->user('sanctum')->details->fill([
            "dateOfBirth" => $request->input("dateOfBirth"),
            "phone" => $request->input("phone"),
            "gender" => $request->input("gender")
        ]);

        if ($request->user('sanctum')->isDirty('email')) {
            $request->user('sanctum')->email_verified_at = null;
        }

        $request->user('sanctum')->save();
        $request->user('sanctum')->details->save();

        return response()->json([
            'user' => collect($request->user('sanctum'))->merge([
                "details" => $request->user('sanctum')->details
            ]),
            'message' => 'Profile updated'
        ]);
    }

    public function password(Request $request) 
    {
        $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Rules\Password::defaults(), 'confirmed'],
        ]);

        $request->user('sanctum')->update([
            'password' => Hash::make($request->input("password")),
        ]);

        $request->user('sanctum')->tokens()->delete();

        return response()->json([
            'message' => 'Password updated! Please login again.'
        ]);
    }
    
    public function destroy(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $request->user('sanctum')->delete();

        return response()->json([
            'message' => 'User deleted'
        ]);
    }

    public function login(Request $request) 
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $this->ensureIsNotRateLimited($request);

        if (! Auth::attempt($request->only('email', 'password'))) {
            RateLimiter::hit($this->throttleKey($request));

            return response()->json([
                'message' => trans('auth.failed'),
                'errors' => [
                    'email' => trans('auth.failed')
                ]
            ])->throwResponse();
        }

        RateLimiter::clear($this->throttleKey($request));
        $user = User::where('email', $request->input("email"))->first();
        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => str($token)->explode('|')[1],
            'user' => collect($user)->merge([
                'details' => $user->details
            ])
        ]);
    }

    private function ensureIsNotRateLimited($request): void
    {
        if (!RateLimiter::tooManyAttempts($this->throttleKey($request), 5)) {
            return;
        }

        event(new Lockout($request));

        $seconds = RateLimiter::availableIn($this->throttleKey($request));

        response()->json([
            'message' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
            'status' => 'error'
        ])->throwResponse();
    }

    private function throttleKey($request): string
    {
        return Str::transliterate(Str::lower($request->input('email')).'|'.$request->ip());
    }

    public function register(Request $request) 
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->input("name"),
            'email' => $request->input("email"),
            'password' => Hash::make($request->input("password")),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => str($token)->explode('|')[1],
            'user' => collect($user)->merge([
                'details' => $user->details
            ])
        ]);
    }

    public function logout(Request $request) 
    {
        $request->user('sanctum')->tokens()->delete();

        return response()->json([
            'message' => 'Logged out'
        ]);
    }
}
