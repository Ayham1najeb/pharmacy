<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Neighborhood;
use App\Models\Pharmacy;

class MapTestDataSeeder extends Seeder
{
    public function run(): void
    {
        // Create neighborhoods if they don't exist
        $neighborhoods = [
            ['name' => 'الحي الشرقي'],
            ['name' => 'الحي الغربي'],
            ['name' => 'الحي الشمالي'],
            ['name' => 'المركز'],
        ];

        foreach ($neighborhoods as $hood) {
            Neighborhood::firstOrCreate(['name' => $hood['name']], $hood);
        }

        // Get neighborhood IDs
        $eastId = Neighborhood::where('name', 'الحي الشرقي')->first()->id;
        $westId = Neighborhood::where('name', 'الحي الغربي')->first()->id;
        $northId = Neighborhood::where('name', 'الحي الشمالي')->first()->id;
        $centerId = Neighborhood::where('name', 'المركز')->first()->id;

        // Create pharmacies with real coordinates around Maarrat al-Nu'man
        $pharmacies = [
            [
                'name' => 'صيدلية الشفاء',
                'owner_name' => 'محمد أحمد',
                'phone' => '0933123456',
                'address' => 'شارع الجامع الكبير',
                'neighborhood_id' => $centerId,
                'latitude' => '35.6476',
                'longitude' => '36.6746',
                'is_active' => true,
                'is_approved' => true,
            ],
            [
                'name' => 'صيدلية النور',
                'owner_name' => 'علي محمود',
                'phone' => '0944234567',
                'address' => 'شارع الثورة',
                'neighborhood_id' => $eastId,
                'latitude' => '35.6490',
                'longitude' => '36.6770',
                'is_active' => true,
                'is_approved' => true,
            ],
            [
                'name' => 'صيدلية الأمل',
                'owner_name' => 'فاطمة خالد',
                'phone' => '0955345678',
                'address' => 'شارع المدينة',
                'neighborhood_id' => $westId,
                'latitude' => '35.6460',
                'longitude' => '36.6720',
                'is_active' => true,
                'is_approved' => true,
            ],
            [
                'name' => 'صيدلية السلام',
                'owner_name' => 'أحمد حسن',
                'phone' => '0966456789',
                'address' => 'شارع الحرية',
                'neighborhood_id' => $northId,
                'latitude' => '35.6500',
                'longitude' => '36.6750',
                'is_active' => true,
                'is_approved' => true,
            ],
            [
                'name' => 'صيدلية الرحمة',
                'owner_name' => 'سارة عمر',
                'phone' => '0977567890',
                'address' => 'شارع السوق',
                'neighborhood_id' => $centerId,
                'latitude' => '35.6470',
                'longitude' => '36.6755',
                'is_active' => true,
                'is_approved' => true,
            ],
            [
                'name' => 'صيدلية الحياة',
                'owner_name' => 'يوسف إبراهيم',
                'phone' => '0988678901',
                'address' => 'شارع الجلاء',
                'neighborhood_id' => $eastId,
                'latitude' => '35.6485',
                'longitude' => '36.6765',
                'is_active' => true,
                'is_approved' => true,
            ],
        ];

        foreach ($pharmacies as $pharmacy) {
            Pharmacy::updateOrCreate(
                ['name' => $pharmacy['name']],
                $pharmacy
            );
        }

        $this->command->info('✓ تم إضافة ' . count($neighborhoods) . ' أحياء و ' . count($pharmacies) . ' صيدليات بنجاح!');
    }
}
