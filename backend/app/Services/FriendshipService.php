<?php

namespace App\Services;

use App\Models\Friendship;
use App\Models\User;

class FriendshipService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function getFriendships(int $userId)
    {
        $friendships = Friendship::with([
            'user.profile:id,user_id,avatar',
            'friend.profile:id,user_id,avatar'
        ])
        ->where(function ($query) use ($userId) {
            $query->where('user_id', $userId)
                  ->orWhere('friend_id', $userId);
        })
        ->get();

        $accepted = [];
        $incoming = [];
        $outgoing = [];

        foreach ($friendships as $f) {
            $isSender = $f->user_id === $userId;
            $otherUser = $isSender ? $f->friend : $f->user;

            $formatted = [
                'id' => $otherUser->id,
                'name' => $otherUser->name,
                'profile' => [
                    'avatar' => $otherUser->profile?->avatar,
                ],
                'friendship_id' => $f->id,
            ];

            if ($f->status === 'accepted') {
                $accepted[] = $formatted;
            } elseif ($f->status === 'pending') {
                $isSender ? $outgoing[] = $formatted : $incoming[] = $formatted;
            }
        }

        return compact('accepted', 'incoming', 'outgoing');
    }

    public function sendRequest(int $userId, int $friendId)
    {
        $exists = Friendship::where(function ($query) use ($userId, $friendId) {
            $query->where('user_id', $userId)
                  ->where('friend_id', $friendId);
        })->orWhere(function ($query) use ($userId, $friendId) {
            $query->where('user_id', $friendId)
                  ->where('friend_id', $userId);
        })->exists();

        if ($exists) {
            abort(409, 'Friend request already exists');
        }

        return Friendship::create([
            'user_id' => $userId,
            'friend_id' => $friendId,
            'status' => 'pending',
        ]);
    }

    public function accept(int $userId, int $friendshipId)
    {
        $friendship = $this->resolve($userId, $friendshipId, true);
        $friendship->update(['status' => 'accepted']);
    }

    public function decline(int $userId, int $friendshipId)
    {
        $friendship = $this->resolve($userId, $friendshipId, true);
        $friendship->update(['status' => 'declined']);
    }

    public function remove(int $userId, int $friendshipId)
    {
        $friendship = $this->resolve($userId, $friendshipId);
        $friendship->delete();
    }

    protected function resolve(int $userId, int $friendshipId, bool $requireRecipient = false): Friendship
    {
        $friendship = Friendship::findOrFail($friendshipId);

        if ($friendship->user_id !== $userId && $friendship->friend_id !== $userId) {
            abort(403, 'Unauthorized');
        }

        if ($requireRecipient && $friendship->friend_id !== $userId) {
            abort(403, 'Only recipient can perform this action');
        }

        return $friendship;
    }

    public function getUserSearchResults(int $currentUserId, string $query)
    {
        // Get friendships
        $friendships = Friendship::where(function ($q) use ($currentUserId) {
            $q->where('user_id', $currentUserId)
              ->orWhere('friend_id', $currentUserId);
        })->get();

        $friendshipMap = [];

        foreach ($friendships as $f) {
            $otherUserId = $f->user_id === $currentUserId
                ? $f->friend_id
                : $f->user_id;

            $friendshipMap[$otherUserId] = $f;
        }

        // Search users
        $users = User::where('name', 'LIKE', "%{$query}%")
            ->where('id', '!=', $currentUserId)
            ->select('id', 'name')
            ->with(['profile:id,user_id,avatar'])
            ->limit(10)
            ->get();

        $available = [];
        $existing = [];

        foreach ($users as $user) {
            $friendship = $friendshipMap[$user->id] ?? null;

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
                $existing[] = $formatted;
            } else {
                $available[] = $formatted;
            }
        }

        return [
            'available' => $available,
            'existing' => $existing,
        ];
    }

}
