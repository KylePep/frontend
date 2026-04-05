<?php

namespace App\Events;

use App\Models\Connection;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ConnectionRequested
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $connection;

    /**
     * Create a new event instance.
     */
    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn()
    {
        return new PrivateChannel('user.' . $this->connection->user_two_id);
    }

    public function broadCastAs()
    {
        return 'connection.requested';
    }
}
