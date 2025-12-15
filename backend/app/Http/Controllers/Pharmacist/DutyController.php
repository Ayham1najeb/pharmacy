<?php

namespace App\Http\Controllers\Pharmacist;

use App\Http\Controllers\Controller;
use App\Models\DutySchedule;
use App\Models\Pharmacy;
use App\Services\ContentModerationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class DutyController extends Controller
{
    protected ContentModerationService $moderationService;

    public function __construct(ContentModerationService $moderationService)
    {
        $this->moderationService = $moderationService;
    }

    /**
     * عرض مناوبات الصيدلي
     * Get pharmacist's duty schedules
     */
    public function index(Request $request)
    {
        $pharmacy = $this->getPharmacy($request);
        
        if (!$pharmacy) {
            return response()->json([
                'success' => false,
                'message' => 'لم يتم العثور على صيدلية مرتبطة بحسابك'
            ], 404);
        }

        $schedules = DutySchedule::where('pharmacy_id', $pharmacy->id)
            ->orderBy('duty_date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $schedules
        ]);
    }

    /**
     * إضافة مناوبة جديدة
     * Store a new duty schedule
     */
    public function store(Request $request)
    {
        $pharmacy = $this->getPharmacy($request);
        
        if (!$pharmacy) {
            return response()->json([
                'success' => false,
                'message' => 'لم يتم العثور على صيدلية مرتبطة بحسابك'
            ], 404);
        }

        // التحقق من أن الصيدلية معتمدة
        if (!$pharmacy->is_approved) {
            return response()->json([
                'success' => false,
                'message' => 'صيدليتك في انتظار الموافقة. لا يمكنك إضافة مناوبات حالياً.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'duty_date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'notes' => 'nullable|string|max:500',
        ], [
            'duty_date.required' => 'تاريخ المناوبة مطلوب',
            'duty_date.date' => 'تاريخ المناوبة غير صالح',
            'duty_date.after_or_equal' => 'لا يمكن إضافة مناوبة لتاريخ سابق',
            'start_time.required' => 'وقت البداية مطلوب',
            'start_time.date_format' => 'صيغة وقت البداية غير صالحة (HH:MM)',
            'end_time.required' => 'وقت النهاية مطلوب',
            'end_time.date_format' => 'صيغة وقت النهاية غير صالحة (HH:MM)',
            'end_time.after' => 'وقت النهاية يجب أن يكون بعد وقت البداية',
            'notes.max' => 'الملاحظات يجب أن تكون أقل من 500 حرف',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // التحقق من عدم وجود مناوبة في نفس اليوم لنفس الصيدلية
        $existingSchedule = DutySchedule::where('pharmacy_id', $pharmacy->id)
            ->whereDate('duty_date', $request->duty_date)
            ->first();

        if ($existingSchedule) {
            return response()->json([
                'success' => false,
                'message' => 'لديك مناوبة مسجلة بالفعل في هذا اليوم. يمكنك تعديلها أو حذفها.'
            ], 422);
        }

        // فحص الملاحظات للكلمات السيئة
        if ($request->notes) {
            if ($this->moderationService->containsBadWords($request->notes)) {
                return response()->json([
                    'success' => false,
                    'message' => 'الملاحظات تحتوي على كلمات غير مناسبة'
                ], 422);
            }
        }

        try {
            $schedule = DutySchedule::create([
                'pharmacy_id' => $pharmacy->id,
                'duty_date' => $request->duty_date,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'notes' => $request->notes ? $this->moderationService->sanitize($request->notes) : null,
                'is_emergency' => false,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم إضافة المناوبة بنجاح',
                'data' => $schedule
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إضافة المناوبة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * تعديل مناوبة
     * Update a duty schedule
     */
    public function update(Request $request, $id)
    {
        $pharmacy = $this->getPharmacy($request);
        
        if (!$pharmacy) {
            return response()->json([
                'success' => false,
                'message' => 'لم يتم العثور على صيدلية مرتبطة بحسابك'
            ], 404);
        }

        $schedule = DutySchedule::where('id', $id)
            ->where('pharmacy_id', $pharmacy->id)
            ->first();

        if (!$schedule) {
            return response()->json([
                'success' => false,
                'message' => 'لم يتم العثور على المناوبة'
            ], 404);
        }

        // لا يمكن تعديل مناوبة سابقة
        if (Carbon::parse($schedule->duty_date)->isPast()) {
            return response()->json([
                'success' => false,
                'message' => 'لا يمكن تعديل مناوبة سابقة'
            ], 422);
        }

        $validator = Validator::make($request->all(), [
            'duty_date' => 'sometimes|date|after_or_equal:today',
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i',
            'notes' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // فحص الملاحظات للكلمات السيئة
        if ($request->has('notes') && $request->notes) {
            if ($this->moderationService->containsBadWords($request->notes)) {
                return response()->json([
                    'success' => false,
                    'message' => 'الملاحظات تحتوي على كلمات غير مناسبة'
                ], 422);
            }
        }

        try {
            $updateData = [];
            
            if ($request->has('duty_date')) {
                $updateData['duty_date'] = $request->duty_date;
            }
            if ($request->has('start_time')) {
                $updateData['start_time'] = $request->start_time;
            }
            if ($request->has('end_time')) {
                $updateData['end_time'] = $request->end_time;
            }
            if ($request->has('notes')) {
                $updateData['notes'] = $request->notes 
                    ? $this->moderationService->sanitize($request->notes) 
                    : null;
            }

            $schedule->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'تم تعديل المناوبة بنجاح',
                'data' => $schedule->fresh()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تعديل المناوبة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * حذف مناوبة
     * Delete a duty schedule
     */
    public function destroy(Request $request, $id)
    {
        $pharmacy = $this->getPharmacy($request);
        
        if (!$pharmacy) {
            return response()->json([
                'success' => false,
                'message' => 'لم يتم العثور على صيدلية مرتبطة بحسابك'
            ], 404);
        }

        $schedule = DutySchedule::where('id', $id)
            ->where('pharmacy_id', $pharmacy->id)
            ->first();

        if (!$schedule) {
            return response()->json([
                'success' => false,
                'message' => 'لم يتم العثور على المناوبة'
            ], 404);
        }

        // لا يمكن حذف مناوبة سابقة
        if (Carbon::parse($schedule->duty_date)->isPast()) {
            return response()->json([
                'success' => false,
                'message' => 'لا يمكن حذف مناوبة سابقة'
            ], 422);
        }

        try {
            $schedule->delete();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف المناوبة بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف المناوبة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * الحصول على صيدلية المستخدم الحالي
     * Get current user's pharmacy
     */
    protected function getPharmacy(Request $request): ?Pharmacy
    {
        return Pharmacy::where('user_id', $request->user()->id)->first();
    }
}
