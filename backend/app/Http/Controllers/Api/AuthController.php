<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Pharmacy;
use App\Services\ContentModerationService;
use App\Rules\SyrianPhoneRule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    protected ContentModerationService $moderationService;

    public function __construct(ContentModerationService $moderationService)
    {
        $this->moderationService = $moderationService;
    }

    /**
     * Register a new pharmacist
     */
    public function register(Request $request)
    {
        // التحقق الأساسي من البيانات
        $validator = Validator::make($request->all(), [
            // User data
            'name' => 'required|string|min:3|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            
            // Pharmacy data
            'pharmacy_name' => 'required|string|min:3|max:255',
            'owner_name' => 'required|string|min:3|max:255',
            'phone' => ['required', 'string', 'max:20', new SyrianPhoneRule()],
            'address' => 'required|string|min:10|max:500',
            'neighborhood_id' => 'required|exists:neighborhoods,id',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
        ], [
            'name.required' => 'الاسم مطلوب',
            'name.min' => 'الاسم يجب أن يكون 3 أحرف على الأقل',
            'email.required' => 'البريد الإلكتروني مطلوب',
            'email.email' => 'البريد الإلكتروني غير صالح',
            'email.unique' => 'البريد الإلكتروني مستخدم مسبقاً',
            'password.required' => 'كلمة المرور مطلوبة',
            'password.min' => 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
            'password.confirmed' => 'كلمات المرور غير متطابقة',
            'pharmacy_name.required' => 'اسم الصيدلية مطلوب',
            'pharmacy_name.min' => 'اسم الصيدلية يجب أن يكون 3 أحرف على الأقل',
            'owner_name.required' => 'اسم المالك مطلوب',
            'owner_name.min' => 'اسم المالك يجب أن يكون 3 أحرف على الأقل',
            'phone.required' => 'رقم الهاتف مطلوب',
            'address.required' => 'العنوان مطلوب',
            'address.min' => 'العنوان يجب أن يكون 10 أحرف على الأقل',
            'neighborhood_id.required' => 'الحي مطلوب',
            'neighborhood_id.exists' => 'الحي غير موجود',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // التحقق من عدم وجود صيدلية سابقة لهذا الإيميل
        $existingUser = User::where('email', $request->email)->first();
        if ($existingUser && $existingUser->pharmacy) {
            return response()->json([
                'success' => false,
                'message' => 'لديك صيدلية مسجلة بالفعل. لا يمكن تسجيل أكثر من صيدلية.'
            ], 422);
        }

        // فحص المحتوى للكلمات السيئة والبيانات المشبوهة
        $moderationResult = $this->moderationService->validateRegistrationData([
            'name' => $request->name,
            'pharmacy_name' => $request->pharmacy_name,
            'owner_name' => $request->owner_name,
            'address' => $request->address,
        ]);

        // إذا كان هناك كلمات سيئة، ارفض التسجيل مباشرة
        if ($moderationResult['needs_review'] && !empty($moderationResult['issues'])) {
            foreach ($moderationResult['issues'] as $issue) {
                if (strpos($issue, 'كلمات غير مناسبة') !== false) {
                    return response()->json([
                        'success' => false,
                        'message' => 'البيانات تحتوي على كلمات غير مناسبة. يرجى تعديلها.',
                        'errors' => ['content' => $moderationResult['issues']]
                    ], 422);
                }
            }
        }

        try {
            // تنظيف البيانات
            $cleanName = $this->moderationService->sanitize($request->name);
            $cleanPharmacyName = $this->moderationService->sanitize($request->pharmacy_name);
            $cleanOwnerName = $this->moderationService->sanitize($request->owner_name);
            $cleanAddress = $this->moderationService->sanitize($request->address);
            $cleanPhone = SyrianPhoneRule::formatPhone($request->phone);

            // Create user
            $user = User::create([
                'name' => $cleanName,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'pharmacist',
            ]);

            // تحديد حالة الموافقة بناءً على نتيجة الفحص
            // البيانات النظيفة = موافقة تلقائية
            // البيانات المشبوهة = تحتاج مراجعة
            $isApproved = $moderationResult['is_clean'];

            // Create pharmacy
            $pharmacy = Pharmacy::create([
                'user_id' => $user->id,
                'name' => $cleanPharmacyName,
                'owner_name' => $cleanOwnerName,
                'phone' => $cleanPhone,
                'address' => $cleanAddress,
                'neighborhood_id' => $request->neighborhood_id,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'is_active' => true,
                'is_approved' => $isApproved,
            ]);

            $message = $isApproved 
                ? 'تم التسجيل بنجاح! يمكنك تسجيل الدخول الآن.'
                : 'تم التسجيل بنجاح. في انتظار موافقة الإدارة.';

            return response()->json([
                'success' => true,
                'message' => $message,
                'data' => [
                    'user' => $user,
                    'pharmacy' => $pharmacy,
                    'auto_approved' => $isApproved,
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء التسجيل',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Login (for both admin and pharmacist)
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['البيانات المدخلة غير صحيحة'],
            ]);
        }

        // Create token
        $token = $user->createToken('auth-token')->plainTextToken;

        // Get pharmacy if pharmacist
        $pharmacy = null;
        if ($user->role === 'pharmacist') {
            $pharmacy = Pharmacy::where('user_id', $user->id)->with('neighborhood')->first();
        }

        return response()->json([
            'success' => true,
            'message' => 'تم تسجيل الدخول بنجاح',
            'data' => [
                'user' => $user,
                'pharmacy' => $pharmacy,
                'token' => $token,
            ]
        ]);
    }

    /**
     * Logout
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم تسجيل الخروج بنجاح'
        ]);
    }

    /**
     * Get current user info
     */
    public function me(Request $request)
    {
        $user = $request->user();
        
        $pharmacy = null;
        if ($user->role === 'pharmacist') {
            $pharmacy = Pharmacy::where('user_id', $user->id)->with('neighborhood')->first();
        }

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
                'pharmacy' => $pharmacy,
            ]
        ]);
    }
}
