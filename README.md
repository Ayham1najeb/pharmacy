# 🏥 نظام صيدليات معرة النعمان المناوبة

نظام متكامل لإدارة ومتابعة مناوبات الصيدليات في مدينة معرة النعمان - إدلب

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Laravel](https://img.shields.io/badge/Laravel-10.x-red.svg)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org)

## 📋 المحتويات

- [نظرة عامة](#نظرة-عامة)
- [المميزات](#المميزات)
- [التقنيات المستخدمة](#التقنيات-المستخدمة)
- [المتطلبات](#المتطلبات)
- [التثبيت](#التثبيت)
- [الاستخدام](#الاستخدام)
- [الأمان](#الأمان)
- [المساهمة](#المساهمة)

## 🎯 نظرة عامة

نظام صيدليات معرة النعمان هو منصة ويب حديثة تهدف إلى تسهيل الوصول إلى معلومات الصيدليات المناوبة في المدينة. يوفر النظام:

- 🗺️ خريطة تفاعلية لمواقع الصيدليات
- 📅 جدول مناوبات شهري وأسبوعي
- 🔍 بحث متقدم حسب الحي أو الاسم
- 📱 اتصال مباشر أو عبر واتساب
- 🌙 دعم الوضع الليلي
- 📲 يعمل كتطبيق موبايل (PWA)
- 🔒 أمان متقدم

## ✨ المميزات

### للمستخدمين

- ✅ واجهة عربية سهلة وبسيطة (RTL)
- ✅ عرض الصيدليات المناوبة الآن واليوم
- ✅ خريطة تفاعلية مع Leaflet
- ✅ بحث وفلترة متقدمة
- ✅ نظام تقييمات ومراجعات
- ✅ إشعارات فورية
- ✅ يعمل بدون إنترنت (Offline)
- ✅ قابل للتثبيت كتطبيق

### للإدارة

- 🔐 نظام تسجيل دخول آمن (JWT)
- 📊 لوحة تحكم شاملة
- ➕ إضافة وتعديل الصيدليات
- 📅 إدارة المناوبات (يدوي وتلقائي)
- 📈 إحصائيات وتقارير
- 👥 إدارة المستخدمين
- ⭐ إدارة التقييمات
- 📝 سجل النشاطات (Activity Logs)
- 📤 تصدير PDF/Excel

## 🛠️ التقنيات المستخدمة

### Backend

- **Framework:** Laravel 10
- **Database:** MySQL
- **Authentication:** Laravel Sanctum (JWT)
- **API:** RESTful API
- **Security:** Rate Limiting, CSRF, XSS Protection

### Frontend

- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router v6
- **Maps:** Leaflet + React Leaflet
- **Styling:** Custom CSS with CSS Variables
- **PWA:** Service Worker, Manifest

### الأمان

- 🔒 JWT Authentication
- 🛡️ Rate Limiting (متعدد المستويات)
- 🔐 CSRF Protection
- 🚫 XSS Prevention
- 📝 Activity Logging
- 🔑 Password Hashing (bcrypt)
- 🌐 HTTPS Only
- 🔍 Input Validation & Sanitization

## 📦 المتطلبات

### Backend

- PHP >= 8.1
- Composer
- MySQL >= 5.7
- Apache/Nginx

### Frontend

- Node.js >= 18.x
- npm >= 9.x

## 🚀 التثبيت

### 1. استنساخ المشروع

```bash
git clone https://github.com/yourusername/maarrat-pharmacy-duty.git
cd maarrat-pharmacy-duty
```

### 2. إعداد Backend

```bash
cd backend

# تثبيت dependencies
composer install

# نسخ ملف البيئة
cp .env.example .env

# توليد مفتاح التطبيق
php artisan key:generate

# إعداد قاعدة البيانات في .env
# DB_DATABASE=maarrat_pharmacy
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# تشغيل migrations
php artisan migrate

# تشغيل seeders (بيانات تجريبية)
php artisan db:seed

# تشغيل السيرفر
php artisan serve
```

### 3. إعداد Frontend

```bash
cd frontend

# تثبيت dependencies
npm install

# إعداد متغيرات البيئة
# أنشئ ملف .env وأضف:
# VITE_API_URL=http://localhost:8000/api/v1

# تشغيل السيرفر
npm run dev
```

## 💻 الاستخدام

### الوصول للنظام

- **الموقع العام:** http://localhost:3000
- **لوحة الإدارة:** http://localhost:3000/admin/login

### بيانات الدخول الافتراضية

```
البريد الإلكتروني: admin@maarrat-pharmacy.sy
كلمة المرور: password123
```

⚠️ **مهم:** تأكد من تغيير بيانات الدخول الافتراضية في بيئة الإنتاج!

## 📚 الـ API

### Public Endpoints

```
GET  /api/v1/pharmacies                    - جميع الصيدليات
GET  /api/v1/pharmacies/{id}               - تفاصيل صيدلية
GET  /api/v1/pharmacies/on-duty-today      - المناوبة اليوم
GET  /api/v1/pharmacies/on-duty-now        - المناوبة الآن
GET  /api/v1/schedule                      - جدول المناوبات
GET  /api/v1/schedule/calendar/{m}/{y}     - جدول شهري
GET  /api/v1/neighborhoods                 - الأحياء
GET  /api/v1/statistics                    - الإحصائيات
```

### Admin Endpoints (تتطلب Authentication)

```
POST   /api/v1/admin/auth/login            - تسجيل الدخول
POST   /api/v1/admin/pharmacies            - إضافة صيدلية
PUT    /api/v1/admin/pharmacies/{id}       - تعديل صيدلية
DELETE /api/v1/admin/pharmacies/{id}       - حذف صيدلية
POST   /api/v1/admin/schedule              - إضافة مناوبة
POST   /api/v1/admin/schedule/generate     - توليد جدول تلقائي
```

## 🔒 الأمان

النظام يطبق أفضل ممارسات الأمان:

### Rate Limiting

- Public APIs: 100 طلب/دقيقة
- Admin APIs: 60 طلب/دقيقة
- Login: 5 محاولات/15 دقيقة

### حماية البيانات

- تشفير كلمات المرور (bcrypt)
- حماية من SQL Injection
- حماية من XSS
- CSRF Protection
- Input Validation
- Output Encoding

### Activity Logging

جميع العمليات الإدارية يتم تسجيلها مع:
- المستخدم
- التاريخ والوقت
- نوع العملية
- القيم القديمة والجديدة
- IP Address

## 📱 PWA (Progressive Web App)

النظام يعمل كتطبيق موبايل:

- ✅ قابل للتثبيت على الهاتف
- ✅ يعمل بدون إنترنت
- ✅ إشعارات Push
- ✅ سريع جداً (Caching)
- ✅ تجربة مشابهة للتطبيقات الأصلية

## 🌐 المتصفحات المدعومة

- ✅ Chrome/Edge (آخر نسختين)
- ✅ Firefox (آخر نسختين)
- ✅ Safari (آخر نسختين)
- ✅ Mobile Browsers

## 🤝 المساهمة

نرحب بالمساهمات! يرجى:

1. Fork المشروع
2. إنشاء branch للميزة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push للـ branch (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت [MIT License](LICENSE)

## 👨‍💻 المطور

تم تطوير هذا النظام بواسطة فريق تطوير صيدليات معرة النعمان

## 📞 التواصل

- 📧 Email: info@maarrat-pharmacy.sy
- 📱 Phone: +963 933 123 456
- 🌐 Website: [maarrat-pharmacy.sy](https://maarrat-pharmacy.sy)

---

<div align="center">
  <strong>صُنع بـ ❤️ في معرة النعمان</strong>
</div>
