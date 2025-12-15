<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ReviewController extends Controller
{
    /**
     * Display a listing of reviews.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Review::with(['pharmacy']);

        // Filter by approval status
        if ($request->has('is_approved')) {
            $query->where('is_approved', $request->is_approved);
        }

        // Filter by pharmacy
        if ($request->has('pharmacy_id')) {
            $query->where('pharmacy_id', $request->pharmacy_id);
        }

        $reviews = $query->latest()->paginate(20);

        return response()->json($reviews);
    }

    /**
     * Approve a review.
     */
    public function approve(Request $request, int $id): JsonResponse
    {
        $review = Review::findOrFail($id);
        $review->is_approved = true;
        $review->save();

        // Log activity
        activity()
            ->causedBy($request->user())
            ->performedOn($review)
            ->log('Approved review');

        return response()->json($review);
    }

    /**
     * Reject/delete a review.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $review = Review::findOrFail($id);
        $review->delete();

        // Log activity
        activity()
            ->causedBy($request->user())
            ->performedOn($review)
            ->log('Deleted review');

        return response()->json(['message' => 'Review deleted successfully']);
    }
}
