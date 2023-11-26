<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'exams';
    protected $primaryKey = 'exam_id';
    // public $incrementing = true;
    // protected $keyType = 'string';
    // public $timestamps = true;

    protected $fillable = [
        'title',
        'description',
        'duration',
        'status',
        'questions',
    ];

    protected $hidden = [
        'questions'
    ];

    protected $casts = [
        "created_at" => 'datetime:Y-m-d H:i:s',
        "updated_at" => 'datetime:Y-m-d H:i:s',
        'questions' => 'array'
    ];

    public function results() {
        return $this->hasMany(Result::class, 'exam_id', 'exam_id');
    }

    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    protected static function booted() {
        self::deleting(function (Exam $exam) {
            $exam->results()->delete();
        });
    }
}
