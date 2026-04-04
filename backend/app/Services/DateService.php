<?php

namespace App\Services;

use App\Models\Date;
use App\Models\User;

class DateService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function getDashboardDates(User $user)
    {
        $user->load(['friendsOfMine', 'friendOf']);

        $friendIds = $user->friends->pluck('id');

        $publicDates = Date::with('user:id,name')
            ->where('is_public', true)
            ->where('user_id', '!=', $user->id)
            ->get();

        $friendsDates = $publicDates
            ->whereIn('user_id', $friendIds)
            ->values();

        $otherPublicDates = $publicDates
            ->whereNotIn('user_id', $friendIds)
            ->values();

        $myDates = $user->dates()->get();

        return [
            'mine' => $myDates,
            'public_friends' => $friendsDates,
            'public_others' => $otherPublicDates,
        ];
    }

    public function getUserDates(User $authUser, int $targetUserId)
    {
        if ($authUser->id !== $targetUserId) {
            abort(403, 'Forbidden');
        }

        return $authUser->dates()->get();
    }

    public function createDate(User $user, array $data)
    {
        return $user->dates()->create($data);
    }
}