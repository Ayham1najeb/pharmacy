<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Insert default neighborhoods
        $neighborhoods = [
            ['name' => 'الحي الشرقي', 'area_code' => 'E01'],
            ['name' => 'الحي الغربي', 'area_code' => 'W01'],
            ['name' => 'الحي الشمالي', 'area_code' => 'N01'],
            ['name' => 'الحي الجنوبي', 'area_code' => 'S01'],
            ['name' => 'المركز', 'area_code' => 'C01'],
            ['name' => 'الصناعة', 'area_code' => 'I01'],
        ];

        foreach ($neighborhoods as $neighborhood) {
            DB::table('neighborhoods')->insertOrIgnore([
                'name' => $neighborhood['name'],
                'area_code' => $neighborhood['area_code'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove default neighborhoods
        DB::table('neighborhoods')->whereIn('area_code', ['E01', 'W01', 'N01', 'S01', 'C01', 'I01'])->delete();
    }
};
