<?php

use App\Http\Controllers\AuthController;
use App\Mail\WelcomeMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;

Route::get('/test', function () {
    return ['message' => 'API working'];
});

Route::get('/test-mail', function(){
    Mail::to('test@example.com')->send(new WelcomeMail('Kyle'));
    return 'Mail send (check logs)';
});

Route::prefix('auth')->group(function(){
    Route::post('/register', [AuthController::class,'register']);
    Route::post('/login', [AuthController::class,'login']);

    Route::middleware('auth:sanctum')->group(function(){
        Route::post('/logout', [AuthController::class,'logout']);
        Route::get('/user', [AuthController::class,'user']);
    });

});

Route::prefix('dates')->group(base_path('routes/api/dates.php'));