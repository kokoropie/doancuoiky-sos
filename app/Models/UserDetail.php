<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserDetail extends Model
{
    use HasFactory;
    protected $table = 'user_details';
    protected $primaryKey = 'user_id';
    // public $incrementing = true;
    // protected $keyType = 'int';
    public $timestamps = false;

    protected $fillable = [
        'dateOfBirth',
        'phone',
        'gender',
    ];

    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
