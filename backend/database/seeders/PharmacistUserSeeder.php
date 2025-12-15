<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Pharmacy;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class PharmacistUserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create or get the user
        $user = User::firstOrCreate(
            ['email' => 'pharmacy@test.com'],
            [
                'name' => 'صيدلية الشفاء',
                'password' => Hash::make('pharmacy123'),
                'role' => 'pharmacist',
            ]
        );

        // 2. Ensure a neighborhood exists
        $neighborhood = \App\Models\Neighborhood::firstOrCreate(
            ['name' => 'المركز'],
            ['area_code' => 'C01']
        );

        // 3. Create or update the pharmacy linked to this user
        $pharmacy = Pharmacy::where('user_id', $user->id)->first();

        if (!$pharmacy) {
            // Check if a pharmacy with this name exists but belongs to someone else (or no one)
            $existingPharmacy = Pharmacy::where('name', 'صيدلية الشفاء')->first();
            
            if ($existingPharmacy) {
                // If it exists but has no user, claim it. 
                // Ensure it is active/approved
                $existingPharmacy->is_active = true;
                $existingPharmacy->is_approved = true;
                if (!$existingPharmacy->user_id) {
                    $existingPharmacy->user_id = $user->id;
                }
                $existingPharmacy->save();
            } else {
                // Create new pharmacy linked to user
                Pharmacy::create([
                    'user_id' => $user->id,
                    'name' => 'صيدلية الشفاء',
                    'owner_name' => 'د. محمد أحمد',
                    'phone' => '0933123456',
                    'phone_secondary' => '0944123456',
                    'address' => 'شارع الجامع الكبير',
                    'neighborhood_id' => $neighborhood->id,
                    'latitude' => 35.6489,
                    'longitude' => 36.6739,
                    'is_active' => true,
                    'is_approved' => true,
                    'notes' => 'صيدلية مركزية - خدمة 24 ساعة',
                ]);
            }
        }
    }
}
