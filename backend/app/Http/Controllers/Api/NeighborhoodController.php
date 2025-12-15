<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Neighborhood;
use Illuminate\Http\JsonResponse;

class NeighborhoodController extends Controller
{
    /**
     * Display a listing of neighborhoods.
     */
    public function index(): JsonResponse
    {
        $neighborhoods = Neighborhood::withCount('pharmacies')
            ->orderBy('name')
            ->get();

        return response()->json($neighborhoods);
    }

    /**
     * Get pharmacies in a specific neighborhood.
     */
    public function pharmacies(int $id): JsonResponse
    {
        $neighborhood = Neighborhood::with(['pharmacies' => function ($query) {
            $query->active();
        }])->findOrFail($id);

        return response()->json($neighborhood);
    }
}
