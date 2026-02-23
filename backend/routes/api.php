<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PropertyController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Example: POST http://localhost:8000/api/auth/register
|--------------------------------------------------------------------------
*/

// Authentication routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->name('auth.register'); // POST /api/auth/register - Register new user
    Route::post('/login', [AuthController::class, 'login'])->name('auth.login'); // POST /api/auth/login - Login user
});


// Protected routes - require authentication
Route::middleware('auth:sanctum')->group(function () {

    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout'); // POST /api/auth/logout - Logout current user
        Route::get('/me', [AuthController::class, 'me'])->name('auth.me'); // GET /api/auth/me - Get current user info
    });

    // Dashboard route
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index'); // GET /api/dashboard - Get dashboard statistics

    // Property routes - /api/properties -  /api/properties/{id}
    Route::prefix('properties')->group(function () {
        Route::get('/', [PropertyController::class, 'index'])->name('properties.index');
        Route::post('/', [PropertyController::class, 'store'])->name('properties.store');
        Route::get('/{id}', [PropertyController::class, 'show'])->name('properties.show');
        Route::put('/{id}', [PropertyController::class, 'update'])->name('properties.update');
        Route::delete('/{id}', [PropertyController::class, 'destroy'])->name('properties.destroy');
    });

});

// Check endpoint (for Docker healthcheck)
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toIso8601String(),
    ]);
});
