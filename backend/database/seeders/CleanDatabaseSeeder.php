<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CleanDatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Delete ALL test duty schedules for Dec 10
        $deleted = DB::table('duty_schedules')
            ->whereDate('duty_date', '2025-12-10')
            ->delete();
        
        $this->command->info("✅ تم حذف {$deleted} مناوبة من 10 ديسمبر");

        // Check for duplicate pharmacies by name
        $pharmacies = DB::table('pharmacies')
            ->select('name', DB::raw('count(*) as count'))
            ->groupBy('name')
            ->having('count', '>', 1)
            ->get();
        
        foreach ($pharmacies as $p) {
            $this->command->warn("⚠️ صيدلية مكررة: {$p->name} ({$p->count} مرات)");
            
            // Keep only the first one, delete rest
            $allIds = DB::table('pharmacies')
                ->where('name', $p->name)
                ->orderBy('id')
                ->pluck('id');
            
            $toKeep = $allIds->first();
            $toDelete = $allIds->slice(1);
            
            // Delete schedules for pharmacies to be deleted
            DB::table('duty_schedules')->whereIn('pharmacy_id', $toDelete)->delete();
            // Delete the duplicate pharmacies
            DB::table('pharmacies')->whereIn('id', $toDelete)->delete();
            
            $this->command->info("   ✓ أبقيت ID: {$toKeep}, حذفت: " . $toDelete->count());
        }

        // Show current state
        $this->command->info("\n📊 الحالة الحالية:");
        $this->command->info("   عدد الصيدليات: " . DB::table('pharmacies')->count());
        $this->command->info("   عدد المناوبات: " . DB::table('duty_schedules')->count());
    }
}
