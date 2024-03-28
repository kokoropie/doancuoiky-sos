<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($request->user()->user_id, 'user_id')],
            'name' => 'required|string|max:255',
            'dateOfBirth' => 'nullable|date',
            'phone' => 'nullable',
            'gender' => 'required|in:0,1'
        ]);
        $request->user()->fill([
            "name" => $request->input("name"),
            "email" => $request->input("email"),
        ]);

        $request->user()->details->fill([
            "dateOfBirth" => $request->input("dateOfBirth"),
            "phone" => $request->input("phone"),
            "gender" => $request->input("gender")
        ]);

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();
        $request->user()->details->save();

        return Redirect::route('profile.edit')->with('toast', [
            'message' => 'Profile updated.', 
            'config' => [
                'type' => 'success', 
                'position' => 'bottom-right', 
                'autoClose' => 2000
            ]
        ]);
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
