<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Property;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Property>
 */
class PropertyFactory extends Factory
{

    protected $model = Property::class;

    /** Define the model's default state */
    public function definition(): array
    {
        // Random property type
        $type = fake()->randomElement([
            'house',
            'apartment',
            'land',
            'commercial_ground',
        ]);

        return [
            'user_id' => User::factory(),
            'name' => fake()->words(3, true) . ' Property',
            'real_estate_type' => $type,
            'street' => fake()->streetName(),
            'external_number' => fake()->buildingNumber(),
            'internal_number' => $this->getInternalNumber($type),
            'neighborhood' => fake()->citySuffix() . ' District',
            'city' => fake()->city(),
            'country' => fake()->countryCode(),
            'rooms' => fake()->numberBetween(0, 6),
            'bathrooms' => $this->getBathrooms($type),
            'price' => fake()->randomFloat(2, 50000, 2000000),
            'comments' => fake()->optional(0.6)->sentence(10),
            'status' => true,
        ];
    }

    /** Get internal number based on property type */
    private function getInternalNumber(string $type): ?string
    {
        // Apartments and commercial grounds need internal number
        if (in_array($type, ['apartment', 'commercial_ground'])) {
            return fake()->randomNumber(2, false);
        }

        return null;
    }

    /** Get bathrooms based on property type */
    private function getBathrooms(string $type): float
    {
        // Land and commercial grounds can have 0 bathrooms
        if (in_array($type, ['land', 'commercial_ground'])) {
            return fake()->randomFloat(1, 0, 3);
        }

        // Other types must have at least 1 bathroom
        return fake()->randomFloat(1, 1, 4);
    }

    /** Create a house property */
    public function house(): static
    {
        return $this->state(fn (array $attributes) => [
            'real_estate_type' => 'house',
            'internal_number' => null,
            'rooms' => fake()->numberBetween(2, 6),
            'bathrooms' => fake()->randomFloat(1, 1, 4),
        ]);
    }

    /** Create an apartment property */
    public function apartment(): static
    {
        return $this->state(fn (array $attributes) => [
            'real_estate_type' => 'apartment',
            'internal_number' => fake()->randomNumber(2, false),
            'rooms' => fake()->numberBetween(1, 4),
            'bathrooms' => fake()->randomFloat(1, 1, 3),
        ]);
    }

    /** Create a land property */
    public function land(): static
    {
        return $this->state(fn (array $attributes) => [
            'real_estate_type' => 'land',
            'internal_number' => null,
            'rooms' => 0,
            'bathrooms' => 0,
        ]);
    }

    /** Create a commercial ground property */
    public function commercialGround(): static
    {
        return $this->state(fn (array $attributes) => [
            'real_estate_type' => 'commercial_ground',
            'internal_number' => fake()->randomNumber(2, false),
            'rooms' => fake()->numberBetween(0, 3),
            'bathrooms' => fake()->randomElement([0, 1, 2]),
        ]);
    }

}
