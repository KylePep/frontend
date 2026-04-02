<?php

use App\Http\Controllers\FriendshipController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/', [FriendshipController::class, 'index']);
    Route::post('/', [FriendshipController::class, 'store']);
    Route::patch('/{friendshipId}/accept', [FriendshipController::class, 'accept']);
    Route::patch('/{friendshipId}/decline', [FriendshipController::class, 'decline']);
    Route::delete('/{friendshipId}', [FriendshipController::class, 'destroy']);
});