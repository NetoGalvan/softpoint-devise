<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Property;
use App\Models\User;

class PropertySeeder extends Seeder
{
    public function run(): void
    {
        // Get the test user
        $testUser = User::where('email', 'egalvan@example.com')->first();

        if ($testUser) {
            // Create 5 properties for test user
            Property::factory()->count(5)->create([
                'user_id' => $testUser->id,
            ]);

            $this->command->info('5 properties created for test user (egalvan@example.com)');
        }

        // Get the second test user
        $janeUser = User::where('email', 'dani@example.com')->first();

        if ($janeUser) {
            // Create 3 properties for Jane
            Property::factory()->count(3)->create([
                'user_id' => $janeUser->id,
            ]);

            $this->command->info('3 properties created for Jane (dani@example.com)');
        }

        // Create properties for all other users
        $otherUsers = User::whereNotIn('email', ['egalvan@example.com', 'dani@example.com'])->get();

        foreach ($otherUsers as $user) {
            $count = rand(3, 8); // Random number of properties per user

            Property::factory()->count($count)->create([
                'user_id' => $user->id,
            ]);
        }

        $totalOtherUsers = $otherUsers->count();
        $this->command->info("Properties created for {$totalOtherUsers} other users");
    }
}
