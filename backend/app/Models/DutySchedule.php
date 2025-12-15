<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class DutySchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'pharmacy_id',
        'duty_date',
        'start_time',
        'end_time',
        'is_emergency',
        'notes',
    ];

    protected $casts = [
        'duty_date' => 'date',
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'is_emergency' => 'boolean',
    ];

    protected $appends = ['shift_type'];

    /**
     * Get the shift type based on start and end times.
     */
    public function getShiftTypeAttribute()
    {
        $start = Carbon::parse($this->start_time)->format('H:i');
        $end = Carbon::parse($this->end_time)->format('H:i');

        if ($start === '08:00' && $end === '20:00') {
            return 'day';
        }

        if ($start === '20:00' && $end === '08:00') {
            return 'night';
        }

        return 'full';
    }

    /**
     * Get the pharmacy that owns the duty schedule.
     */
    public function pharmacy(): BelongsTo
    {
        return $this->belongsTo(Pharmacy::class);
    }

    /**
     * Scope a query to only include today's schedules.
     */
    public function scopeToday($query)
    {
        return $query->whereDate('duty_date', Carbon::today());
    }

    /**
     * Scope a query to only include current schedules.
     */
    public function scopeCurrent($query)
    {
        $now = Carbon::now();
        return $query->whereDate('duty_date', $now->toDateString())
                     ->where(function ($q) use ($now) {
                         $q->whereTime('start_time', '<=', $now->toTimeString())
                           ->whereTime('end_time', '>=', $now->toTimeString());
                     });
    }

    /**
     * Scope a query to filter by date range.
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('duty_date', [$startDate, $endDate]);
    }

    /**
     * Scope a query to only include emergency schedules.
     */
    public function scopeEmergency($query)
    {
        return $query->where('is_emergency', true);
    }

    /**
     * Check if schedule is currently active.
     */
    public function getIsActiveAttribute(): bool
    {
        $now = Carbon::now();
        return $this->duty_date->isToday() &&
               $now->between(
                   Carbon::parse($this->start_time),
                   Carbon::parse($this->end_time)
               );
    }
}
