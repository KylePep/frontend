<?php

namespace App\Http\Controllers;

use App\Models\Friendship;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function search(Request $request){

        $userId = Auth::id();

        $query = $request->query('name');

        if (!$query){
            return response()->json([
                'message' => 'Name query is required'
            ], 400);
        }

        
        // Get all friendships involving current user
        $friendships = Friendship::where(function ($q) use ($userId) {
            $q->where('user_id', $userId)
            ->orWhere('friend_id', $userId);
        })->get();

        // Map: other_user_id => friendship
        $friendshipMap = [];

        foreach ($friendships as $f) {
        $otherUserId = $f->user_id === $userId
            ? $f->friend_id
            : $f->user_id;

        $friendshipMap[$otherUserId] = $f;
    }
        
        // Search users
        $users = User::where('name', 'LIKE', "%{$query}%")
            ->where('id', '!=', $userId) // exclude self
            ->select('id', 'name')
            ->with(['profile:id,user_id,avatar'])
            ->limit(10)
            ->get();

        $available = [];
        $existing = [];

        foreach ($users as $user) {
            $friendship = $friendshipMap[$user->id] ?? null;

            // Skip declined entirely
            if ($friendship && $friendship->status === 'declined') {
                continue;
            }

            $formatted = [
                'id' => $user->id,
                'name' => $user->name,
                'profile' => [
                    'avatar' => $user->profile?->avatar,
                ],
                'friendship_id' => $friendship?->id,
                'status' => $friendship?->status,
            ];

            if ($friendship) {
                $existing[] = $formatted; // pending or accepted
            } else {
                $available[] = $formatted; // no relationship
            }
        }

        return response()->json([
            'available' => $available,
            'existing' => $existing,
        ]);
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}
