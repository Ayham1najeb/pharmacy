<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pharmacy;
use App\Models\DutySchedule;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PharmacyController extends Controller
{
    /**
     * Display a listing of active pharmacies.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Pharmacy::with('neighborhood')
            ->active();

        // Search
        if ($request->has('q')) {
            $query->search($request->q);
        }

        // Filter by neighborhood
        if ($request->has('neighborhood')) {
            $query->byNeighborhood($request->neighborhood);
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $pharmacies = $query->paginate($perPage);

        return response()->json($pharmacies);
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
        $schedules = DutySchedule::with(['pharmacy.neighborhood'])
            ->whereDate('duty_date', '>=', now()->toDateString())
            ->orderBy('duty_date', 'asc')
            ->take(9)
            ->whereHas('pharmacy', function ($query) {
                $query->active();
            })
            ->get();

        return response()->json($schedules);
    }

    /**
     * Get pharmacies on duty right now.
     */
    public function onDutyNow(): JsonResponse
    {
        $schedules = DutySchedule::with(['pharmacy.neighborhood'])
            ->current()
            ->whereHas('pharmacy', function ($query) {
                $query->active();
            })
            ->get();

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
