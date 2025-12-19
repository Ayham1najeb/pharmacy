import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto bg-[#F8FAFC] dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-t border-slate-300 dark:border-slate-700 transition-colors duration-300">
            {/* Main Content */}
            <div className="container mx-auto px-6 pt-20 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                    {/* Brand Section */}
                    <div className="md:col-span-5 space-y-6 md:mt-12">
                        <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-blue-600 to-emerald-600 p-2.5 rounded-xl shadow-lg shadow-blue-600/20">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                    صيدليات <span className="text-blue-700 dark:text-blue-400">معرة النعمان</span>
                                </h2>
                                <p className="text-base text-slate-700 dark:text-slate-300 font-bold mt-1">خدمة المجتمع أولاً</p>
                            </div>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-loose text-base max-w-md font-medium">
                            نقدم خدمة معرفة الصيدليات المناوبة وتوافر الأدوية في مدينة معرة النعمان
                            لتسهيل الوصول للخدمات الصحية في أي وقت.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-3 pt-4 md:pt-0 md:mt-12">
                        <h4 className="text-xl font-black text-slate-900 dark:text-white mb-6">روابط سريعة</h4>
                        <ul className="space-y-3">
                            {[
                                { to: "/", label: "الرئيسية" },
                                { to: "/schedule", label: "جدول المناوبات" },
                                { to: "/map", label: "خريطة الصيدليات" },
                                { to: "/pharmacies", label: "قائمة الصيدليات" },
                                { to: "/about", label: "حول المشروع" }
                            ].map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className="text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 hover:translate-x-2 text-base font-semibold transition-all duration-300 block w-fit"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="md:col-span-4 pt-4 md:pt-0 md:mt-12">
                        <h4 className="text-xl font-black text-slate-900 dark:text-white mb-6">معلومات التواصل</h4>
                        <div className="space-y-3">
                            <div className="flex items-start gap-4 group">
                                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg shadow-sm border border-blue-100 dark:border-slate-800 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-colors duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="mt-0.5">
                                    <p className="text-xs text-slate-500 dark:text-slate-500 font-bold mb-0.5">البريد الإلكتروني</p>
                                    <p className="text-sm text-slate-800 dark:text-slate-200 font-bold">info@maarrat-pharmacy.sy</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg shadow-sm border border-blue-100 dark:border-slate-800 group-hover:border-emerald-400 dark:group-hover:border-emerald-500 transition-colors duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600 dark:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div className="mt-0.5">
                                    <p className="text-xs text-slate-500 dark:text-slate-500 font-bold mb-0.5">رقم الهاتف</p>
                                    <p className="text-sm text-slate-800 dark:text-slate-200 font-bold" dir="ltr">+963 933 123 456</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg shadow-sm border border-blue-100 dark:border-slate-800 group-hover:border-purple-400 dark:group-hover:border-purple-500 transition-colors duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 dark:text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div className="mt-0.5">
                                    <p className="text-xs text-slate-500 dark:text-slate-500 font-bold mb-0.5">العنوان</p>
                                    <p className="text-sm text-slate-800 dark:text-slate-200 font-bold">معرة النعمان، إدلب، سوريا</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-white/30 dark:bg-slate-800/50 border-t border-slate-300 dark:border-slate-700 transition-colors duration-300">
                <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-right mt-2">
                        <p className="text-slate-700 dark:text-slate-300 text-sm font-bold">
                            &copy; {currentYear} صيدليات معرة النعمان. جميع الحقوق محفوظة.
                        </p>
                        <p className="mt-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                            تم إنشاء الموقع من قبل <span className="text-blue-800 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-all cursor-default scale-105 inline-block">المهندس أيهم نجيب</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-8">
                        <Link to="/privacy" className="text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors text-sm font-bold">
                            سياسة الخصوصية
                        </Link>
                        <Link to="/terms" className="text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors text-sm font-bold">
                            الشروط والأحكام
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
