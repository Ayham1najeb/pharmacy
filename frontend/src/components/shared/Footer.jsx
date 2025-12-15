import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto bg-slate-900 text-slate-300 border-t border-slate-800">
            <div className="container mx-auto px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-4">
                    {/* Logo and Description */}
                    <div className="md:col-span-5 space-y-3">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white tracking-tight">
                                    صيدليات <span className="text-blue-500">معرة النعمان</span>
                                </h2>
                                <p className="text-sm text-slate-400 font-medium">خدمة المجتمع أولاً</p>
                            </div>
                        </div>

                        <p className="text-slate-400 leading-relaxed text-sm">
                            نقدم خدمة معرفة الصيدليات المناوبة وتوافر الأدوية في مدينة معرة النعمان
                            لتسهيل الوصول للخدمات الصحية في أي وقت.
                        </p>

                        <div className="flex gap-2 pt-1">
                            {['Facebook', 'Twitter', 'Instagram'].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 group"
                                    title={social}
                                >
                                    <span className="text-slate-400 group-hover:text-white text-xs font-bold">{social.charAt(0)}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-3">
                        <h4 className="text-base font-bold text-white mb-3 pb-2 border-b border-slate-800 inline-block">روابط سريعة</h4>
                        <ul className="space-y-2">
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
                                        className="text-slate-400 hover:text-white hover:translate-x-1 text-sm transition-all duration-300 flex items-center gap-2 group"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="md:col-span-4">
                        <h4 className="text-base font-bold text-white mb-3 pb-2 border-b border-slate-800 inline-block">معلومات التواصل</h4>
                        <div className="space-y-2">
                            <div className="flex items-start gap-3 p-2 rounded-lg bg-slate-800/50 border border-slate-800/50 hover:bg-slate-800 hover:border-slate-700 transition-all duration-300">
                                <div className="bg-blue-500/10 p-2 rounded-lg shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-0.5">البريد الإلكتروني</p>
                                    <p className="text-sm text-slate-200 font-medium break-all">info@maarrat-pharmacy.sy</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-2 rounded-lg bg-slate-800/50 border border-slate-800/50 hover:bg-slate-800 hover:border-slate-700 transition-all duration-300">
                                <div className="bg-blue-500/10 p-2 rounded-lg shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-0.5">رقم الهاتف</p>
                                    <p className="text-sm text-slate-200 font-medium" dir="ltr">+963 933 123 456</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-2 rounded-lg bg-slate-800/50 border border-slate-800/50 hover:bg-slate-800 hover:border-slate-700 transition-all duration-300">
                                <div className="bg-blue-500/10 p-2 rounded-lg shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-0.5">العنوان</p>
                                    <p className="text-sm text-slate-200 font-medium">معرة النعمان، إدلب، سوريا</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-4 pb-4 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs container mx-auto px-6">
                    <div className="text-center md:text-right">
                        <p className="text-slate-500">
                            &copy; {currentYear} صيدليات معرة النعمان. جميع الحقوق محفوظة.
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link to="/privacy" className="text-slate-500 hover:text-white transition-colors">
                            سياسة الخصوصية
                        </Link>
                        <Link to="/terms" className="text-slate-500 hover:text-white transition-colors">
                            الشروط والأحكام
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;