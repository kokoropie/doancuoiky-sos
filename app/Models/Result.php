<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Result extends Model
{
    use HasFactory;

    protected $table = 'results';
    protected $primaryKey = 'result_id';
    // public $incrementing = true;
    // protected $keyType = 'int';
    // public $timestamps = true;

    protected $fillable = [
        'exam_id',
        'user_id',
        'count_questions',
        'count_correct'
    ];

    protected $casts = [
        "created_at" => 'datetime:Y-m-d H:i:s',
        "updated_at" => 'datetime:Y-m-d H:i:s'
    ];

    public function exam() {
        return $this->belongsTo(Exam::class, 'exam_id', 'exam_id');
    }

    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
