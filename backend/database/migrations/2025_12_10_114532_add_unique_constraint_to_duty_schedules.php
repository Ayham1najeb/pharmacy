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
        // First, delete duplicates (keep the one with lowest ID)
        $duplicates = DB::select("
            SELECT ds1.id
            FROM duty_schedules ds1
            INNER JOIN duty_schedules ds2 
                ON ds1.pharmacy_id = ds2.pharmacy_id 
                AND ds1.duty_date = ds2.duty_date 
                AND ds1.id > ds2.id
        ");

        $idsToDelete = array_column($duplicates, 'id');
        if (!empty($idsToDelete)) {
            DB::table('duty_schedules')->whereIn('id', $idsToDelete)->delete();
        }

        // Now add unique constraint
        Schema::table('duty_schedules', function (Blueprint $table) {
            $table->unique(['pharmacy_id', 'duty_date'], 'unique_pharmacy_duty_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('duty_schedules', function (Blueprint $table) {
            $table->dropUnique('unique_pharmacy_duty_date');
        });
    }
};
