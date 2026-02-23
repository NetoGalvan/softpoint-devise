<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;

class AuthTest extends TestCase
{
    use RefreshDatabase;


    /**
     * Test user registration
     *
     * Verifies that a user can register successfully
     */
    public function test_user_can_register(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'user' => ['id', 'name', 'email'],
                'token',
            ]);

        // Verify user was created in database
        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com',
        ]);
    }


    /**
     * Test registration validation
     *
     * Verifies that registration fails with invalid data
     */
    public function test_registration_requires_valid_data(): void
    {
        // Test missing name
        $response = $this->postJson('/api/auth/register', [
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);

        // Test invalid email
        $response = $this->postJson('/api/auth/register', [
            'name' => 'John Doe',
            'email' => 'invalid-email',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);

        // Test password too short
        $response = $this->postJson('/api/auth/register', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'short',
            'password_confirmation' => 'short',
        ]);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);

        // Test password confirmation mismatch
        $response = $this->postJson('/api/auth/register', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'different123',
        ]);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }


    /**
     * Test duplicate email registration
     */
    public function test_cannot_register_with_duplicate_email(): void
    {
        // Create existing user
        User::factory()->create(['email' => 'existing@example.com']);

        // Try to register with same email
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Jane Doe',
            'email' => 'existing@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }


    /**
     * Test user login
     */
    public function test_user_can_login(): void
    {
        // Create user
        $user = User::factory()->create([
            'email' => 'john@example.com',
            'password' => 'password123',
        ]);

        // Login
        $response = $this->postJson('/api/auth/login', [
            'email' => 'john@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'user' => ['id', 'name', 'email'],
                'token',
            ]);
    }


    /**
     * Test login with invalid credentials
     */
    public function test_login_fails_with_invalid_credentials(): void
    {
        // Create user
        User::factory()->create([
            'email' => 'john@example.com',
            'password' => 'correctpassword',
        ]);

        // Try login with wrong password
        $response = $this->postJson('/api/auth/login', [
            'email' => 'john@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
            ->assertJson(['message' => 'Invalid credentials']);

        // Try login with non-existent email
        $response = $this->postJson('/api/auth/login', [
            'email' => 'nonexistent@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(401);
    }


    /**
     * Test user logout
     */
    public function test_user_can_logout(): void
    {
        // Create and authenticate user
        $user = User::factory()->create();
        $token = $user->createToken('test_token')->plainTextToken;

        // Logout
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/auth/logout');

        $response->assertStatus(200)
            ->assertJson(['message' => 'Logout successful']);

        // Verify token was deleted
        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $user->id,
        ]);
    }


    /**
     * Test get authenticated user info
     */
    public function test_can_get_authenticated_user_info(): void
    {
        // Create and authenticate user
        $user = User::factory()->create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
        ]);
        $token = $user->createToken('test_token')->plainTextToken;

        // Get user info
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/auth/me');

        $response->assertStatus(200)
            ->assertJson([
                'user' => [
                    'id' => $user->id,
                    'name' => 'John Doe',
                    'email' => 'john@example.com',
                ],
            ]);
    }


    /**
     * Test protected routes require authentication
     */
    public function test_protected_routes_require_authentication(): void
    {
        // Try to access protected route without token
        $response = $this->getJson('/api/auth/me');
        $response->assertStatus(401);

        $response = $this->postJson('/api/auth/logout');
        $response->assertStatus(401);

        $response = $this->getJson('/api/properties');
        $response->assertStatus(401);
    }

}
