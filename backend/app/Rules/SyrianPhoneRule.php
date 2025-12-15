<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class SyrianPhoneRule implements ValidationRule
{
    /**
     * أنماط أرقام الهاتف السورية الصالحة
     * Valid Syrian phone number patterns
     * 
     * الأرقام المقبولة:
     * - 09xxxxxxxx (المحلي)
     * - +96309xxxxxxxx (الدولي مع +)
     * - 0096309xxxxxxxx (الدولي مع 00)
     * - 96309xxxxxxxx (الدولي بدون +)
     */
    protected array $patterns = [
        // الموبايل السوري (يبدأ بـ 09)
        '/^09[3-9]\d{7}$/',           // 09xxxxxxxx
        '/^\+9639[3-9]\d{7}$/',       // +96309xxxxxxxx
        '/^009639[3-9]\d{7}$/',       // 009639xxxxxxxx
        '/^9639[3-9]\d{7}$/',         // 96309xxxxxxxx
    ];

    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $phone = $this->normalizePhone($value);
        
        if (!$this->isValidSyrianPhone($phone)) {
            $fail('رقم الهاتف يجب أن يكون رقم سوري صالح (مثال: 0933123456)');
        }
    }

    /**
     * تنظيف رقم الهاتف
     * Normalize phone number
     */
    protected function normalizePhone(string $phone): string
    {
        // إزالة المسافات والشرطات والأقواس
        return preg_replace('/[\s\-\(\)\.]+/', '', $phone);
    }

    /**
     * التحقق من صحة الرقم السوري
     * Validate Syrian phone number
     */
    protected function isValidSyrianPhone(string $phone): bool
    {
        foreach ($this->patterns as $pattern) {
            if (preg_match($pattern, $phone)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * تحويل الرقم للصيغة الموحدة
     * Convert to unified format (for storage)
     */
    public static function formatPhone(string $phone): string
    {
        // تنظيف الرقم
        $phone = preg_replace('/[\s\-\(\)\.]+/', '', $phone);
        
        // تحويل للصيغة المحلية (09xxxxxxxx)
        if (preg_match('/^\+963/', $phone)) {
            $phone = '0' . substr($phone, 4);
        } elseif (preg_match('/^00963/', $phone)) {
            $phone = '0' . substr($phone, 5);
        } elseif (preg_match('/^963/', $phone)) {
            $phone = '0' . substr($phone, 3);
        }
        
        return $phone;
    }
}
