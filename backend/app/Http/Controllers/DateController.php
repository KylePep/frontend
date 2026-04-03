<?php

namespace App\Http\Controllers;

use App\Services\DateService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DateController extends Controller
{
    public function __construct(
        protected DateService $date_service
    )
    {
        throw new \Exception('Not implemented');
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(
            $this->date_service->getDashboardDates(Auth::user())
        );
    }

    public function userDates($id){
        return response()->json(
            $this->date_service->getUserDates(Auth::user(),$id)
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'require|string|max:255',
            'description' => 'nullable|string|max:2500',
            'is_public' => 'required|boolean',
        ]);

        $date = $this->date_service->createDate(
            Auth::user(),
            $validated
        );

        return response()->json([
            'message' => 'Date Created successfully',
            'data' => $date,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return response()->json([
            'message' => "Showing date {$id}"
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        return response()->json([
            'message' => "Updated date {$id}",
            'data' => $request->all()
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        return response()->json([
            'message' => "Deleted date {$id}"
        ]);
    }
}
