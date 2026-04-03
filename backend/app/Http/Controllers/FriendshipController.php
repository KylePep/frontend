<?php

namespace App\Http\Controllers;

use App\Services\FriendshipService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FriendshipController extends Controller
{
    public function __construct(
        protected FriendshipService $friendshipService
    ) {}
    /**
     * List friendships (accepted + pending)
     */
    public function index()
    {
        return response()->json(
            $this->friendshipService->getFriendships(Auth::id())
        );
    }


    /**
     * Send a friend request
     */
    public function store(Request $request)
    {
        $request->validate([
            'friend_id' => 'required|exists:users,id|different:' . Auth::id(),
        ]);

        $friendship = $this->friendshipService->sendRequest(
            Auth::id(),
            $request->friend_id
        );

        return response()->json($friendship, 201);
    }

    /**
     * Accept a friend request
     */
    public function accept($id)
    {
        $this->friendshipService->accept(Auth::id(), $id);
        return response()->json(['message' => 'Friend request accepted']);
    }


    /**
     * Decline a friend request
     */
    public function decline($id)
    {
        $this->friendshipService->accept(Auth::id(), $id);

        return response()->json(['message' => 'Friend request declined']);
    }

    /**
     * Remove friendship (unfriend)
     */
    public function destroy($id)
    {
        $this->friendshipService->remove(Auth::id(), $id);

        return response()->json(['message' => 'Friend removed']);
    }
}
