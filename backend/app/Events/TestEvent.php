<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class TestEvent implements ShouldBroadcast
{
    public $message;

    public function __construct($message)
    {
        $this->message = $message;
    }

    public function broadcastOn()
    {
        // Send to a private channel for user 1 (replace with your test user ID)
        return new PrivateChannel('user.4');
    }

    public function broadcastAs()
    {
        return 'test.event';
    }
}
