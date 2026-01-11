import React from 'react';

const About = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-900 font-sans text-slate-900 dark:text-white">
            {/* Hero Section */}
            <div className="bg-slate-900 text-white py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">من نحن</h1>
                    <p className="text-xl md:text-2xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed">
                        نسعى لتسهيل حياة المواطنين في معرة النعمان عبر توفير معلومات دقيقة ولحظية عن الخدمات الصيدلانية
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 max-w-6xl -mt-16 relative z-10">
                {/* Vision Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none p-10 border border-slate-100 dark:border-gray-700 mb-20 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl text-3xl mb-6 shadow-sm border border-blue-100 dark:border-blue-800">👁️</div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">رؤيتنا</h2>
                    <p className="text-xl text-slate-600 dark:text-gray-400 leading-relaxed max-w-4xl mx-auto mb-12 font-light">
                        أن نكون المرجع الأول والموثوق للمعلومات الصحية في المنطقة، مسخرين التقنية لخدمة المجتمع وتوفير الوقت والجهد على المرضى وذويهم.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 border-t border-slate-100 dark:border-gray-700 pt-10">
                        <div className="text-center group">
                            <div className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-2 tracking-tighter group-hover:scale-110 transition-transform duration-300">يومياً</div>
                            <p className="text-slate-500 dark:text-gray-400 font-medium">خدمة متواصلة</p>
                        </div>
                        <div className="text-center md:border-x border-slate-100 dark:border-gray-700 group">
                            <div className="text-4xl font-black text-emerald-500 dark:text-emerald-400 mb-2 tracking-tighter group-hover:scale-110 transition-transform duration-300">100%</div>
                            <p className="text-slate-500 dark:text-gray-400 font-medium">دقة وموثوقية</p>
                        </div>
                        <div className="text-center group">
                            <div className="text-4xl font-black text-slate-700 dark:text-gray-300 mb-2 tracking-tighter group-hover:scale-110 transition-transform duration-300">مجاناً</div>
                            <p className="text-slate-500 dark:text-gray-400 font-medium">خدمة عامة</p>
                        </div>
                    </div>
                </div>

                {/* Goals Grid */}
                <section className="mb-24">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">قيمنا وأهدافنا</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-md transition-all group">
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform border border-blue-100 dark:border-blue-800">🎯</div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">سهولة الوصول</h3>
                            <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed">توفير المعلومة الصحيحة في الوقت المناسب وبأقل جهد ممكن.</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-md transition-all group">
                            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform border border-emerald-100 dark:border-emerald-800">⏰</div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">توفير الوقت</h3>
                            <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed">تقليل عناء البحث والتنقل بين الصيدليات، خاصة في الحالات الطارئة.</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-700 hover:shadow-md transition-all group">
                            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform border border-purple-100 dark:border-purple-800">💡</div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">الابتكار</h3>
                            <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed">توظيف التكنولوجيا الحديثة لتقديم حلول عملية لمشاكل يومية.</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-gray-700 hover:border-amber-200 dark:hover:border-amber-700 hover:shadow-md transition-all group">
                            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform border border-amber-100 dark:border-amber-800">🤝</div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">المسؤولية</h3>
                            <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed">الالتزام بخدمة المجتمع بكل أمانة وشفافية.</p>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="mb-20">
                    <div className="bg-slate-900 text-white rounded-2xl shadow-xl overflow-hidden relative">
                        <div className="absolute inset-0 opacity-[0.05]" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                        }} />

                        <div className="relative z-10 p-12 text-center">
                            <h2 className="text-3xl font-bold mb-10">تواصل معنا</h2>
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="text-3xl mb-4">📧</div>
                                    <h3 className="font-bold text-lg mb-2 text-white">البريد الإلكتروني</h3>
                                    <p className="text-slate-300 text-sm">ayhamoy2@gmail.com</p>
                                </div>
                                <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="text-3xl mb-4">📱</div>
                                    <h3 className="font-bold text-lg mb-2 text-white">الهاتف</h3>
                                    <p className="text-slate-300 text-sm" dir="ltr">05519547382</p>
                                </div>
                                <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="text-3xl mb-4">📍</div>
                                    <h3 className="font-bold text-lg mb-2 text-white">الموقع</h3>
                                    <p className="text-slate-300 text-sm">معرة النعمان - إدلب</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;
