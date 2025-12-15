<?php

namespace App\Http\Controllers\Pharmacist;

use App\Http\Controllers\Controller;
use App\Models\Pharmacy;
use App\Models\DutySchedule;
use App\Services\ContentModerationService;
use App\Rules\SyrianPhoneRule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PharmacyController extends Controller
{
    protected ContentModerationService $moderationService;

    public function __construct(ContentModerationService $moderationService)
    {
        $this->moderationService = $moderationService;
    }

    /**
     * Get pharmacist's pharmacy
     */
    public function show(Request $request)
    {
        $pharmacy = Pharmacy::where('user_id', $request->user()->id)
            ->with('neighborhood')
            ->first();

        if (!$pharmacy) {
            return response()->json([
                'success' => false,
                'message' => 'لم يتم العثور على صيدلية مرتبطة بحسابك'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $pharmacy
        ]);
    }

    /**
     * Update pharmacist's pharmacy
     */
    public function update(Request $request)
    {
        $pharmacy = Pharmacy::where('user_id', $request->user()->id)->first();

        if (!$pharmacy) {
            return response()->json([
                'success' => false,
                'message' => 'لم يتم العثور على صيدلية مرتبطة بحسابك'
            ], 404);
        }

        $rules = [
            'name' => 'sometimes|string|min:3|max:255',
            'owner_name' => 'sometimes|string|min:3|max:255',
            'phone' => ['sometimes', 'string', 'max:20', new SyrianPhoneRule()],
            'address' => 'sometimes|string|min:10|max:500',
            'neighborhood_id' => 'sometimes|exists:neighborhoods,id',
        ];

        $messages = [
            'name.min' => 'اسم الصيدلية يجب أن يكون 3 أحرف على الأقل',
            'owner_name.min' => 'اسم المالك يجب أن يكون 3 أحرف على الأقل',
            'address.min' => 'العنوان يجب أن يكون 10 أحرف على الأقل',
            'neighborhood_id.exists' => 'الحي غير موجود',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // فحص المحتوى للكلمات السيئة
        $fieldsToCheck = [];
        if ($request->has('name')) $fieldsToCheck['pharmacy_name'] = $request->name;
        if ($request->has('owner_name')) $fieldsToCheck['owner_name'] = $request->owner_name;
        if ($request->has('address')) $fieldsToCheck['address'] = $request->address;

        if (!empty($fieldsToCheck)) {
            $moderationResult = $this->moderationService->validateRegistrationData($fieldsToCheck);
            
            if ($moderationResult['needs_review']) {
                return response()->json([
                    'success' => false,
                    'message' => 'البيانات تحتوي على كلمات غير مناسبة',
                    'errors' => ['content' => $moderationResult['issues']]
                ], 422);
            }
        }

        // تحضير البيانات المنظفة
        $updateData = [];
        
        if ($request->has('name')) {
            $updateData['name'] = $this->moderationService->sanitize($request->name);
        }
        if ($request->has('owner_name')) {
            $updateData['owner_name'] = $this->moderationService->sanitize($request->owner_name);
        }
        if ($request->has('phone')) {
            $updateData['phone'] = SyrianPhoneRule::formatPhone($request->phone);
        }
        if ($request->has('address')) {
            $updateData['address'] = $this->moderationService->sanitize($request->address);
        }
        if ($request->has('neighborhood_id')) {
            $updateData['neighborhood_id'] = $request->neighborhood_id;
        }

        $pharmacy->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث بيانات الصيدلية بنجاح',
            'data' => $pharmacy->load('neighborhood')
        ]);
    }

    /**
     * Get pharmacist's schedules
     */
    public function schedules(Request $request)
    {
        $pharmacy = Pharmacy::where('user_id', $request->user()->id)->first();

        if (!$pharmacy) {
            return response()->json([
                'success' => false,
                'message' => 'لم يتم العثور على صيدلية مرتبطة بحسابك'
            ], 404);
        }

        $schedules = DutySchedule::where('pharmacy_id', $pharmacy->id)
            ->with('pharmacy.neighborhood')
            ->orderBy('duty_date', 'desc')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $schedules
        ]);
    }
}

