<?php

namespace Database\Seeders;

use App\Models\Pharmacy;
use Illuminate\Database\Seeder;

class PharmacySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pharmacies = [
            [
                'name' => 'صيدلية الشفاء',
                'owner_name' => 'د. محمد أحمد',
                'phone' => '0933123456',
                'phone_secondary' => '0944123456',
                'address' => 'شارع الجامع الكبير',
                'neighborhood_id' => 5, // المركز
                'latitude' => 35.6489,
                'longitude' => 36.6739,
                'is_active' => true,
                'notes' => 'صيدلية مركزية - خدمة 24 ساعة',
            ],
            [
                'name' => 'صيدلية النور',
                'owner_name' => 'د. فاطمة علي',
                'phone' => '0933234567',
                'address' => 'الحي الشرقي - قرب المدرسة',
                'neighborhood_id' => 1,
                'latitude' => 35.6500,
                'longitude' => 36.6750,
                'is_active' => true,
            ],
            [
                'name' => 'صيدلية الأمل',
                'owner_name' => 'د. خالد حسن',
                'phone' => '0933345678',
                'address' => 'الحي الغربي - شارع الثورة',
                'neighborhood_id' => 2,
                'latitude' => 35.6470,
                'longitude' => 36.6720,
                'is_active' => true,
            ],
            [
                'name' => 'صيدلية السلام',
                'owner_name' => 'د. أحمد يوسف',
                'phone' => '0933456789',
                'address' => 'الحي الشمالي',
                'neighborhood_id' => 3,
                'latitude' => 35.6510,
                'longitude' => 36.6740,
                'is_active' => true,
            ],
            [
                'name' => 'صيدلية الرحمة',
                'owner_name' => 'د. سارة محمود',
                'phone' => '0933567890',
                'address' => 'الحي الجنوبي - قرب المشفى',
                'neighborhood_id' => 4,
                'latitude' => 35.6460,
                'longitude' => 36.6730,
                'is_active' => true,
            ],
        ];

        foreach ($pharmacies as $pharmacy) {
            Pharmacy::create($pharmacy);
        }
    }
}
