# ⚡ خطوات سريعة لتشغيل المشروع

## 1️⃣ إعداد قاعدة البيانات في XAMPP

### أ. تشغيل XAMPP
1. شغّل **XAMPP Control Panel**
2. اضغط **Start** على **Apache**
3. اضغط **Start** على **MySQL**

### ب. إنشاء قاعدة البيانات
1. افتح المتصفح واذهب إلى: http://localhost/phpmyadmin
2. اضغط على **New** (جديد) من القائمة اليسرى
3. اسم قاعدة البيانات: `maarrat_pharmacy`
4. Collation: `utf8mb4_unicode_ci`
5. اضغط **Create** (إنشاء)

✅ قاعدة البيانات جاهزة!

---

## 2️⃣ إعداد Backend (Laravel)

### أ. تعديل ملف .env

افتح الملف: `backend/.env`

وتأكد من هذه الإعدادات:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=maarrat_pharmacy
DB_USERNAME=root
DB_PASSWORD=
```

⚠️ **مهم:** إذا عندك password لـ MySQL في XAMPP، ضعه في `DB_PASSWORD`

### ب. تشغيل الأوامر

افتح **Terminal** في مجلد `backend`:

```bash
# 1. تثبيت Dependencies
composer install

# 2. توليد مفتاح التطبيق
php artisan key:generate

# 3. تشغيل Migrations (إنشاء الجداول)
php artisan migrate

# 4. تشغيل Seeders (إضافة بيانات تجريبية)
php artisan db:seed

# 5. تشغيل السيرفر
php artisan serve
```

✅ Backend جاهز على: http://localhost:8000

---

## 3️⃣ إعداد Frontend (React)

افتح **Terminal جديد** في مجلد `frontend`:

```bash
# 1. تثبيت Dependencies
npm install

# 2. تشغيل السيرفر
npm run dev
```

✅ Frontend جاهز على: http://localhost:3000

---

## 4️⃣ اختبار النظام

### افتح المتصفح:
- **الموقع:** http://localhost:3000
- **لوحة الإدارة:** http://localhost:3000/admin/login

### بيانات الدخول:
- **Email:** admin@maarrat-pharmacy.sy
- **Password:** password123

---

## 🔍 التحقق من الجداول

ارجع لـ phpMyAdmin: http://localhost/phpmyadmin

اختر قاعدة البيانات `maarrat_pharmacy`

يجب أن تشوف 6 جداول:
- ✅ neighborhoods
- ✅ pharmacies
- ✅ duty_schedules
- ✅ reviews
- ✅ notifications
- ✅ activity_logs

---

## 🐛 حل المشاكل

### المشكلة: "SQLSTATE[HY000] [1045] Access denied"
**الحل:** تأكد من username و password في `.env`

### المشكلة: "Base table or view not found"
**الحل:** شغل `php artisan migrate` مرة أخرى

### المشكلة: "Class 'Composer\...' not found"
**الحل:** شغل `composer install` في مجلد backend

---

<div align="center">
  <strong>✨ بالتوفيق! ✨</strong>
</div>
