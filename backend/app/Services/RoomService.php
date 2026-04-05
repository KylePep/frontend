<?php

namespace App\Services;

use App\Models\Room;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use App\Events\RoomCreated;

class RoomService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function createRoom(User $creator, User $invitee) : Room {
        return DB::transaction(function () use ($creator, $invitee){
            $room = Room::create([
                'created_by' => $creator->id,
            ]);

            $room->users()->attach([
                $creator->id => ['joined_at' =>now()],
                $invitee->id => ['joined_at' => now()],
            ]);

            broadcast(new RoomCreated($room->load('users')));

            return $room->load('users');
        });
    }

    public function joinRoom(Room $room, User $user):void
    {
        $room->users()->syncWithoutDetaching([
            $user->id => ['joined_at' => now(), 'left_at' => null]
        ]);
    }

    public function leaveRoom(Room $room, User $user):void
    {
        $room->users()->updateExistingPivot($user->id, [
            'left_at' => now()
        ]);
    }
}
