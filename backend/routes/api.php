<?php

use App\Events\MessageSent;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\UserController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user()->load('profile');
});

    Route::middleware('auth:sanctum')->group(function(){
        Route::get('/users/search', [UserController::class,'search']);

        Route::get('/rooms', [RoomController::class, 'index']);
        Route::post('/rooms', [RoomController::class, 'store']);

        Route::post('/rooms/{room}/leave', [RoomController::class, 'leave']);
        Route::post('/rooms/{room}/messages', [RoomController::class, 'sendMessage']);
        Route::get('/rooms/{room}/messages', [RoomController::class, 'messages']);
    });

Route::prefix('dates')->group(base_path('routes/api/dates.php'));
Route::prefix('friends')->group(base_path('routes/api/friendships.php'));
