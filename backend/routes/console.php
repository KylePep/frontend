<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use App\Models\Room;
use Illuminate\Console\Scheduling\Schedule;

Artisan::command('rooms:cleanup', function () {
    $threshold = now()->subMinutes(5);
    $deleted = Room::where('updated_at', '<', $threshold)
    ->delete();

    $this->info("Deleted {$deleted} empty rooms.");
})->purpose('Delete empty rooms');


