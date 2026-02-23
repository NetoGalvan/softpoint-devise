<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{

    // Register a new user
    public function register(RegisterRequest $request)
    {
        // Password is automatically hashed by User model cast
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password, // Auto-hashed by model
        ]);

        // Create API token for the user
        $token = $user->createToken('auth_token')->plainTextToken;

        // Return success response with user data and token
        return response()->json([
            'message' => 'User registered successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    // Login user
    public function login(LoginRequest $request)
    {
        // Auth::attempt() checks credentials and logs user in if valid
        if (!Auth::attempt($request->only('email', 'password'))) {
            // Authentication failed
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401); // 401 Unauthorized
        }

        // Get authenticated user
        $user = Auth::user();

        // Create new API token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Return success response
        return response()->json([
            'message' => 'Login successful',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'token' => $token,
            'token_type' => 'Bearer',
        ], 200);
    }

    // Logout user
    public function logout(Request $request)
    {
        // $request->user() gets authenticated user via Sanctum
        // currentAccessToken() gets the token used for this request
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successful',
        ], 200);
    }

    /**
     * Get authenticated user
     *
     * Returns current user's information based on the token provided in the request.
     */
    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
                'created_at' => $user->created_at,
            ],
        ], 200);
    }
}
