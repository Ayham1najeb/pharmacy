import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pharmacyService } from '../../services/pharmacyService';
import PharmacyCard from '../../components/shared/PharmacyCard';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const Home = () => {
    const [onDutyNow, setOnDutyNow] = useState([]);
    const [onDutyToday, setOnDutyToday] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [nowData, todayData] = await Promise.all([
                pharmacyService.getOnDutyNow(),
                pharmacyService.getOnDutyToday()
            ]);
            setOnDutyNow(nowData);
            setOnDutyToday(todayData);
        } catch (err) {
            setError('حدث خطأ في تحميل البيانات');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Hero Section - Professional */}
            <section className="relative overflow-hidden" style={{ background: 'linear-gradient(to bottom right, rgb(16,49,120), rgb(37,99,235), rgb(59,130,246))' }}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }} />
                </div>

                <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Status Badge */}
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full mb-8">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-white font-semibold text-sm">خدمة متاحة على مدار الساعة</span>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
                            صيدليات معرة النعمان<br />
                            <span className="text-blue-200">المناوبة</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed">
                            ابحث عن أقرب صيدلية مناوبة بسهولة وسرعة
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/pharmacies" className="px-8 py-4 bg-white text-blue-700 rounded-lg font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl">
                                عرض جميع الصيدليات
                            </Link>
                            <Link to="/schedule" className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-lg font-bold text-lg hover:bg-white/20 transition-all duration-300">
                                جدول المناوبات
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" className="w-full h-auto" preserveAspectRatio="none">
                        <path fill="currentColor" className="text-white dark:text-gray-900" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
                    </svg>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="bg-white dark:bg-gray-900 rounded-xl p-8 text-center shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="text-5xl font-black text-blue-600 dark:text-blue-400 mb-2">
                                {onDutyToday.filter(s => new Date(s.duty_date).toDateString() === new Date().toDateString()).length}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400 font-semibold">صيدليات مناوبة اليوم</div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-xl p-8 text-center shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="text-5xl font-black text-green-600 dark:text-green-400 mb-2">
                                {onDutyNow.length}
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

            {/* On Duty Today Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-full mb-4">
                            <span className="font-semibold text-sm">الأيام القادمة</span>
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">المناوبات القادمة</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">جدول المناوبات للأيام القادمة</p>
                    </div>
                    {onDutyToday.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {onDutyToday.map(schedule => (
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
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">لا توجد صيدليات مناوبة اليوم</h3>
                                <p className="text-gray-500 dark:text-gray-400">يرجى المحاولة لاحقاً</p>
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

            {/* CTA Section */}
            <section className="pt-20 pb-32 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom right, rgb(16,49,120), rgb(37,99,235), rgb(59,130,246))' }}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }} />
                </div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight">ابحث عن صيدليتك الآن</h2>
                        <p className="text-2xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto">جميع صيدليات معرة النعمان في مكان واحد - معلومات دقيقة ومحدثة على مدار الساعة</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <Link to="/pharmacies" className="px-12 py-5 bg-white text-blue-700 rounded-lg font-bold text-xl hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-3xl">عرض جميع الصيدليات</Link>
                            <Link to="/schedule" className="px-12 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-lg font-bold text-xl hover:bg-white/20 transition-all duration-300">جدول المناوبات</Link>
                        </div>

                        {/* Additional Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="text-4xl font-black text-white mb-2">24/7</div>
                                <div className="text-blue-100">خدمة متواصلة</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="text-4xl font-black text-white mb-2">6</div>
                                <div className="text-blue-100">أحياء مغطاة</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="text-4xl font-black text-white mb-2">5+</div>
                                <div className="text-blue-100">صيدليات متوفرة</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
