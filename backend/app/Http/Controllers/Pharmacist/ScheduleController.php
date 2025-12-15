<?php

namespace App\Http\Controllers\Pharmacist;

use App\Http\Controllers\Controller;
use App\Models\DutySchedule;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ScheduleController extends Controller
{
    /**
     * Get pharmacist's schedules
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $pharmacy = $user->pharmacy;

        if (!$pharmacy) {
            return response()->json([
                'message' => 'لا يوج صيدلية مرتبطة بحسابك',
            ], 404);
        }

        $schedules = DutySchedule::where('pharmacy_id', $pharmacy->id)
            ->orderBy('duty_date', 'desc')
            ->paginate(20);

        return response()->json($schedules);
    }

    /**
     * Create new schedule
     */
    public function store(Request $request)
    {
        $user = $request->user();
        $pharmacy = $user->pharmacy;

        if (!$pharmacy) {
            return response()->json([
                'message' => 'لا توجد صيدلية مرتبطة بحسابك',
            ], 404);
        }

        $validated = $request->validate([
            'duty_date' => 'required|date',
            'shift_type' => 'required|in:day,night,full',
            'notes' => 'nullable|string|max:500',
        ]);

        // Check for conflicts
        $exists = DutySchedule::where('pharmacy_id', $pharmacy->id)
            ->where('duty_date', $validated['duty_date'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'يوجد مناوبة بالفعل في هذا التاريخ',
            ], 422);
        }

        // Map shift type to times
        $times = $this->getShiftTimes($validated['shift_type']);

        $schedule = DutySchedule::create([
            'pharmacy_id' => $pharmacy->id,
            'duty_date' => $validated['duty_date'],
            'start_time' => $times['start'],
            'end_time' => $times['end'],
            'notes' => $validated['notes'] ?? null,
            'is_emergency' => false,
        ]);

        // Add virtual attribute for response
        $schedule->shift_type = $validated['shift_type'];

        return response()->json([
            'message' => 'تم إضافة المناوبة بنجاح',
            'schedule' => $schedule,
        ], 201);
    }

    /**
     * Update schedule
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();
        $pharmacy = $user->pharmacy;

        $schedule = DutySchedule::findOrFail($id);

        // Check ownership
        if ($schedule->pharmacy_id !== $pharmacy->id) {
            return response()->json([
                'message' => 'غير مصرح لك بتعديل هذه المناوبة',
            ], 403);
        }

        $validated = $request->validate([
            'duty_date' => 'required|date',
            'shift_type' => 'required|in:day,night,full',
            'notes' => 'nullable|string|max:500',
        ]);

        // Check for conflicts (exclude current schedule)
        $exists = DutySchedule::where('pharmacy_id', $pharmacy->id)
            ->where('duty_date', $validated['duty_date'])
            ->where('id', '!=', $id)
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'يوجد مناوبة بالفعل في هذا التاريخ',
            ], 422);
        }

        // Map shift type to times
        $times = $this->getShiftTimes($validated['shift_type']);

        $schedule->update([
            'duty_date' => $validated['duty_date'],
            'start_time' => $times['start'],
            'end_time' => $times['end'],
            'notes' => $validated['notes'] ?? null,
        ]);

        $schedule->shift_type = $validated['shift_type'];

        return response()->json([
            'message' => 'تم تحديث المناوبة بنجاح',
            'schedule' => $schedule,
        ]);
    }

    private function getShiftTimes($type)
    {
        switch ($type) {
            case 'day':
                return ['start' => '08:00:00', 'end' => '20:00:00'];
            case 'night':
                return ['start' => '20:00:00', 'end' => '08:00:00'];
            case 'full':
            default:
                return ['start' => '00:00:00', 'end' => '23:59:59'];
        }
    }

    /**
     * Delete schedule
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $pharmacy = $user->pharmacy;

        $schedule = DutySchedule::findOrFail($id);

        // Check ownership
        if ($schedule->pharmacy_id !== $pharmacy->id) {
            return response()->json([
                'message' => 'غير مصرح لك بحذف هذه المناوبة',
            ], 403);
        }

        $schedule->delete();

        return response()->json([
            'message' => 'تم حذف المناوبة بنجاح',
        ]);
    }
}
