<?php

namespace App\Http\Controllers;

use App\Events\RoomMessageSent;
use App\Models\Room;
use App\Models\RoomMessage;
use App\Models\User;
use App\Services\RoomService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoomController extends Controller
{
    public function index ()
    {
        $user = Auth::user();

        $rooms = $user->rooms()
            ->with('users:id,name')
            ->get();

        return response()->json($rooms->load('users', 'messages.user'));
    }

    public function store(Request $request, RoomService $service)
    {
        $request->validate(([
            'user_id' => 'required|exists:users,id'
        ]));

        $creator = Auth::user();
        $invitee = User::findOrFail($request->user_id);

        $room = $service->createRoom($creator, $invitee);

        return response()->json($room);
    }

    public function leave(Room $room, RoomService $service)
    {
        $user = Auth::user();

        $service->leaveRoom($room, $user);

        // Optional: broadcast to other users that someone left
        // broadcast(new \App\Events\RoomUserLeft($room, $user))->toOthers();

        return response()->json([
            'message' => 'Left room successfully',
        ]);
    }


    public function messages(Room $room)
    {
        $user = Auth::user();
        if (!$room->users->contains($user->id)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $messages = $room->messages()->with('user:id,name')->get();

        return response()->json($messages);
    }


    public function sendMessage(Request $request, Room $room)
    {
        $user = Auth::user();
        if (!$room->users->contains($user->id)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate(['message' => 'required|string']);

        $msg = $room->messages()->create([
            'user_id' => Auth::id(),
            'message' => $request->message,
        ]);

        $room->touch();

        broadcast(new RoomMessageSent($msg))->toOthers();

        return response()->json($msg);
    }
}
