<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create main test user with known credentials
        User::create([
            'name' => 'Ernesto Galván',
            'email' => 'egalvan@example.com',
            'password' => 'password', // Will be hashed automatically
            'email_verified_at' => now(),
        ]);

        $this->command->info('Email: egalvan@example.com');
        $this->command->info('Password: password');

        // Create additional test user
        User::create([
            'name' => 'Daniel Zamudio',
            'email' => 'dani@example.com',
            'password' => 'password',
            'email_verified_at' => now(),
        ]);

        $this->command->info('Email: dani@example.com');
        $this->command->info('Password: password');

        // Create 3 random users
        User::factory()->count(3)->create();

        $this->command->info('3 random users created');
    }
}
