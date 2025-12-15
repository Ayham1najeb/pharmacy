<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('duty_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pharmacy_id')->constrained()->onDelete('cascade');
            $table->date('duty_date');
            $table->time('start_time')->default('08:00:00');
            $table->time('end_time')->default('08:00:00');
            $table->boolean('is_emergency')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();
            
            // Unique constraint
            $table->unique(['pharmacy_id', 'duty_date']);
            
            // Indexes
            $table->index('duty_date');
            $table->index('is_emergency');
            $table->index(['duty_date', 'is_emergency']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('duty_schedules');
    }
};
