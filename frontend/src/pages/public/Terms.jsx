import React from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-1.5 rounded-full mb-6 border border-emerald-100 dark:border-emerald-800">
                        <span className="text-lg">📜</span>
                        <span className="font-medium text-sm">الشروط والأحكام</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
                        الشروط والأحكام
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        آخر تحديث: ديسمبر 2024
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 md:p-12">
                    <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-8">

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="text-emerald-600">1️⃣</span> قبول الشروط
                            </h2>
                            <p className="leading-relaxed">
                                باستخدامك لموقع صيدليات معرة النعمان، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام الموقع.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="text-blue-600">2️⃣</span> وصف الخدمة
                            </h2>
                            <p className="leading-relaxed mb-4">
                                يوفر موقع صيدليات معرة النعمان الخدمات التالية:
                            </p>
                            <ul className="space-y-3 list-none">
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-500 mt-1">💊</span>
                                    <span>عرض جدول الصيدليات المناوبة في المدينة</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-500 mt-1">📍</span>
                                    <span>توفير مواقع وأرقام هواتف الصيدليات</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-500 mt-1">📅</span>
                                    <span>عرض جداول المناوبات الشهرية</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-500 mt-1">🗺️</span>
                                    <span>خريطة تفاعلية لمواقع الصيدليات</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="text-purple-600">3️⃣</span> حسابات المستخدمين
                            </h2>
                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 mb-4 border border-purple-100 dark:border-purple-800">
                                <p className="font-semibold text-purple-800 dark:text-purple-300">للصيادلة المسجلين:</p>
                            </div>
                            <ul className="space-y-2 list-none">
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-500">•</span>
                                    <span>أنت مسؤول عن الحفاظ على سرية معلومات حسابك</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-500">•</span>
                                    <span>يجب تقديم معلومات صحيحة ودقيقة عن الصيدلية</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-500">•</span>
                                    <span>يحق للإدارة تعليق أو إلغاء الحسابات المخالفة</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="text-orange-600">4️⃣</span> الاستخدام المقبول
                            </h2>
                            <p className="leading-relaxed mb-4">
                                عند استخدام الموقع، يُحظر عليك:
                            </p>
                            <ul className="space-y-2 list-none">
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500">✗</span>
                                    <span>إدخال معلومات كاذبة أو مضللة</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500">✗</span>
                                    <span>محاولة اختراق أو تعطيل الموقع</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500">✗</span>
                                    <span>استخدام الموقع لأغراض غير قانونية</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500">✗</span>
                                    <span>نسخ محتوى الموقع دون إذن</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="text-yellow-600">5️⃣</span> إخلاء المسؤولية
                            </h2>
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
                                <p className="leading-relaxed text-yellow-800 dark:text-yellow-300">
                                    <strong>⚠️ تنبيه:</strong> المعلومات المقدمة على الموقع هي لأغراض إعلامية فقط. نسعى لتحديث المعلومات بشكل مستمر، لكننا لا نضمن دقتها بنسبة 100%. يُنصح بالاتصال بالصيدلية للتأكد قبل الزيارة.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="text-cyan-600">6️⃣</span> حقوق الملكية
                            </h2>
                            <p className="leading-relaxed">
                                جميع المحتويات على هذا الموقع، بما في ذلك التصميم والشعارات والنصوص، هي ملك لموقع صيدليات معرة النعمان ومحمية بموجب قوانين حقوق الملكية الفكرية.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="text-green-600">7️⃣</span> التعديلات
                            </h2>
                            <p className="leading-relaxed">
                                نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم نشر التعديلات على هذه الصفحة مع تاريخ آخر تحديث.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="text-pink-600">📞</span> تواصل معنا
                            </h2>
                            <p className="leading-relaxed">
                                لأي استفسارات حول الشروط والأحكام:
                            </p>
                            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                <p className="font-semibold">البريد الإلكتروني: ayhamoy2@gmail.com</p>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Back Link */}
                <div className="text-center mt-8">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
                    >
                        <span>←</span>
                        العودة للرئيسية
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Terms;
