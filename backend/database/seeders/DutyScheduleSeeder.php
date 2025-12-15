<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DutySchedule;
use App\Models\Pharmacy;
use Carbon\Carbon;

class DutyScheduleSeeder extends Seeder
{
    public function run(): void
    {
        $pharmacies = Pharmacy::where('is_active', true)->get();
        
        if ($pharmacies->isEmpty()) {
            $this->command->info('No active pharmacies found. Skipping duty schedule seeder.');
            return;
        }

        // Clear existing schedules
        DutySchedule::truncate();

        $today = Carbon::today();
        $pharmacyCount = $pharmacies->count();
        
        // Create schedules for next 30 days
        for ($i = 0; $i < 30; $i++) {
            $date = $today->copy()->addDays($i);
            
            // Assign pharmacy for each day (rotating)
            $pharmacyIndex = $i % $pharmacyCount;
            $pharmacy = $pharmacies[$pharmacyIndex];
            
            DutySchedule::create([
                'pharmacy_id' => $pharmacy->id,
                'duty_date' => $date->format('Y-m-d'),
                'start_time' => '08:00:00',
                'end_time' => '08:00:00',
                'is_emergency' => false,
                'notes' => null,
            ]);
        }

        $this->command->info('Created 30 duty schedules for the next 30 days.');
    }
}
