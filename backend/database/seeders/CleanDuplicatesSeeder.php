<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CleanDuplicatesSeeder extends Seeder
{
    public function run(): void
    {
        // Find and delete duplicate schedules (same pharmacy + same date)
        $duplicates = DB::table('duty_schedules as ds1')
            ->join('duty_schedules as ds2', function ($join) {
                $join->on('ds1.pharmacy_id', '=', 'ds2.pharmacy_id')
                     ->on('ds1.duty_date', '=', 'ds2.duty_date')
                     ->whereColumn('ds1.id', '>', 'ds2.id');
            })
            ->select('ds1.id')
            ->pluck('id');

        $count = $duplicates->count();
        
        if ($count > 0) {
            DB::table('duty_schedules')->whereIn('id', $duplicates)->delete();
            $this->command->info("✅ تم حذف {$count} سجل مكرر");
        } else {
            $this->command->info("✅ لا توجد سجلات مكررة");
        }

        // Show remaining schedules for Dec 10
        $dec10 = DB::table('duty_schedules')
            ->join('pharmacies', 'duty_schedules.pharmacy_id', '=', 'pharmacies.id')
            ->whereDate('duty_date', '2025-12-10')
            ->select('pharmacies.name', 'duty_schedules.duty_date')
            ->get();

        $this->command->info("📅 مناوبات 10 ديسمبر:");
        foreach ($dec10 as $schedule) {
            $this->command->info("   - {$schedule->name}");
        }
    }
}
