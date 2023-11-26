<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    protected $table = 'users';
    protected $primaryKey = 'user_id';
    // public $incrementing = true;
    // protected $keyType = 'int';
    // public $timestamps = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        "created_at" => 'datetime:Y-m-d H:i:s',
        "updated_at" => 'datetime:Y-m-d H:i:s'
    ];

    public function exams() {
        return $this->hasMany(Exam::class, 'user_id', 'user_id');
    }

    public function results() {
        return $this->hasMany(Result::class, 'user_id', 'user_id');
    }

    public function details() {
        return $this->hasOne(UserDetail::class, 'user_id', 'user_id');
    }

    protected static function booted() {
        self::created(function (User $user) {
            $user->details()->save(new UserDetail());
        });
        self::deleting(function (User $user) {
            $user->results()->delete();
            $user->exams()->delete();
            $user->details()->delete();
        });
    }
}
