<?php

namespace App\Http\Controllers;

use App\Models\Friendship;
use App\Models\User;
use App\Services\FriendshipService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{

    public function __construct(
        protected FriendshipService $friendshipService
    ) {}
    
    public function search(Request $request)
    {
        $query = $request->query('name');

        if (!$query) {
            return response()->json([
                'message' => 'Name query is required'
            ], 400);
        }

        $results = $this->friendshipService
            ->getUserSearchResults(Auth::id(), $query);

        return response()->json($results);
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
