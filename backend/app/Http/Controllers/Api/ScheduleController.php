<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DutySchedule;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class ScheduleController extends Controller
{
    /**
     * Get duty schedules.
     */
    public function index(Request $request): JsonResponse
    {
        $startDate = $request->get('start_date', Carbon::today());
        $endDate = $request->get('end_date', Carbon::today()->addDays(7));

        $schedules = DutySchedule::with(['pharmacy.neighborhood'])
            ->dateRange($startDate, $endDate)
            ->whereHas('pharmacy', function ($query) {
                $query->active();
            })
            ->orderBy('duty_date')
            ->get();

        return response()->json($schedules);
    }

    /**
     * Get calendar view for a specific month.
     */
    public function calendar(int $month, int $year): JsonResponse
    {
        $startDate = Carbon::create($year, $month, 1);
        $endDate = $startDate->copy()->endOfMonth();

        $schedules = DutySchedule::with(['pharmacy.neighborhood'])
            ->dateRange($startDate, $endDate)
            ->whereHas('pharmacy', function ($query) {
                $query->active();
            })
            ->orderBy('duty_date')
            ->get()
            ->groupBy(function ($schedule) {
                return $schedule->duty_date->format('Y-m-d');
            });

        return response()->json($schedules);
    }

    /**
     * Get current week's schedule.
     */
    public function week(): JsonResponse
    {
        $startDate = Carbon::now()->startOfWeek();
        $endDate = Carbon::now()->endOfWeek();

        $schedules = DutySchedule::with(['pharmacy.neighborhood'])
            ->dateRange($startDate, $endDate)
            ->whereHas('pharmacy', function ($query) {
                $query->active();
            })
            ->orderBy('duty_date')
            ->get();

        return response()->json($schedules);
    }
}
