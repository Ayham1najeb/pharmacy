import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full mb-6 border border-blue-100 dark:border-blue-800">
                        <span className="text-lg">🔒</span>
                        <span className="font-medium text-sm">الخصوصية</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
                        سياسة الخصوصية
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
                                <span className="text-blue-600">📋</span> مقدمة
                            </h2>
                            <p className="leading-relaxed">
                                نحن في موقع صيدليات معرة النعمان نلتزم بحماية خصوصية مستخدمينا. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك عند استخدام موقعنا.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="text-green-600">📊</span> المعلومات التي نجمعها
                            </h2>
                            <ul className="space-y-3 list-none">
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span><strong>معلومات التصفح:</strong> عنوان IP، نوع المتصفح، وقت الزيارة</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span><strong>بيانات التسجيل:</strong> الاسم، البريد الإلكتروني، رقم الهاتف (للصيادلة المسجلين)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span><strong>الموقع الجغرافي:</strong> لتحديد أقرب صيدلية لك (اختياري)</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="text-purple-600">🎯</span> كيف نستخدم المعلومات
                            </h2>
                            <ul className="space-y-3 list-none">
                                <li className="flex items-start gap-3">
                                    <span className="text-purple-500 mt-1">•</span>
                                    <span>عرض الصيدليات المناوبة في منطقتك</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-purple-500 mt-1">•</span>
                                    <span>تحسين تجربة المستخدم على الموقع</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-purple-500 mt-1">•</span>
                                    <span>إرسال إشعارات مهمة للصيادلة المسجلين</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-purple-500 mt-1">•</span>
                                    <span>تحليل إحصائيات الاستخدام لتطوير الخدمة</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="text-red-600">🛡️</span> حماية المعلومات
                            </h2>
                            <p className="leading-relaxed">
                                نستخدم أحدث تقنيات الأمان لحماية بياناتك، بما في ذلك:
                            </p>
                            <ul className="mt-4 space-y-2 list-none">
                                <li className="flex items-center gap-2">
                                    <span className="text-blue-500">🔐</span> تشفير SSL/TLS لجميع الاتصالات
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-blue-500">🔐</span> تخزين آمن لكلمات المرور
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-blue-500">🔐</span> مراجعة دورية لإجراءات الأمان
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="text-orange-600">🤝</span> مشاركة المعلومات
                            </h2>
                            <p className="leading-relaxed">
                                <strong>لا نقوم ببيع أو مشاركة معلوماتك الشخصية</strong> مع أي طرف ثالث إلا في الحالات التالية:
                            </p>
                            <ul className="mt-4 space-y-2 list-none">
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-500">→</span> عند الحصول على موافقتك الصريحة
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-500">→</span> للامتثال للمتطلبات القانونية
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="text-cyan-600">📞</span> تواصل معنا
                            </h2>
                            <p className="leading-relaxed">
                                إذا كان لديك أي أسئلة حول سياسة الخصوصية، يمكنك التواصل معنا عبر:
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

export default PrivacyPolicy;
