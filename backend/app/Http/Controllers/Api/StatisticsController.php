<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pharmacy;
use App\Models\DutySchedule;
use App\Models\Neighborhood;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class StatisticsController extends Controller
{
    /**
     * Get general statistics.
     */
    public function index(): JsonResponse
    {
        $stats = [
            'total_pharmacies' => Pharmacy::count(),
            'active_pharmacies' => Pharmacy::active()->count(),
            'total_neighborhoods' => Neighborhood::count(),
            'on_duty_today_count' => DutySchedule::today()
                ->whereHas('pharmacy', function ($query) {
                    $query->active();
                })
                ->count(),
            'on_duty_now_count' => DutySchedule::current()
                ->whereHas('pharmacy', function ($query) {
                    $query->active();
                })
                ->count(),
            'total_schedules_this_month' => DutySchedule::whereBetween('duty_date', [
                Carbon::now()->startOfMonth(),
                Carbon::now()->endOfMonth()
            ])->count(),
        ];

        return response()->json($stats);
    }
}
