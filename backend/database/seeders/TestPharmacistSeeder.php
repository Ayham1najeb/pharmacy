<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Pharmacy;
use Illuminate\Database\Seeder;

class TestPharmacistSeeder extends Seeder
{
    public function run(): void
    {
        // Create pharmacist user
        $user = User::create([
            'name' => 'Test Pharmacist',
            'email' => 'pharmacist@test.com',
            'password' => bcrypt('password123'),
            'role' => 'pharmacist',
        ]);

        // Create pharmacy for this user
        Pharmacy::create([
            'user_id' => $user->id,
            'name' => 'صيدلية الاختبار',
            'owner_name' => 'أحمد محمد',
            'phone' => '0933123456',
            'address' => 'معرة النعمان - المركز - شارع الجمهورية',
            'neighborhood_id' => 1,
            'is_active' => true,
            'is_approved' => true,
        ]);

        echo "Created pharmacist: pharmacist@test.com / password123\n";
    }
}
