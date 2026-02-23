<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

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

    /**
     * Relationship: Properties owned by this user
     *
     * One-to-Many relationship:
     * - One User can have many Properties
     * - Each Property belongs to one User
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function properties()
    {
        return $this->hasMany(Property::class);
    }

    /**
     * Get user's property statistics
     *
     * Calculates aggregate data for dashboard display
     *
     * @return array<string, mixed>
     */
    public function getPropertyStats(): array
    {
        return [
            'total_properties' => $this->properties()->count(),
            'average_price' => $this->properties()->avg('price') ?? 0,
            'total_value' => $this->properties()->sum('price') ?? 0,
            'by_type' => $this->properties()
                ->selectRaw('real_estate_type, COUNT(*) as count')
                ->groupBy('real_estate_type')
                ->pluck('count', 'real_estate_type')
                ->toArray(),
        ];
    }
}
