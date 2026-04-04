<?php

use App\Events\MessageSent;
use App\Http\Controllers\UserController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user()->load('profile');
});

    Route::middleware('auth:sanctum')->group(function(){
        Route::get('/users/search', [UserController::class,'search']);
    });

Route::prefix('dates')->group(base_path('routes/api/dates.php'));
Route::prefix('friends')->group(base_path('routes/api/friendships.php'));

Route::post('/test-message', function (Request $request) {
    $sender = auth()->user();
    $receiver = User::find($request->receiver_id);

    broadcast(new MessageSent(
        receiver: $receiver,
        sender: $sender,
        message: $request->message
    ));

    return response()->json(['status' => 'sent']);
});