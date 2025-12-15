<?php

namespace Database\Seeders;

use App\Models\DutySchedule;
use App\Models\Neighborhood;
use App\Models\Pharmacy;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestDutySeeder extends Seeder
{
    public function run(): void
    {
        // Get or create a neighborhood
        $neighborhood = Neighborhood::first();
        if (!$neighborhood) {
            $neighborhood = Neighborhood::create(['name' => 'حي المركز']);
        }

        // Create first user and pharmacy (صيدلية النور)
        $user1 = User::firstOrCreate(
            ['email' => 'noor@test.com'],
            [
                'name' => 'أحمد محمد',
                'password' => Hash::make('password123'),
                'role' => 'pharmacist'
            ]
        );
        
        $pharmacy1 = Pharmacy::firstOrCreate(
            ['user_id' => $user1->id],
            [
                'name' => 'صيدلية النور',
                'owner_name' => 'د. أحمد محمد',
                'phone' => '0933111111',
                'address' => 'شارع الجلاء - معرة النعمان',
                'neighborhood_id' => $neighborhood->id,
                'is_active' => true,
                'is_approved' => true
            ]
        );

        // Create second user and pharmacy (صيدلية الأمل)
        $user2 = User::firstOrCreate(
            ['email' => 'amal@test.com'],
            [
                'name' => 'محمد علي',
                'password' => Hash::make('password123'),
                'role' => 'pharmacist'
            ]
        );
        
        $pharmacy2 = Pharmacy::firstOrCreate(
            ['user_id' => $user2->id],
            [
                'name' => 'صيدلية الأمل',
                'owner_name' => 'د. محمد علي',
                'phone' => '0933222222',
                'address' => 'شارع القوتلي - معرة النعمان',
                'neighborhood_id' => $neighborhood->id,
                'is_active' => true,
                'is_approved' => true
            ]
        );

        // Add duty schedules for December 10, 2025
        DutySchedule::firstOrCreate(
            ['pharmacy_id' => $pharmacy1->id, 'duty_date' => '2025-12-10'],
            ['start_time' => '20:00', 'end_time' => '08:00', 'is_emergency' => false]
        );
        
        DutySchedule::firstOrCreate(
            ['pharmacy_id' => $pharmacy2->id, 'duty_date' => '2025-12-10'],
            ['start_time' => '20:00', 'end_time' => '08:00', 'is_emergency' => false]
        );

        $this->command->info('✅ تم إضافة صيدليتين مناوبتين بتاريخ 10 ديسمبر 2025');
        $this->command->info('   - صيدلية النور');
        $this->command->info('   - صيدلية الأمل');
    }
}
