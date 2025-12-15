<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class ResetUsersSeeder extends Seeder
{
    public function run(): void
    {
        // Disable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // Clear existing users
        DB::table('users')->truncate();
        
        // Enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        
        // Create Admin user
        User::create([
            'name' => 'Admin',
            'email' => 'admin@test.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);

        // Create Pharmacist user
        User::create([
            'name' => 'صيدلية الشفاء',
            'email' => 'pharmacy@test.com',
            'password' => Hash::make('pharmacy123'),
            'role' => 'pharmacist',
        ]);

        echo "Users created successfully!" . PHP_EOL;
        echo "Admin: admin@test.com / admin123" . PHP_EOL;
        echo "Pharmacist: pharmacy@test.com / pharmacy123" . PHP_EOL;
    }
}
