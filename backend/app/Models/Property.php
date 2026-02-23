<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;

class Property extends Model
{
    use HasFactory;


    /**
     * Real estate type constants
     * Using constants ensures consistency across the application
     */
    public const TYPE_HOUSE = 'house';
    public const TYPE_APARTMENT = 'apartment';
    public const TYPE_LAND = 'land';
    public const TYPE_COMMERCIAL_GROUND = 'commercial_ground';

    /**
     * Available real estate types
     * Used for validation and dropdowns
     */
    public const TYPES = [
        self::TYPE_HOUSE,
        self::TYPE_APARTMENT,
        self::TYPE_LAND,
        self::TYPE_COMMERCIAL_GROUND,
    ];

    /**
     * Types that require internal number
     * apartments and commercial grounds need internal number
     */
    public const TYPES_REQUIRING_INTERNAL_NUMBER = [
        self::TYPE_APARTMENT,
        self::TYPE_COMMERCIAL_GROUND,
    ];

    /**
     * Types that can have zero bathrooms
     * land and commercial grounds don't require bathrooms
     */
    public const TYPES_ALLOWING_ZERO_BATHROOMS = [
        self::TYPE_LAND,
        self::TYPE_COMMERCIAL_GROUND,
    ];

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'name',
        'real_estate_type',
        'street',
        'external_number',
        'internal_number',
        'neighborhood',
        'city',
        'country',
        'rooms',
        'bathrooms',
        'price',
        'comments',
        'status',
    ];

    /**
     * The attributes that should be cast.
     * @var array<string, string>
     */
    protected $casts = [
        'rooms' => 'integer',
        'bathrooms' => 'decimal:1',  // One decimal place (e.g., 2.5)
        'price' => 'decimal:2',      // Two decimal places for currency
        'status' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relationship: User who owns this property
     *
     * Many-to-One relationship:
     * - Many Properties belong to one User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope: Filter by real estate type
     *
     * Usage:
     * Property::ofType('house')->get()
     * Property::ofType(['house', 'apartment'])->get()
     */
    public function scopeOfType($query, $type)
    {
        if (is_array($type)) {
            return $query->whereIn('real_estate_type', $type);
        }

        return $query->where('real_estate_type', $type);
    }

    /**
     * Scope: Filter by price range
     *
     * Usage:
     * Property::priceRange(100000, 500000)->get()
     * Property::priceRange(null, 300000)->get() // max only
     */
    public function scopePriceRange($query, $min = null, $max = null)
    {
        if ($min !== null) {
            $query->where('price', '>=', $min);
        }

        if ($max !== null) {
            $query->where('price', '<=', $max);
        }

        return $query;
    }

    /**
     * Scope: Recent properties
     *
     * Orders by created_at descending (newest first)
     * Usage:
     * Property::recent()->take(5)->get()
     */
    public function scopeRecent($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    /**
     * Accessor: Get formatted price
     * Usage:
     * $property->formatted_price // "$150,000.00"
     *
     * @return string
     */
    public function getFormattedPriceAttribute(): string
    {
        return '$' . number_format($this->price, 2);
    }

    /**
     * Accessor: Get full address
     * Usage:
     * $property->full_address
     */
    public function getFullAddressAttribute(): string
    {
        $address = $this->street . ' ' . $this->external_number;

        if ($this->internal_number) {
            $address .= ' Int. ' . $this->internal_number;
        }

        $address .= ', ' . $this->neighborhood;
        $address .= ', ' . $this->city;
        $address .= ', ' . strtoupper($this->country);

        return $address;
    }

    /**
     * Check if property type requires internal number
     */
    public function requiresInternalNumber(): bool
    {
        return in_array(
            $this->real_estate_type,
            self::TYPES_REQUIRING_INTERNAL_NUMBER
        );
    }

    /**
     * Check if property type allows zero bathrooms
     */
    public function allowsZeroBathrooms(): bool
    {
        return in_array(
            $this->real_estate_type,
            self::TYPES_ALLOWING_ZERO_BATHROOMS
        );
    }

    /**
     * Get display name for real estate type
     *
     * Converts snake_case to Title Case
     *
     * @return string
     */
    public function getTypeDisplayNameAttribute(): string
    {
        return str_replace('_', ' ', ucwords($this->real_estate_type, '_'));
    }


    /**
     * Scope: Solo propiedades activas
     *
     * Uso: Property::active()->get()
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', true);
    }

    /**
     * Scope: Solo propiedades inactivas
     *
     * Uso: Property::inactive()->get()
     */
    public function scopeInactive(Builder $query): Builder
    {
        return $query->where('status', false);
    }

    /**
     * Soft delete: Marcar como inactivo en lugar de eliminar
     */
    public function deactivate(): bool
    {
        return $this->update(['status' => false]);
    }

    /**
     * Reactivar propiedad
     */
    public function activate(): bool
    {
        return $this->update(['status' => true]);
    }
}
