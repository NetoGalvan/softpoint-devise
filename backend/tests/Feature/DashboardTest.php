<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Property;
use App\Models\User;

class DashboardTest extends TestCase
{
    use RefreshDatabase;


    /**
     * Test dashboard returns statistics
     */
    public function test_dashboard_returns_statistics(): void
    {
        $user = User::factory()->create();

        // Create properties with different prices
        Property::factory()->create([
            'user_id' => $user->id,
            'price' => 100000,
            'real_estate_type' => 'house',
        ]);

        Property::factory()->create([
            'user_id' => $user->id,
            'price' => 200000,
            'real_estate_type' => 'apartment',
        ]);

        Property::factory()->create([
            'user_id' => $user->id,
            'price' => 300000,
            'real_estate_type' => 'house',
        ]);

        $response = $this->actingAs($user)
            ->getJson('/api/dashboard');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'statistics' => [
                    'total_properties',
                    'average_price',
                    'total_value',
                ],
                'properties_by_type',
                'recent_properties',
            ]);

        $data = $response->json();

        // Verify statistics
        $this->assertEquals(3, $data['statistics']['total_properties']);
        $this->assertEquals(200000, $data['statistics']['average_price']);
        $this->assertEquals(600000, $data['statistics']['total_value']);
    }


    /**
     * Test dashboard groups properties by type
     */
    public function test_dashboard_groups_properties_by_type(): void
    {
        $user = User::factory()->create();

        Property::factory()->count(2)->create([
            'user_id' => $user->id,
            'real_estate_type' => 'house',
            'price' => 200000,
        ]);

        Property::factory()->count(3)->create([
            'user_id' => $user->id,
            'real_estate_type' => 'apartment',
            'price' => 150000,
        ]);

        $response = $this->actingAs($user)
            ->getJson('/api/dashboard');

        $response->assertStatus(200);

        $propertiesByType = $response->json('properties_by_type');

        // Find house and apartment entries
        $houses = collect($propertiesByType)->firstWhere('type', 'house');
        $apartments = collect($propertiesByType)->firstWhere('type', 'apartment');

        $this->assertEquals(2, $houses['count']);
        $this->assertEquals(200000, $houses['average_price']);

        $this->assertEquals(3, $apartments['count']);
        $this->assertEquals(150000, $apartments['average_price']);
    }


    /**
     * Test dashboard shows recent properties
     */
    public function test_dashboard_shows_recent_properties(): void
    {
        $user = User::factory()->create();

        // Create 7 properties
        Property::factory()->count(7)->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
            ->getJson('/api/dashboard');

        $response->assertStatus(200);

        $recentProperties = $response->json('recent_properties');

        // Should return maximum 5 properties
        $this->assertCount(5, $recentProperties);
    }


    /**
     * Test dashboard only shows user's own data
     */
    public function test_dashboard_only_shows_users_own_data(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        // Create properties for user1
        Property::factory()->count(3)->create(['user_id' => $user1->id]);

        // Create properties for user2
        Property::factory()->count(5)->create(['user_id' => $user2->id]);

        $response = $this->actingAs($user1)
            ->getJson('/api/dashboard');

        $response->assertStatus(200);

        $data = $response->json();

        // user1 should only see their 3 properties
        $this->assertEquals(3, $data['statistics']['total_properties']);
    }


    /**
     * Test dashboard with no properties
     */
    public function test_dashboard_works_with_no_properties(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->getJson('/api/dashboard');

        $response->assertStatus(200);

        $data = $response->json();

        $this->assertEquals(0, $data['statistics']['total_properties']);
        $this->assertEquals(0, $data['statistics']['average_price']);
        $this->assertEquals(0, $data['statistics']['total_value']);
        $this->assertCount(0, $data['properties_by_type']);
        $this->assertCount(0, $data['recent_properties']);
    }

}
