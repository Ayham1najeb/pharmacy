<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pharmacy;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class PharmacyController extends Controller
{
    /**
     * Display a listing of pharmacies (including inactive).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Pharmacy::with('neighborhood');

        // Search
        if ($request->has('q')) {
            $query->search($request->q);
        }

        // Filter by neighborhood
        if ($request->has('neighborhood')) {
            $query->byNeighborhood($request->neighborhood);
        }

        // Filter by status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $pharmacies = $query->paginate($perPage);

        return response()->json($pharmacies);
    }

    /**
     * Store a newly created pharmacy.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'owner_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'phone_secondary' => 'nullable|string|max:20',
            'address' => 'required|string',
            'neighborhood_id' => 'required|exists:neighborhoods,id',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'is_active' => 'boolean',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $pharmacy = Pharmacy::create($request->all());

        // Log activity
        activity()
            ->causedBy($request->user())
            ->performedOn($pharmacy)
            ->withProperties(['attributes' => $pharmacy->toArray()])
            ->log('Created pharmacy');

        return response()->json($pharmacy, 201);
    }

    /**
     * Display the specified pharmacy.
     */
    public function show(int $id): JsonResponse
    {
        $pharmacy = Pharmacy::with(['neighborhood', 'reviews', 'dutySchedules'])
            ->findOrFail($id);

        return response()->json($pharmacy);
    }

    /**
     * Update the specified pharmacy.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $pharmacy = Pharmacy::findOrFail($id);
        $oldValues = $pharmacy->toArray();

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'owner_name' => 'string|max:255',
            'phone' => 'string|max:20',
            'phone_secondary' => 'nullable|string|max:20',
            'address' => 'string',
            'neighborhood_id' => 'exists:neighborhoods,id',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'is_active' => 'boolean',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $pharmacy->update($request->all());

        // Log activity
        activity()
            ->causedBy($request->user())
            ->performedOn($pharmacy)
            ->withProperties([
                'old' => $oldValues,
                'attributes' => $pharmacy->fresh()->toArray()
            ])
            ->log('Updated pharmacy');

        return response()->json($pharmacy);
    }

    /**
     * Remove the specified pharmacy (soft delete).
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $pharmacy = Pharmacy::findOrFail($id);
        $pharmacy->delete();

        // Log activity
        activity()
            ->causedBy($request->user())
            ->performedOn($pharmacy)
            ->log('Deleted pharmacy');

        return response()->json(['message' => 'Pharmacy deleted successfully']);
    }

    /**
     * Toggle pharmacy active status.
     */
    public function toggleActive(Request $request, int $id): JsonResponse
    {
        $pharmacy = Pharmacy::findOrFail($id);
        $oldStatus = $pharmacy->is_active;
        $pharmacy->is_active = !$pharmacy->is_active;
        $pharmacy->save();

        // Log activity
        activity()
            ->causedBy($request->user())
            ->performedOn($pharmacy)
            ->withProperties([
                'old_status' => $oldStatus,
                'new_status' => $pharmacy->is_active
            ])
            ->log('Toggled pharmacy status');

        return response()->json($pharmacy);
    }

    /**
     * Get pending pharmacies (awaiting approval).
     */
    public function pending(Request $request): JsonResponse
    {
        $pharmacies = Pharmacy::with(['neighborhood', 'user'])
            ->where('is_approved', false)
            ->whereNotNull('user_id')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($pharmacies);
    }

    /**
     * Approve a pharmacy.
     */
    public function approve(Request $request, int $id): JsonResponse
    {
        $pharmacy = Pharmacy::findOrFail($id);
        $pharmacy->is_approved = true;
        $pharmacy->save();

        // Log activity
        activity()
            ->causedBy($request->user())
            ->performedOn($pharmacy)
            ->log('Approved pharmacy');

        return response()->json([
            'success' => true,
            'message' => 'تمت الموافقة على الصيدلية بنجاح',
            'data' => $pharmacy
        ]);
    }

    /**
     * Reject a pharmacy.
     */
    public function reject(Request $request, int $id): JsonResponse
    {
        $pharmacy = Pharmacy::findOrFail($id);
        
        // Delete the pharmacy and its user
        $user = $pharmacy->user;
        $pharmacy->delete();
        
        if ($user) {
            $user->delete();
        }

        // Log activity
        activity()
            ->causedBy($request->user())
            ->log('Rejected and deleted pharmacy: ' . $pharmacy->name);

        return response()->json([
            'success' => true,
            'message' => 'تم رفض الصيدلية وحذفها'
        ]);
    }
}
