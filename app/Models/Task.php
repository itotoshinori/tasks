<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;
    protected $dates = ['created_at', 'updated_at'];
    protected $fillable = ['title', 'is_done', 'body', 'link', 'term', 'starttime', 'finishtime', 'finishda', 'user_id'];
    protected $casts = [
        'is_done' => 'bool',
    ];
}
