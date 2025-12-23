<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations to add performance indexes.
     */
    public function up(): void
    {
        Schema::table('pharmacies', function (Blueprint $table) {
            // Add indexes for frequently queried columns
            $table->index('is_active', 'idx_pharmacies_is_active');
            $table->index('is_approved', 'idx_pharmacies_is_approved');
            $table->index('neighborhood_id', 'idx_pharmacies_neighborhood_id');
            $table->index(['is_active', 'is_approved'], 'idx_pharmacies_active_approved');
        });

        Schema::table('duty_schedules', function (Blueprint $table) {
            $table->index('duty_date', 'idx_duty_schedules_duty_date');
            $table->index('pharmacy_id', 'idx_duty_schedules_pharmacy_id');
            $table->index(['duty_date', 'pharmacy_id'], 'idx_duty_schedules_date_pharmacy');
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->index('is_approved', 'idx_reviews_is_approved');
            $table->index('pharmacy_id', 'idx_reviews_pharmacy_id');
        });

        Schema::table('neighborhoods', function (Blueprint $table) {
            $table->index('name', 'idx_neighborhoods_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pharmacies', function (Blueprint $table) {
            $table->dropIndex('idx_pharmacies_is_active');
            $table->dropIndex('idx_pharmacies_is_approved');
            $table->dropIndex('idx_pharmacies_neighborhood_id');
            $table->dropIndex('idx_pharmacies_active_approved');
        });

        Schema::table('duty_schedules', function (Blueprint $table) {
            $table->dropIndex('idx_duty_schedules_duty_date');
            $table->dropIndex('idx_duty_schedules_pharmacy_id');
            $table->dropIndex('idx_duty_schedules_date_pharmacy');
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->dropIndex('idx_reviews_is_approved');
            $table->dropIndex('idx_reviews_pharmacy_id');
        });

        Schema::table('neighborhoods', function (Blueprint $table) {
            $table->dropIndex('idx_neighborhoods_name');
        });
    }
};
