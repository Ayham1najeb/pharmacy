<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DutySchedule;
use App\Models\Pharmacy;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ScheduleController extends Controller
{
    /**
     * Display a listing of schedules.
     */
    public function index(Request $request): JsonResponse
    {
        $query = DutySchedule::with(['pharmacy.neighborhood']);

        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->dateRange($request->start_date, $request->end_date);
        }

        // Filter by pharmacy
        if ($request->has('pharmacy_id')) {
            $query->where('pharmacy_id', $request->pharmacy_id);
        }

        // Filter by emergency
        if ($request->has('is_emergency')) {
            $query->where('is_emergency', $request->is_emergency);
        }

        $schedules = $query->orderBy('duty_date')->get();

        return response()->json($schedules);
    }

    /**
     * Store a newly created schedule.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'pharmacy_id' => 'required|exists:pharmacies,id',
            'duty_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i',
            'is_emergency' => 'boolean',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check for duplicate
        $exists = DutySchedule::where('pharmacy_id', $request->pharmacy_id)
            ->where('duty_date', $request->duty_date)
            ->exists();

        if ($exists) {
            return response()->json([
                'error' => 'A schedule already exists for this pharmacy on this date.'
            ], 422);
        }

        $schedule = DutySchedule::create($request->all());

        // Log activity
        activity()
            ->causedBy($request->user())
            ->performedOn($schedule)
            ->withProperties(['attributes' => $schedule->toArray()])
            ->log('Created duty schedule');

        return response()->json($schedule, 201);
    }

    /**
     * Store multiple schedules at once.
     */
    public function bulkStore(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'schedules' => 'required|array',
            'schedules.*.pharmacy_id' => 'required|exists:pharmacies,id',
            'schedules.*.duty_date' => 'required|date',
            'schedules.*.start_time' => 'nullable|date_format:H:i',
            'schedules.*.end_time' => 'nullable|date_format:H:i',
            'schedules.*.is_emergency' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $created = [];
        $errors = [];

        DB::beginTransaction();
        try {
            foreach ($request->schedules as $scheduleData) {
                // Set defaults
                $scheduleData['start_time'] = $scheduleData['start_time'] ?? '08:00';
                $scheduleData['end_time'] = $scheduleData['end_time'] ?? '08:00';
                $scheduleData['is_emergency'] = $scheduleData['is_emergency'] ?? false;

                // Check for duplicate
                $exists = DutySchedule::where('pharmacy_id', $scheduleData['pharmacy_id'])
                    ->where('duty_date', $scheduleData['duty_date'])
                    ->exists();

                if (!$exists) {
                    $schedule = DutySchedule::create($scheduleData);
                    $created[] = $schedule;
                } else {
                    $errors[] = "Duplicate schedule for pharmacy {$scheduleData['pharmacy_id']} on {$scheduleData['duty_date']}";
                }
            }

            DB::commit();

            // Log activity
            activity()
                ->causedBy($request->user())
                ->withProperties(['count' => count($created)])
                ->log('Bulk created duty schedules');

            return response()->json([
                'created' => $created,
                'errors' => $errors,
                'success_count' => count($created),
                'error_count' => count($errors),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create schedules'], 500);
        }
    }

    /**
     * Update the specified schedule.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $schedule = DutySchedule::findOrFail($id);
        $oldValues = $schedule->toArray();

        $validator = Validator::make($request->all(), [
            'pharmacy_id' => 'exists:pharmacies,id',
            'duty_date' => 'date',
            'start_time' => 'date_format:H:i',
            'end_time' => 'date_format:H:i',
            'is_emergency' => 'boolean',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $schedule->update($request->all());

        // Log activity
        activity()
            ->causedBy($request->user())
            ->performedOn($schedule)
            ->withProperties([
                'old' => $oldValues,
                'attributes' => $schedule->fresh()->toArray()
            ])
            ->log('Updated duty schedule');

        return response()->json($schedule);
    }

    /**
     * Remove the specified schedule.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $schedule = DutySchedule::findOrFail($id);
        $schedule->delete();

        // Log activity
        activity()
            ->causedBy($request->user())
            ->performedOn($schedule)
            ->log('Deleted duty schedule');

        return response()->json(['message' => 'Schedule deleted successfully']);
    }

    /**
     * Generate automatic schedule rotation.
     */
    public function generate(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'rotation_type' => 'required|in:sequential,random',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $pharmacies = Pharmacy::active()->get();
        
        if ($pharmacies->isEmpty()) {
            return response()->json(['error' => 'No active pharmacies found'], 422);
        }

        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);
        $schedules = [];
        $pharmacyIndex = 0;

        if ($request->rotation_type === 'random') {
            $pharmacies = $pharmacies->shuffle();
        }

        DB::beginTransaction();
        try {
            for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
                $pharmacy = $pharmacies[$pharmacyIndex % $pharmacies->count()];
                
                // Check if schedule already exists
                $exists = DutySchedule::where('pharmacy_id', $pharmacy->id)
                    ->where('duty_date', $date->toDateString())
                    ->exists();

                if (!$exists) {
                    $schedule = DutySchedule::create([
                        'pharmacy_id' => $pharmacy->id,
                        'duty_date' => $date->toDateString(),
                        'start_time' => '08:00',
                        'end_time' => '08:00',
                        'is_emergency' => false,
                    ]);
                    $schedules[] = $schedule;
                }

                $pharmacyIndex++;
            }

            DB::commit();

            // Log activity
            activity()
                ->causedBy($request->user())
                ->withProperties([
                    'start_date' => $request->start_date,
                    'end_date' => $request->end_date,
                    'rotation_type' => $request->rotation_type,
                    'count' => count($schedules)
                ])
                ->log('Generated duty schedules');

            return response()->json([
                'schedules' => $schedules,
                'count' => count($schedules),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to generate schedules'], 500);
        }
    }
}
