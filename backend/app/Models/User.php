<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Jobs\SendWelcomeEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

        protected static function booted(){
        static::created(function($user){
            SendWelcomeEmail::dispatch($user)->delay(now()->addSeconds(10));
            $user->profile()->create([
            'bio' => null,
            'avatar' => 'https://i.pravatar.cc/150?u=' . $user->id,
            'preferences' => json_encode([]),
        ]);
        });
    }

        public function dates()
    {
        return $this->hasMany(Date::class);
    }

    public function savedDates()
    {
        return $this->belongsToMany(Date::class, 'saved_dates');
    }

    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    public function friendships()
    {
        return $this->hasMany(Friendship::class);
    }

    public function friendsOfMine()
    {
        return $this->belongsToMany(User::class, 'friendships', 'user_id', 'friend_id')
            ->wherePivot('status', 'accepted');
    }

    public function friendOf()
    {
        return $this->belongsToMany(User::class, 'friendships', 'friend_id', 'user_id')
            ->wherePivot('status', 'accepted');
    }

    public function getFriendsAttribute()
    {
        return $this->friendsOfMine->merge($this->friendOf);
    }

    public function rooms()
    {
        return $this->belongsToMany(Room::class)
            ->withPivot(['joined_at', 'left_at']);
    }

}
