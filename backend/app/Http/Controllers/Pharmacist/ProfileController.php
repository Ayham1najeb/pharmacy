<?php

namespace App\Http\Controllers\Pharmacist;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    /**
     * Get pharmacist profile
     */
    public function show(Request $request)
    {
        $user = $request->user();
        $pharmacy = $user->pharmacy;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'photo' => $user->photo,
                'created_at' => $user->created_at,
            ],
            'pharmacy' => $pharmacy ? [
                'id' => $pharmacy->id,
                'name' => $pharmacy->name,
                'owner_name' => $pharmacy->owner_name,
                'phone' => $pharmacy->phone,
                'phone_secondary' => $pharmacy->phone_secondary,
                'address' => $pharmacy->address,
                'neighborhood' => $pharmacy->neighborhood,
                'latitude' => $pharmacy->latitude,
                'longitude' => $pharmacy->longitude,
                'is_active' => $pharmacy->is_active,
            ] : null,
        ]);
    }

    /**
     * Update pharmacist profile
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'phone' => 'nullable|string|max:20',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'تم تحديث الملف الشخصي بنجاح',
            'user' => $user,
        ]);
    }

    /**
     * Upload profile photo
     */
    public function uploadPhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $user = $request->user();

        // Delete old photo
        if ($user->photo) {
            Storage::disk('public')->delete($user->photo);
        }

        // Store new photo
        $path = $request->file('photo')->store('photos', 'public');
        $user->photo = $path;
        $user->save();

        return response()->json([
            'message' => 'تم رفع الصورة بنجاح',
            'photo' => $path,
        ]);
    }

    /**
     * Change password
     */
    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:6|confirmed',
        ]);

        $user = $request->user();

        // Check current password
        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'message' => 'كلمة المرور الحالية غير صحيحة',
            ], 422);
        }

        // Update password
        $user->password = Hash::make($validated['new_password']);
        $user->save();

        return response()->json([
            'message' => 'تم تغيير كلمة المرور بنجاح',
        ]);
    }
}
