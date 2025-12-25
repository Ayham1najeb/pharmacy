import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { pharmacyService } from '../../services/pharmacyService';
import { apiService } from '../../services/api';
import PharmacyCard from '../../components/shared/PharmacyCard';
import { HomePageSkeleton } from '../../components/shared/SkeletonCard';
import AnimatedCounter from '../../components/shared/AnimatedCounter';
import { QUERY_KEYS } from '../../config/queryClient';
import SEO from '../../components/SEO';

const Home = () => {
    // Use React Query for automatic caching - data stays fresh for 3 minutes
    const { data: onDutyNow = [], isLoading: loadingNow } = useQuery({
        queryKey: QUERY_KEYS.onDutyNow,
        queryFn: pharmacyService.getOnDutyNow,
    });

    const { data: onDutyToday = [], isLoading: loadingToday } = useQuery({
        queryKey: QUERY_KEYS.onDutyToday,
        queryFn: pharmacyService.getOnDutyToday,
    });

    const { data: stats = { active_pharmacies: 0, total_neighborhoods: 0 }, isLoading: loadingStats } = useQuery({
        queryKey: QUERY_KEYS.statistics,
        queryFn: () => apiService.get('/api/v1/statistics'),
    });

    const loading = loadingNow || loadingToday || loadingStats;

    // Show skeleton while loading - provides instant visual feedback
    if (loading && onDutyNow.length === 0) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900">
                <SEO
                    title="الرئيسية"
                    description="صيدليات معرة مصرين المناوبة - المنصة الرسمية لمعرفة الصيدليات المناوبة وتوفر الأدوية في المدينة"
                />
                {/* Hero Section - shows immediately */}
                <section className="relative overflow-hidden bg-slate-900">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-pulse-slow"></div>
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                    </div>
                    <div className="container mx-auto px-4 py-16 pb-20 md:py-32 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-md border border-slate-700/50 px-4 py-1.5 rounded-full mb-6 md:mb-8 mt-4 md:mt-0 shadow-lg ring-1 ring-white/10">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                </span>
                                <span className="text-slate-300 font-medium text-xs tracking-wide">خدمة على مدار 24 ساعة</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
                                صيدليات <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">معرة النعمان</span>
                                <br />
                                <span className="text-slate-200">المناوبة</span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-400 mb-6 md:mb-10 leading-relaxed max-w-2xl mx-auto">
                                المنصة الرسمية لمعرفة الصيدليات المناوبة وتوفر الأدوية في المدينة
                            </p>
                        </div>
                    </div>
                </section>
                {/* Skeleton for data sections */}
                <HomePageSkeleton />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <SEO
                title="الرئيسية"
                description="صيدليات معرة مصرين المناوبة - المنصة الرسمية لمعرفة الصيدليات المناوبة وتوفر الأدوية في المدينة"
            />
            {/* Hero Section - Premium Modern */}
            <section className="relative overflow-hidden bg-slate-900">
                {/* Abstract Background Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Main Glows */}
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-pulse-slow"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                </div>



                <div className="container mx-auto px-4 py-16 pb-20 md:py-32 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Status Badge */}
                        <div className="inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-md border border-slate-700/50 px-4 py-1.5 rounded-full mb-6 md:mb-8 mt-4 md:mt-0 shadow-lg ring-1 ring-white/10">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <span className="text-slate-300 font-medium text-xs tracking-wide">خدمة على مدار 24 ساعة</span>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
                            صيدليات <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">معرة النعمان</span>
                            <br />
                            <span className="text-slate-200">المناوبة</span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-400 mb-6 md:mb-10 leading-relaxed max-w-2xl mx-auto">
                            المنصة الرسمية لمعرفة الصيدليات المناوبة وتوفر الأدوية في المدينة
                            <br />
                            <span className="text-slate-500 text-base">معلومات دقيقة • تحديث فوري • موقع دقيق</span>
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4 sm:px-0 -mt-4 md:mt-0">
                            <Link to="/pharmacies" className="group relative px-6 py-3.5 md:py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-base transition-all duration-300 shadow-lg hover:shadow-blue-500/25 overflow-hidden">
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                <span className="relative">عرض جميع الصيدليات</span>
                            </Link>
                            <Link to="/schedule" className="px-6 py-3.5 md:py-3 bg-slate-800/50 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 rounded-xl font-bold text-base transition-all duration-300 backdrop-blur-sm">
                                جدول المناوبات
                            </Link>
                        </div>
                    </div>
                </div>

            </section>

            {/* Stats Section */}
            {/* Stats Section */}
            <section className="py-16 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="bg-white dark:bg-gray-900 rounded-xl p-8 text-center shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="text-5xl font-black text-blue-600 dark:text-blue-400 mb-2">
                                <AnimatedCounter targetValue={onDutyToday.filter(s => new Date(s.duty_date).toDateString() === new Date().toDateString()).length} duration={1200} />
                            </div>
                            <div className="text-gray-600 dark:text-gray-400 font-semibold">صيدليات مناوبة اليوم</div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-xl p-8 text-center shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="text-5xl font-black text-green-600 dark:text-green-400 mb-2">
                                <AnimatedCounter targetValue={onDutyNow.length} duration={1200} />
                            </div>
                            <div className="text-gray-600 dark:text-gray-400 font-semibold">مفتوحة الآن</div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-xl p-8 text-center shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="text-5xl font-black text-purple-600 dark:text-purple-400 mb-2">
                                24/7
                            </div>
                            <div className="text-gray-600 dark:text-gray-400 font-semibold">خدمة متواصلة</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* On Duty Now Section */}
            {onDutyNow.length > 0 && (
                <section className="py-20 bg-white dark:bg-gray-900">
                    <div className="container mx-auto px-4">
                        <div className="mb-12">
                            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full mb-4">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="font-semibold text-sm">مفتوحة الآن</span>
                            </div>
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                                الصيدليات المناوبة حالياً
                                <span className="mr-3 text-2xl text-gray-500 font-normal border-r-2 border-gray-300 pr-3 inline-block">
                                    {new Date().toLocaleDateString('ar-SY', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </span>
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400">الصيدليات المفتوحة في خدمتكم الآن</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {onDutyNow.map(schedule => (
                                <PharmacyCard
                                    key={schedule.id}
                                    pharmacy={schedule.pharmacy}
                                    showSchedule={true}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* On Duty Today (Upcoming) Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-full mb-4">
                            <span className="font-semibold text-sm">الأيام القادمة</span>
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">المناوبات القادمة</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">جدول المناوبات للأيام القادمة</p>
                    </div>
                    {onDutyToday.filter(s => new Date(s.duty_date).toDateString() !== new Date().toDateString()).length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {onDutyToday
                                .filter(s => new Date(s.duty_date).toDateString() !== new Date().toDateString())
                                .map(schedule => (
                                    <PharmacyCard
                                        key={schedule.id}
                                        pharmacy={schedule.pharmacy}
                                        date={schedule.duty_date}
                                        showSchedule={true}
                                    />
                                ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="inline-block p-12 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">لا توجد مناوبات قادمة</h3>
                                <p className="text-gray-500 dark:text-gray-400">يرجى التحقق لاحقاً</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">خدمة صيدليات معرة النعمان</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">نخدم أهالي معرة النعمان بتوفير معلومات دقيقة عن الصيدليات المناوبة في جميع أحياء المدينة</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">تغطية شاملة</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">جميع صيدليات معرة النعمان في مكان واحد - من المركز إلى جميع الأحياء</p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-8 border border-green-200 dark:border-green-800">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">معلومات محلية</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">عناوين دقيقة وأرقام هواتف محدثة لجميع الصيدليات في المدينة</p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-8 border border-purple-200 dark:border-purple-800">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">خدمة مستمرة</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">متابعة يومية لجداول المناوبات لضمان حصولك على الخدمة في أي وقت</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section - Premium Dark */}
            <section className="pt-20 pb-32 relative overflow-hidden bg-slate-900">
                {/* Abstract Background Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] animate-pulse-slow"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight tracking-tight">
                            ابحث عن <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">صيدليتك الآن</span>
                        </h2>
                        <p className="text-xl text-slate-400 mb-12 leading-relaxed max-w-3xl mx-auto">
                            جميع صيدليات معرة النعمان في مكان واحد - معلومات دقيقة ومحدثة على مدار الساعة
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                            <Link to="/pharmacies" className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-blue-500/25 overflow-hidden">
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                <span className="relative">عرض جميع الصيدليات</span>
                            </Link>
                            <Link to="/schedule" className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 rounded-xl font-bold text-lg transition-all duration-300 backdrop-blur-sm">
                                جدول المناوبات
                            </Link>
                        </div>

                        {/* Additional Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-slate-800/30 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 hover:bg-slate-800/50 transition-colors duration-300">
                                <div className="text-4xl font-black text-white mb-2">24/7</div>
                                <div className="text-slate-400 font-medium">خدمة متواصلة</div>
                            </div>
                            <div className="bg-slate-800/30 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 hover:bg-slate-800/50 transition-colors duration-300">
                                <div className="text-4xl font-black text-white mb-2">
                                    <AnimatedCounter targetValue={stats.total_neighborhoods || 0} duration={1500} />
                                </div>
                                <div className="text-slate-400 font-medium">أحياء مغطاة</div>
                            </div>
                            <div className="bg-slate-800/30 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 hover:bg-slate-800/50 transition-colors duration-300">
                                <div className="text-4xl font-black text-white mb-2">
                                    <AnimatedCounter targetValue={stats.active_pharmacies || 0} duration={1500} />
                                </div>
                                <div className="text-slate-400 font-medium">صيدليات متوفرة</div>
                            </div>
                        </div>

                        {/* SEO Content Section - Visible for Search Engines & Users */}
                        <div className="mt-20 text-center relative z-10 border-t border-slate-800 pt-16">
                            <div className="max-w-4xl mx-auto text-slate-400 text-sm leading-7 space-y-4">
                                <h3 className="text-xl font-bold text-slate-300 mb-4">دليل صيدليات معرة النعمان - بوابتك الصحية الشاملة</h3>
                                <p>
                                    يعتبر موقع <strong>صيدليات معرة النعمان</strong> المنصة الأولى والرائدة في تقديم خدمات البحث عن
                                    <Link to="/pharmacies" className="text-blue-400 hover:text-blue-300 mx-1">الصيدليات المناوبة في المعرة</Link>
                                    وضواحيها. نسعى لتسهيل وصول المرضى إلى الدواء في أي وقت، ليلاً أو نهاراً، من خلال جدول محدث يومياً للمناوبات.
                                </p>
                                <p>
                                    إذا كنت تبحث عن <strong>أرقام صيدليات معرة النعمان</strong>، أو <strong>أقرب صيدلية مفتوحة الآن</strong>،
                                    فإن تطبيقنا يوفر لك خريطة تفاعلية وقائمة بجميع الصيدليات الفعالة. نغطي كافة الأحياء السكنية في مدينة معرة النعمان
                                    وريف إدلب، ونعمل بالتنسيق مع الجهات الصحية لضمان دقة المعلومات.
                                </p>
                                <p className="text-slate-500 text-xs">
                                    كلمات مفتاحية: صيدليات المعرة، عنوان صيدلية في المعرة، رقم هاتف صيدلية، مناوبات اليوم، صيدلية ليلية،
                                    طب وصحة، دليل إدلب الطبي، خدمات اسعافية، صيدليات دوار السبع بحرات، صيدليات الحي الشمالي، صيدليات السوق.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
