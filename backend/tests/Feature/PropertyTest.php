<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Property;
use App\Models\User;

class PropertyTest extends TestCase
{
    use RefreshDatabase;


    /**
     * Test authenticated user can list their properties
     */
    public function test_user_can_list_their_properties(): void
    {
        $user = User::factory()->create();
        Property::factory()->count(3)->create(['user_id' => $user->id]);

        // Other user's properties (should not be returned)
        Property::factory()->count(2)->create();

        $response = $this->actingAs($user)
            ->getJson('/api/properties');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }


    /**
     * Test user can create a property
     */
    public function test_user_can_create_property(): void
    {
        $user = User::factory()->create();

        $propertyData = [
            'name' => 'Beautiful House',
            'real_estate_type' => 'house',
            'street' => 'Main Street',
            'external_number' => '123',
            'internal_number' => null,
            'neighborhood' => 'Downtown',
            'city' => 'New York',
            'country' => 'US',
            'rooms' => 3,
            'bathrooms' => 2.0,
            'price' => 250000.00,
            'comments' => 'Great location',
        ];

        $response = $this->actingAs($user)
            ->postJson('/api/properties', $propertyData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'data' => ['id', 'name', 'price'],
            ]);

        $this->assertDatabaseHas('properties', [
            'name' => 'Beautiful House',
            'user_id' => $user->id,
        ]);
    }


    /**
     * Test property creation validation
     */
    public function test_property_creation_requires_valid_data(): void
    {
        $user = User::factory()->create();

        // Test missing required fields
        $response = $this->actingAs($user)
            ->postJson('/api/properties', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'name',
                'real_estate_type',
                'street',
                'external_number',
                'city',
                'country',
                'rooms',
                'bathrooms',
                'price',
            ]);

        // Test invalid property type
        $response = $this->actingAs($user)
            ->postJson('/api/properties', [
                'name' => 'Test Property',
                'real_estate_type' => 'invalid_type',
                'street' => 'Main Street',
                'external_number' => '123',
                'neighborhood' => 'Downtown',
                'city' => 'New York',
                'country' => 'US',
                'rooms' => 3,
                'bathrooms' => 2,
                'price' => 250000,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['real_estate_type']);

        // Test invalid country code (must be 2 letters)
        $response = $this->actingAs($user)
            ->postJson('/api/properties', [
                'name' => 'Test Property',
                'real_estate_type' => 'house',
                'street' => 'Main Street',
                'external_number' => '123',
                'neighborhood' => 'Downtown',
                'city' => 'New York',
                'country' => 'USA', // Should be 'US'
                'rooms' => 3,
                'bathrooms' => 2,
                'price' => 250000,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['country']);

        // Test negative price
        $response = $this->actingAs($user)
            ->postJson('/api/properties', [
                'name' => 'Test Property',
                'real_estate_type' => 'house',
                'street' => 'Main Street',
                'external_number' => '123',
                'neighborhood' => 'Downtown',
                'city' => 'New York',
                'country' => 'US',
                'rooms' => 3,
                'bathrooms' => 2,
                'price' => -100, // Invalid
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['price']);
    }


    /**
     * Test internal number is required for apartments
     */
    public function test_internal_number_required_for_apartments(): void
    {
        $user = User::factory()->create();

        // Apartment without internal number (should fail)
        $response = $this->actingAs($user)
            ->postJson('/api/properties', [
                'name' => 'Apartment',
                'real_estate_type' => 'apartment',
                'street' => 'Main Street',
                'external_number' => '123',
                'internal_number' => null, // Required for apartments
                'neighborhood' => 'Downtown',
                'city' => 'New York',
                'country' => 'US',
                'rooms' => 2,
                'bathrooms' => 1,
                'price' => 150000,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['internal_number']);

        // Apartment with internal number (should succeed)
        $response = $this->actingAs($user)
            ->postJson('/api/properties', [
                'name' => 'Apartment',
                'real_estate_type' => 'apartment',
                'street' => 'Main Street',
                'external_number' => '123',
                'internal_number' => '4B',
                'neighborhood' => 'Downtown',
                'city' => 'New York',
                'country' => 'US',
                'rooms' => 2,
                'bathrooms' => 1,
                'price' => 150000,
            ]);

        $response->assertStatus(201);
    }


    /**
     * Test user can view their property
     */
    public function test_user_can_view_their_property(): void
    {
        $user = User::factory()->create();
        $property = Property::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
            ->getJson("/api/properties/{$property->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $property->id,
                    'name' => $property->name,
                ],
            ]);
    }


    /**
     * Test user can update their property
     */
    public function test_user_can_update_their_property(): void
    {
        $user = User::factory()->create();
        $property = Property::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
            ->putJson("/api/properties/{$property->id}", [
                'name' => 'Updated Name',
                'price' => 300000,
                'street' => 'Street 456',
                'external_number' => 'A1',
                'country' => 'US',
            ]);

        $response->assertStatus(200);
        $response->assertJson([
            'message' => 'Property updated successfully',
        ]);

        $this->assertDatabaseHas('properties', [
            'id' => $property->id,
            'name' => 'Updated Name',
            'price' => 300000,
        ]);
    }


    /**
     * Test user cannot update other user's property
     */
    public function test_user_cannot_update_other_users_property(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $property = Property::factory()->create(['user_id' => $user2->id]);

        $response = $this->actingAs($user1)
            ->putJson("/api/properties/{$property->id}", [
                'name' => 'Hacked Name',
                'price' => 300000,
                'street' => 'Street 456',
                'external_number' => 'A1',
                'country' => 'US',
            ]);

        $response->assertStatus(404);
    }

    /**
     * Test user can delete their property (soft delete)
     */
    public function test_user_can_delete_their_property(): void
    {
        $user = User::factory()->create();
        $property = Property::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
            ->deleteJson("/api/properties/{$property->id}");

        $response->assertStatus(200);

        // Verificar que se marcó como inactivo
        $this->assertDatabaseHas('properties', [
            'id' => $property->id,
            'status' => false,
        ]);
    }

    /**
     * Test property filtering by type
     */
    public function test_can_filter_properties_by_type(): void
    {
        $user = User::factory()->create();

        Property::factory()->count(2)->create([
            'user_id' => $user->id,
            'real_estate_type' => 'house',
        ]);

        Property::factory()->count(3)->create([
            'user_id' => $user->id,
            'real_estate_type' => 'apartment',
        ]);

        $response = $this->actingAs($user)
            ->getJson('/api/properties?type=house');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }


    /**
     * Test property sorting
     */
    public function test_can_sort_properties(): void
    {
        $user = User::factory()->create();

        Property::factory()->create([
            'user_id' => $user->id,
            'price' => 100000,
        ]);

        Property::factory()->create([
            'user_id' => $user->id,
            'price' => 300000,
        ]);

        Property::factory()->create([
            'user_id' => $user->id,
            'price' => 200000,
        ]);

        // Sort by price ascending
        $response = $this->actingAs($user)
            ->getJson('/api/properties?sort_by=price&sort_order=asc');

        $response->assertStatus(200);

        $data = $response->json('data');
        $this->assertEquals(100000, $data[0]['price']);
        $this->assertEquals(200000, $data[1]['price']);
        $this->assertEquals(300000, $data[2]['price']);
    }

}
