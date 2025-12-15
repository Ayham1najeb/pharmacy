<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@maarrat-pharmacy.sy',
            'password' => bcrypt('password123'),
        ]);

        User::create([
            'name' => 'Moderator',
            'email' => 'moderator@maarrat-pharmacy.sy',
            'password' => bcrypt('password123'),
        ]);
    }
}
