<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = ['created_by', 'status'];

    public function users()
    {
        return $this->belongsToMany(User::class)
            ->withPivot(['joined_at', 'left_at']);
    }

    public function messages()
    {
        return $this->hasMany(RoomMessage::class);
    }
}
