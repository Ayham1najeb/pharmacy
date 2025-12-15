<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PageView;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    /**
     * Record a page view
     */
    public function recordView(Request $request)
    {
        PageView::create([
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'page_url' => $request->input('url', '/'),
            'viewed_at' => now(),
        ]);

        return response()->json(['success' => true]);
    }

    /**
     * Get visitor statistics
     */
    public function getStats()
    {
        $now = Carbon::now();
        
        // Daily visitors (last 24 hours)
        $dailyVisitors = PageView::where('viewed_at', '>=', $now->copy()->subHours(24))->count();
        
        // Monthly visitors (last 30 days)
        $monthlyVisitors = PageView::where('viewed_at', '>=', $now->copy()->subDays(30))->count();
        
        // Total visitors
        $totalVisitors = PageView::count();

        return response()->json([
            'daily' => $dailyVisitors,
            'monthly' => $monthlyVisitors,
            'total' => $totalVisitors,
        ]);
    }
}
