<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class RoomCreated implements ShouldBroadcast
{
    public $room;

    public function __construct($room)
    {
        $this->room = $room;
    }

    public function broadcastOn()
    {
        return $this->room->users->map(function ($user) {
            return new PrivateChannel('chat.' . $user->id);
        })->toArray();
    }

    public function broadcastAs()
    {
        return 'RoomCreated';
    }
}

