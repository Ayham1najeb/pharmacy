<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PharmacyController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\NeighborhoodController;
use App\Http\Controllers\Api\StatisticsController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\PharmacyController as AdminPharmacyController;
use App\Http\Controllers\Admin\ScheduleController as AdminScheduleController;
use App\Http\Controllers\Admin\ReviewController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public API Routes (v1)
Route::prefix('v1')->group(function () {
    
    // Pharmacies
    Route::get('/pharmacies/on-duty-today', [PharmacyController::class, 'onDutyToday']);
    Route::get('/pharmacies/on-duty-now', [PharmacyController::class, 'onDutyNow']);
    Route::get('/pharmacies/search', [PharmacyController::class, 'search']);
    Route::get('/pharmacies', [PharmacyController::class, 'index']);
    Route::get('/pharmacies/{id}', [PharmacyController::class, 'show']);
    
    // Schedules
    Route::get('/schedule', [ScheduleController::class, 'index']);
    Route::get('/schedule/calendar/{month}/{year}', [ScheduleController::class, 'calendar']);
    Route::get('/schedule/week', [ScheduleController::class, 'week']);
    
    // Neighborhoods
    Route::get('/neighborhoods', [NeighborhoodController::class, 'index']);
    Route::get('/neighborhoods/{id}/pharmacies', [NeighborhoodController::class, 'pharmacies']);
    
    // Statistics
    Route::get('/statistics', [StatisticsController::class, 'index']);
    
    // Analytics - Visitor Tracking
    Route::post('/analytics/track', [App\Http\Controllers\Api\AnalyticsController::class, 'recordView']);
    Route::get('/analytics/stats', [App\Http\Controllers\Api\AnalyticsController::class, 'getStats']);
    
    // Authentication
    Route::post('/auth/register', [App\Http\Controllers\Api\AuthController::class, 'register']);
    Route::post('/auth/login', [App\Http\Controllers\Api\AuthController::class, 'login']);
    
    // Protected auth routes
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::post('/auth/logout', [App\Http\Controllers\Api\AuthController::class, 'logout']);
        Route::get('/auth/me', [App\Http\Controllers\Api\AuthController::class, 'me']);
    });
    
    // Health check for Render - also warms up cache
    Route::get('/health', function () {
        return response()->json(['status' => 'ok', 'timestamp' => now()]);
    });
    
    // Warmup endpoint - call this to pre-cache data (use with UptimeRobot)
    Route::get('/warmup', function () {
        // Pre-warm common caches
        $stats = \Illuminate\Support\Facades\Cache::remember('site_statistics', 300, function () {
            return [
                'pharmacies' => \App\Models\Pharmacy::active()->count(),
                'neighborhoods' => \App\Models\Neighborhood::count(),
            ];
        });
        
        \Illuminate\Support\Facades\Cache::remember('neighborhoods_list', 600, function () {
            return \App\Models\Neighborhood::withCount('pharmacies')->get();
        });
        
        \Illuminate\Support\Facades\Cache::remember('on_duty_today', 180, function () {
            return \App\Models\DutySchedule::with(['pharmacy.neighborhood'])
                ->whereDate('duty_date', '>=', now()->toDateString())
                ->limit(9)
                ->get();
        });
        
        return response()->json([
            'status' => 'warmed',
            'timestamp' => now(),
            'cached' => ['statistics', 'neighborhoods', 'schedules']
        ]);
    });
    
    // Database health check
    Route::get('/health/db', function () {
        $neighborhoods = \App\Models\Neighborhood::count();
        $pharmacies = \App\Models\Pharmacy::count();
        
        return response()->json([
            'status' => 'ok',
            'database' => 'connected',
            'neighborhoods_count' => $neighborhoods,
            'pharmacies_count' => $pharmacies,
            'needs_seeding' => $neighborhoods === 0
        ]);
    });
    
    // Manual seed neighborhoods - افتح هذا الرابط من المتصفح لإضافة الأحياء
    Route::get('/seed/neighborhoods', function () {
        $existingCount = \App\Models\Neighborhood::count();
        
        if ($existingCount > 0) {
            return response()->json([
                'status' => 'already_seeded',
                'message' => 'الأحياء موجودة بالفعل!',
                'count' => $existingCount,
                'neighborhoods' => \App\Models\Neighborhood::all()
            ]);
        }
        
        $neighborhoods = [
            ['name' => 'الحي الشرقي', 'area_code' => 'E01'],
            ['name' => 'الحي الغربي', 'area_code' => 'W01'],
            ['name' => 'الحي الشمالي', 'area_code' => 'N01'],
            ['name' => 'الحي الجنوبي', 'area_code' => 'S01'],
            ['name' => 'المركز', 'area_code' => 'C01'],
            ['name' => 'الصناعة', 'area_code' => 'I01'],
        ];

        $created = [];
        foreach ($neighborhoods as $neighborhood) {
            $created[] = \App\Models\Neighborhood::create($neighborhood);
        }
        
        return response()->json([
            'status' => 'success',
            'message' => 'تم إضافة الأحياء بنجاح! ✅',
            'count' => count($created),
            'neighborhoods' => $created
        ]);
    });
});

