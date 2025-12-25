<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Neighborhood;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class NeighborhoodController extends Controller
{
    /**
     * Display a listing of neighborhoods.
     */
    public function index(): JsonResponse
    {
        // Auto-seed neighborhoods if empty
        if (Neighborhood::count() === 0) {
            $neighborhoods = [
                ['name' => 'الحي الشرقي', 'area_code' => 'E01'],
                ['name' => 'الحي الغربي', 'area_code' => 'W01'],
                ['name' => 'الحي الشمالي', 'area_code' => 'N01'],
                ['name' => 'الحي الجنوبي', 'area_code' => 'S01'],
                ['name' => 'المركز', 'area_code' => 'C01'],
                ['name' => 'الصناعة', 'area_code' => 'I01'],
            ];

            foreach ($neighborhoods as $neighborhood) {
                Neighborhood::create($neighborhood);
            }
            // Clear cache after seeding
            Cache::forget('neighborhoods_list');
        }

        // Cache neighborhoods for 10 minutes - they rarely change
        $neighborhoods = Cache::remember('neighborhoods_list', 600, function () {
            return Neighborhood::withCount('pharmacies')
                ->orderBy('name')
                ->get();
        });

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
