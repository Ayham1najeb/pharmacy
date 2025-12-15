<?php

namespace App\Services;

class ContentModerationService
{
    /**
     * قائمة الكلمات السيئة (عربي + إنجليزي)
     * Bad words list (Arabic + English)
     */
    protected array $badWords = [
        // كلمات عربية سيئة
        'حمار', 'غبي', 'احمق', 'كلب', 'حقير', 'نذل', 'وسخ', 'قذر',
        'شرموط', 'عاهر', 'زاني', 'لعين', 'ملعون', 'منيك', 'كس', 'طيز',
        'زب', 'شرموطة', 'عاهرة', 'قحبة', 'متناك', 'ابن الكلب', 'ابن الحرام',
        'خنزير', 'حيوان', 'داعش', 'ارهابي', 'كافر', 'مرتد',
        // English bad words
        'fuck', 'shit', 'bitch', 'ass', 'damn', 'bastard', 'dick', 'pussy',
        'whore', 'slut', 'cunt', 'cock', 'nigger', 'faggot', 'retard',
        'stupid', 'idiot', 'dumb', 'moron',
    ];

    /**
     * أنماط البيانات المشبوهة
     * Suspicious data patterns
     */
    protected array $suspiciousPatterns = [
        '/^[a-z]{1,3}$/i',           // كلمات قصيرة جداً
        '/^[0-9]+$/',                 // أرقام فقط
        '/(.)\1{3,}/',                // تكرار نفس الحرف 4+ مرات (aaaa, ?????)
        '/^test/i',                   // كلمات اختبار
        '/^asdf/i',                   // إدخال عشوائي
        '/^qwer/i',                   // إدخال عشوائي
        '/^\s*$/',                    // مسافات فقط
        '/^[!@#$%^&*()]+$/',         // رموز فقط
    ];

    /**
     * فحص النص للكلمات السيئة
     * Check text for bad words
     */
    public function containsBadWords(string $text): bool
    {
        $textLower = mb_strtolower($text);
        
        foreach ($this->badWords as $word) {
            if (mb_strpos($textLower, mb_strtolower($word)) !== false) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * فحص النص للبيانات المشبوهة
     * Check text for suspicious patterns
     */
    public function isSuspicious(string $text): bool
    {
        $text = trim($text);
        
        // فارغ أو قصير جداً
        if (empty($text) || mb_strlen($text) < 2) {
            return true;
        }
        
        // فحص الأنماط المشبوهة
        foreach ($this->suspiciousPatterns as $pattern) {
            if (preg_match($pattern, $text)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * التحقق من صحة الاسم العربي/الإنجليزي
     * Validate Arabic/English name
     */
    public function isValidName(string $name): bool
    {
        $name = trim($name);
        
        // الطول المطلوب
        if (mb_strlen($name) < 3 || mb_strlen($name) > 100) {
            return false;
        }
        
        // يجب أن يحتوي على أحرف عربية أو إنجليزية
        // Arabic: \p{Arabic}, English: a-zA-Z
        if (!preg_match('/[\p{Arabic}a-zA-Z]/u', $name)) {
            return false;
        }
        
        return !$this->containsBadWords($name) && !$this->isSuspicious($name);
    }

    /**
     * التحقق من صحة العنوان
     * Validate address
     */
    public function isValidAddress(string $address): bool
    {
        $address = trim($address);
        
        // الطول المطلوب
        if (mb_strlen($address) < 10 || mb_strlen($address) > 500) {
            return false;
        }
        
        return !$this->containsBadWords($address) && !$this->isSuspicious($address);
    }

    /**
     * فحص شامل للبيانات
     * Comprehensive data check
     * 
     * @return array ['is_clean' => bool, 'issues' => array, 'needs_review' => bool]
     */
    public function validateRegistrationData(array $data): array
    {
        $issues = [];
        $needsReview = false;
        
        // فحص الاسم
        if (isset($data['name'])) {
            if ($this->containsBadWords($data['name'])) {
                $issues[] = 'الاسم يحتوي على كلمات غير مناسبة';
                $needsReview = true;
            } elseif (!$this->isValidName($data['name'])) {
                $issues[] = 'الاسم غير صالح';
            }
        }
        
        // فحص اسم الصيدلية
        if (isset($data['pharmacy_name'])) {
            if ($this->containsBadWords($data['pharmacy_name'])) {
                $issues[] = 'اسم الصيدلية يحتوي على كلمات غير مناسبة';
                $needsReview = true;
            } elseif (!$this->isValidName($data['pharmacy_name'])) {
                $issues[] = 'اسم الصيدلية غير صالح';
            }
        }
        
        // فحص اسم المالك
        if (isset($data['owner_name'])) {
            if ($this->containsBadWords($data['owner_name'])) {
                $issues[] = 'اسم المالك يحتوي على كلمات غير مناسبة';
                $needsReview = true;
            } elseif (!$this->isValidName($data['owner_name'])) {
                $issues[] = 'اسم المالك غير صالح';
            }
        }
        
        // فحص العنوان
        if (isset($data['address'])) {
            if ($this->containsBadWords($data['address'])) {
                $issues[] = 'العنوان يحتوي على كلمات غير مناسبة';
                $needsReview = true;
            } elseif (!$this->isValidAddress($data['address'])) {
                $issues[] = 'العنوان غير صالح (يجب أن يكون 10 أحرف على الأقل)';
            }
        }
        
        return [
            'is_clean' => empty($issues),
            'issues' => $issues,
            'needs_review' => $needsReview,
        ];
    }

    /**
     * تنظيف النص من المسافات الزائدة
     * Clean text from extra spaces
     */
    public function sanitize(string $text): string
    {
        // إزالة HTML tags
        $text = strip_tags($text);
        
        // إزالة المسافات الزائدة
        $text = preg_replace('/\s+/', ' ', $text);
        
        // إزالة المسافات في البداية والنهاية
        return trim($text);
    }
}