// Pharmacist API Routes (v1)
Route::prefix('v1/pharmacist')->middleware(['auth:sanctum', 'role:pharmacist'])->group(function () {
    // Pharmacy info
    Route::get('/pharmacy', [App\Http\Controllers\Pharmacist\PharmacyController::class, 'show']);
    Route::put('/pharmacy', [App\Http\Controllers\Pharmacist\PharmacyController::class, 'update']);
    Route::get('/schedules', [App\Http\Controllers\Pharmacist\PharmacyController::class, 'schedules']);
    
    // Profile Management
    Route::get('/profile', [App\Http\Controllers\Pharmacist\ProfileController::class, 'show']);
    Route::put('/profile', [App\Http\Controllers\Pharmacist\ProfileController::class, 'update']);
    Route::post('/profile/photo', [App\Http\Controllers\Pharmacist\ProfileController::class, 'uploadPhoto']);
    Route::put('/password', [App\Http\Controllers\Pharmacist\ProfileController::class, 'changePassword']);
    
    // Schedule Management
    Route::get('/my-schedules', [App\Http\Controllers\Pharmacist\ScheduleController::class, 'index']);
    Route::post('/my-schedules', [App\Http\Controllers\Pharmacist\ScheduleController::class, 'store']);
    Route::put('/my-schedules/{id}', [App\Http\Controllers\Pharmacist\ScheduleController::class, 'update']);
    Route::delete('/my-schedules/{id}', [App\Http\Controllers\Pharmacist\ScheduleController::class, 'destroy']);
    
    // Duty management routes (legacy)
    Route::get('/duties', [App\Http\Controllers\Pharmacist\DutyController::class, 'index']);
    Route::post('/duties', [App\Http\Controllers\Pharmacist\DutyController::class, 'store']);
    Route::put('/duties/{id}', [App\Http\Controllers\Pharmacist\DutyController::class, 'update']);
    Route::delete('/duties/{id}', [App\Http\Controllers\Pharmacist\DutyController::class, 'destroy']);
});

// Admin API Routes (v1)
Route::prefix('v1/admin')->group(function () {
    
    // Authentication (no auth required)
    Route::post('/auth/login', [AuthController::class, 'login']);
    
    // Protected routes (require authentication + admin role)
    Route::middleware(['auth:sanctum', 'role:admin', 'throttle:60,1'])->group(function () {
        
        // Auth
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);
        
        // Pharmacies Management
        Route::get('/pharmacies', [AdminPharmacyController::class, 'index']);
        Route::get('/pharmacies/pending', [AdminPharmacyController::class, 'pending']);
        Route::post('/pharmacies', [AdminPharmacyController::class, 'store']);
        Route::get('/pharmacies/{id}', [AdminPharmacyController::class, 'show']);
        Route::put('/pharmacies/{id}', [AdminPharmacyController::class, 'update']);
        Route::delete('/pharmacies/{id}', [AdminPharmacyController::class, 'destroy']);
        Route::patch('/pharmacies/{id}/toggle-active', [AdminPharmacyController::class, 'toggleActive']);
        Route::patch('/pharmacies/{id}/approve', [AdminPharmacyController::class, 'approve']);
        Route::patch('/pharmacies/{id}/reject', [AdminPharmacyController::class, 'reject']);
        
        // Schedule Management
        Route::get('/schedule', [AdminScheduleController::class, 'index']);
        Route::post('/schedule', [AdminScheduleController::class, 'store']);
        Route::post('/schedule/bulk', [AdminScheduleController::class, 'bulkStore']);
        Route::post('/schedule/generate', [AdminScheduleController::class, 'generate']);
        Route::put('/schedule/{id}', [AdminScheduleController::class, 'update']);
        Route::delete('/schedule/{id}', [AdminScheduleController::class, 'destroy']);
        
        // Reviews Management
        Route::get('/reviews', [ReviewController::class, 'index']);
        Route::patch('/reviews/{id}/approve', [ReviewController::class, 'approve']);
        Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);
        
        // User Management
        Route::get('/users', [App\Http\Controllers\Admin\UserController::class, 'index']);
        Route::delete('/users/{id}', [App\Http\Controllers\Admin\UserController::class, 'destroy']);

        // Profile Management
        Route::put('/profile/password', [App\Http\Controllers\Admin\ProfileController::class, 'updatePassword']);
    });
});
