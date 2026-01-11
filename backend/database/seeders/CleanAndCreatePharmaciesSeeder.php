<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Pharmacy;
use Illuminate\Database\Seeder;

class CleanAndCreatePharmaciesSeeder extends Seeder
{
    public function run(): void
    {
        // حذف جميع الصيدليات ما عدا صيدلية الاختبار (user_id = 14)
        $pharmaciesToDelete = Pharmacy::where('user_id', '!=', 14)->get();
        
        foreach ($pharmaciesToDelete as $pharmacy) {
            $userId = $pharmacy->user_id;
            $pharmacy->delete();
            
            // حذف المستخدم المرتبط
            $user = User::find($userId);
            if ($user && $user->role === 'pharmacist') {
                $user->delete();
            }
        }

        // إنشاء الصيدلية الأولى
        $user1 = User::create([
            'name' => 'Pharmacy Owner 1',
            'email' => 'pharmacy1@test.com',
            'password' => bcrypt('123456'),
            'role' => 'pharmacist',
        ]);

        Pharmacy::create([
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

        Pharmacy::create([
            'user_id' => $user2->id,
            'name' => 'صيدلية الشفاء',
            'owner_name' => 'خالد يوسف',
            'phone' => '0933333444',
            'address' => 'معرة النعمان - حي الجنوب - شارع السلام',
            'neighborhood_id' => 2,
            'is_active' => true,
            'is_approved' => true,
        ]);

        echo "\n✅ Setup complete!\n";
        echo "Total pharmacies: " . Pharmacy::count() . "\n\n";
        echo "Pharmacy 1: pharmacy1@test.com / 123456\n";
        echo "Pharmacy 2: pharmacy2@test.com / 123456\n";
    }
}
