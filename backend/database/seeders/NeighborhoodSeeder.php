<?php

namespace Database\Seeders;

use App\Models\Neighborhood;
use Illuminate\Database\Seeder;

class NeighborhoodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $neighborhoods = [
            ['name' => 'الحي الشرقي', 'area_code' => 'E01'],
            ['name' => 'الحي الغربي', 'area_code' => 'W01'],
            ['name' => 'الحي الشمالي', 'area_code' => 'N01'],
            ['name' => 'الحي الجنوبي', 'area_code' => 'S01'],
            ['name' => 'المركز', 'area_code' => 'C01'],
            ['name' => 'الصناعة', 'area_code' => 'I01'],
        ];

        foreach ($neighborhoods as $neighborhood) {
            Neighborhood::firstOrCreate(
                ['name' => $neighborhood['name']],
                ['area_code' => $neighborhood['area_code']]
            );
        }
    }
}
