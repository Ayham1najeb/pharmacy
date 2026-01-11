<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Pharmacy;
use Illuminate\Database\Seeder;

class AddTwoPharmaciesSeeder extends Seeder
{
    public function run(): void
    {
        // إنشاء الصيدلية الأولى
        $user1 = User::create([
            'name' => 'Pharmacy Owner 1',
            'email' => 'pharmacy1@test.com',
            'password' => bcrypt('123456'),
            'role' => 'pharmacist',
        ]);

        $pharmacy1 = Pharmacy::create([
            'user_id' => $user1->id,
            'name' => 'صيدلية النور',
            'owner_name' => 'محمد أحمد',
            'phone' => '0933111222',
            'address' => 'معرة النعمان - حي الشمال - شارع الثورة',
            'neighborhood_id' => 1,
            'is_active' => true,
            'is_approved' => true,
        ]);

        // إنشاء الصيدلية الثانية
        $user2 = User::create([
            'name' => 'Pharmacy Owner 2',
            'email' => 'pharmacy2@test.com',
            'password' => bcrypt('123456'),
            'role' => 'pharmacist',
        ]);

        $pharmacy2 = Pharmacy::create([
            'user_id' => $user2->id,
            'name' => 'صيدلية الشفاء',
            'owner_name' => 'خالد يوسف',
            'phone' => '0933333444',
            'address' => 'معرة النعمان - حي الجنوب - شارع السلام',
            'neighborhood_id' => 2,
            'is_active' => true,
            'is_approved' => true,
        ]);

        echo "\n✅ Created 2 pharmacies!\n\n";
        echo "Pharmacy 1: صيدلية النور\n";
        echo "  Email: pharmacy1@test.com\n";
        echo "  Password: 123456\n";
        echo "  Owner: محمد أحمد\n\n";
        
        echo "Pharmacy 2: صيدلية الشفاء\n";
        echo "  Email: pharmacy2@test.com\n";
        echo "  Password: 123456\n";
        echo "  Owner: خالد يوسف\n\n";
        
        echo "Total pharmacies: " . Pharmacy::count() . "\n";
    }
}
