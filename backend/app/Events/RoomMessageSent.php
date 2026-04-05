<?php

namespace App\Events;

use App\Models\RoomMessage;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class RoomMessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    public function __construct(RoomMessage $message)
    {
        $this->message = $message->load('user');
    }

    public function broadcastOn()
    {
        return new PrivateChannel('room.' . $this->message->room_id);
    }

    public function broadcastAs()
    {
        return 'RoomMessageSent';
    }
}
