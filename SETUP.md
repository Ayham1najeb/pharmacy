# 🚀 تعليمات التشغيل - نظام صيدليات معرة النعمان

## ✅ ما تم إنجازه:

### Backend (Laravel):
- ✅ 6 جداول قاعدة بيانات مع indexes
- ✅ 6 Models مع relationships
- ✅ 8 Controllers (30+ API endpoints)
- ✅ نظام أمان متقدم (JWT, Rate Limiting)
- ✅ Activity Logging
- ✅ 3 Seeders مع بيانات تجريبية

### Frontend (React + Tailwind CSS):
- ✅ تصميم احترافي مع **Tailwind CSS**
- ✅ Dark Mode كامل
- ✅ RTL Support
- ✅ Gradients وAnimations
- ✅ Responsive Design
- ✅ PWA Support

---

## 📋 خطوات التشغيل:

### 1️⃣ Backend Setup

```bash
cd backend

# تثبيت Dependencies
composer install

# نسخ ملف البيئة
cp .env.example .env

# توليد مفتاح التطبيق
php artisan key:generate

# تعديل .env (افتح الملف وعدّل):
# DB_DATABASE=maarrat_pharmacy
# DB_USERNAME=root
# DB_PASSWORD=

# تشغيل Migrations
php artisan migrate

# تشغيل Seeders (بيانات تجريبية)
php artisan db:seed

# تشغيل السيرفر
php artisan serve
```

✅ Backend جاهز على: http://localhost:8000

---

### 2️⃣ Frontend Setup

```bash
cd frontend

# تثبيت Dependencies (بما فيها Tailwind CSS)
npm install

# نسخ ملف البيئة
cp .env.example .env

# تشغيل السيرفر
npm run dev
```

✅ Frontend جاهز على: http://localhost:3000

---

## 🔐 بيانات الدخول للإدارة:

- **URL:** http://localhost:3000/admin/login
- **Email:** admin@maarrat-pharmacy.sy
- **Password:** password123

⚠️ **مهم:** غيّر هذه البيانات في بيئة الإنتاج!

---

## 🎨 التصميم الجديد مع Tailwind CSS:

### ما تم تحديثه:
1. ✅ **Header** - مع gradient logo وmenu responsive
2. ✅ **Footer** - مع gradient background
3. ✅ **PharmacyCard** - مع gradient header وbuttons حديثة
4. ✅ **Home Page** - مع:
   - Hero section مع gradient وwave divider
   - Animated background
   - Stats cards مع hover effects
   - Features section مع icons كبيرة

### الميزات:
- 🎨 Gradients احترافية
- ✨ Animations سلسة
- 🌙 Dark Mode كامل
- 📱 Responsive تماماً
- ⚡ Performance عالي

---

## 🧪 اختبار النظام:

### 1. اختبر الصفحة الرئيسية:
- افتح http://localhost:3000
- شوف Hero section الجديد
- جرب Dark Mode (زر القمر/الشمس)
- شوف الصيدليات المناوبة

### 2. اختبر الـ APIs:
```bash
# جميع الصيدليات
curl http://localhost:8000/api/v1/pharmacies

# المناوبة اليوم
curl http://localhost:8000/api/v1/pharmacies/on-duty-today

# الإحصائيات
curl http://localhost:8000/api/v1/statistics
```

### 3. اختبر لوحة الإدارة:
- سجل دخول بالبيانات أعلاه
- جرب إضافة صيدلية
- جرب إضافة مناوبة

---

## 📁 الملفات المهمة:

- `README.md` - دليل شامل
- `QUICKSTART.md` - تعليمات سريعة
- `walkthrough.md` - توثيق كامل
- `tailwind.config.js` - إعدادات Tailwind

---

## 🐛 حل المشاكل الشائعة:

### المشكلة: "Unknown at rule @tailwind"
**الحل:** هذا تحذير عادي من CSS linter، يمكن تجاهله. Tailwind سيعمل بشكل صحيح.

### المشكلة: Backend لا يعمل
**الحل:** 
- تأكد من تشغيل MySQL
- تأكد من إعدادات .env صحيحة
- شغل `php artisan migrate` مرة أخرى

### المشكلة: Frontend لا يعمل
**الحل:**
- احذف `node_modules` و `package-lock.json`
- شغل `npm install` مرة أخرى

---

## 🎯 الخطوات التالية (اختياري):

- [ ] إضافة صفحة الخريطة التفاعلية
- [ ] إضافة صفحة جدول المناوبات
- [ ] إضافة صفحات الإدارة
- [ ] إضافة نظام الإشعارات
- [ ] إضافة تصدير PDF

---

<div align="center">
  <strong>✨ تم بناء النظام بنجاح! ✨</strong>
  <br>
  <strong>صُنع بـ ❤️ في معرة النعمان</strong>
</div>
