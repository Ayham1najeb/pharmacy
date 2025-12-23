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
        // Update pharmacies that don't have coordinates with default Maarrat al-Nu'man coordinates
        // Default center coordinates for Maarrat al-Nu'man
        $defaultLatitude = 35.6476;
        $defaultLongitude = 36.6746;

        // Update all pharmacies without coordinates
        DB::table('pharmacies')
            ->whereNull('latitude')
            ->orWhereNull('longitude')
            ->update([
                'latitude' => $defaultLatitude,
                'longitude' => $defaultLongitude,
                'updated_at' => now(),
            ]);

        // Log the update
        $updatedCount = DB::table('pharmacies')
            ->where('latitude', $defaultLatitude)
            ->where('longitude', $defaultLongitude)
            ->count();

        \Log::info("Updated {$updatedCount} pharmacies with default coordinates");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // We don't reverse this migration as it would remove valid coordinates
        // If needed, coordinates can be updated manually through the admin panel
    }
};
