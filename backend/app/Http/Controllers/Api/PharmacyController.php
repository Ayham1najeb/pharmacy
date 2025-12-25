<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PharmacyResource;
use App\Http\Resources\DutyScheduleResource;
use App\Models\Pharmacy;
use App\Models\DutySchedule;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class PharmacyController extends Controller
{
    /**
     * Display a listing of active pharmacies.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Pharmacy::select(['id', 'name', 'owner_name', 'phone', 'address', 'neighborhood_id', 'latitude', 'longitude'])
            ->with('neighborhood:id,name')
            ->where('is_active', true)
            ->where('is_approved', true);

        // Search
        if ($request->has('q')) {
            $query->search($request->q);
        }

        // Filter by neighborhood
        if ($request->has('neighborhood')) {
            $query->byNeighborhood($request->neighborhood);
        }

        // Get all for map (no pagination needed for map view)
        $pharmacies = $query->get();

        return response()->json(PharmacyResource::collection($pharmacies));
    }

    /**
     * Display the specified pharmacy.
     */
    public function show(int $id): JsonResponse
    {
        $pharmacy = Pharmacy::with(['neighborhood', 'approvedReviews'])
            ->findOrFail($id);

        return response()->json($pharmacy);
    }

    /**
     * Get pharmacies on duty today.
     */
    /**
     * Get pharmacies on duty today and upcoming.
     */
    public function onDutyToday(): JsonResponse
    {
        // Cache for 3 minutes to reduce database load
        $schedules = Cache::remember('on_duty_today', 180, function () {
            return DutySchedule::select(['id', 'pharmacy_id', 'duty_date'])
                ->with(['pharmacy:id,name,owner_name,address,phone,neighborhood_id,latitude,longitude', 'pharmacy.neighborhood:id,name'])
                ->whereDate('duty_date', '>=', now()->toDateString())
                ->whereHas('pharmacy', function ($query) {
                    $query->where('is_active', true)->where('is_approved', true);
                })
                ->orderBy('duty_date', 'asc')
                ->limit(9)
                ->get();
        });

        return response()->json(DutyScheduleResource::collection($schedules));
    }

    /**
     * Get pharmacies on duty right now.
     */
    public function onDutyNow(): JsonResponse
    {
        // Cache for 1 minute - needs to be more real-time
        $schedules = Cache::remember('on_duty_now', 60, function () {
            return DutySchedule::with(['pharmacy.neighborhood'])
                ->current()
                ->whereHas('pharmacy', function ($query) {
                    $query->active();
                })
                ->get();
        });

        return response()->json($schedules);
    }

    /**
     * Search pharmacies.
     */
    public function search(Request $request): JsonResponse
    {
        $query = Pharmacy::with('neighborhood')
            ->active();

        if ($request->has('q')) {
            $query->search($request->q);
        }

        if ($request->has('neighborhood')) {
            $query->byNeighborhood($request->neighborhood);
        }

        $pharmacies = $query->get();

        return response()->json($pharmacies);
    }
}
