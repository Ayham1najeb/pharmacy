import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {
    FiCalendar,
    FiClock,
    FiMapPin,
    FiPhone,
    FiUser,
    FiPlus,
    FiHome,
    FiGrid,
    FiSettings,
    FiLogOut
} from 'react-icons/fi';
import { BiBuildingHouse, BiStore } from 'react-icons/bi';
import { BsStars } from 'react-icons/bs';

const PharmacistDashboard = () => {
    const { user, logout } = useAuth(); // Assuming logout is available in AuthContext, otherwise handle it
    const [pharmacy, setPharmacy] = useState(null);
    const [upcomingSchedules, setUpcomingSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [profileRes, schedulesRes] = await Promise.all([
                axios.get('/api/v1/pharmacist/profile'),
                axios.get('/api/v1/pharmacist/my-schedules'),
            ]);

            setPharmacy(profileRes.data.pharmacy);
            setUpcomingSchedules(schedulesRes.data.data?.slice(0, 5) || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        window.location.href = '/';
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex justify-center items-center">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20 selection:bg-indigo-100 selection:text-indigo-900">
            {/* Top Navigation Bar */}
            <nav className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)]">
                <div className="container mx-auto px-4 max-w-6xl h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-md shadow-indigo-200">
                            <BiStore className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-slate-900">بوابة الصيدلي</span>
                    </div>
                    <Link
                        to="/"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-all border border-transparent hover:border-slate-100"
                    >
                        <FiHome className="w-4 h-4" />
                        <span className="hidden sm:inline">الرئيسية</span>
                    </Link>
                </div>
            </nav>

            <div className="container mx-auto px-4 max-w-6xl mt-8">
                {/* Welcome Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 translate-y-0 animate-fade-in">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">مرحباً، {user?.name} 👋</h1>
                        </div>
                        <p className="text-slate-500 text-lg">إليك نظرة عامة على صيدليتك ومناوباتك القادمة.</p>
                    </div>
                    <Link
                        to="/pharmacist/schedule"
                        className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform hover:-translate-y-0.5"
                    >
                        <FiPlus className="w-5 h-5" />
                        <span>إضافة مناوبة جديدة</span>
                    </Link>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Stats & Pharmacy Info */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Status Cards */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            {/* Pharmacy Card */}
                            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group transition-all hover:shadow-2xl hover:shadow-indigo-200">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-all duration-700"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-10 -mb-10 blur-xl"></div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl border border-white/10">
                                            <BiBuildingHouse className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold border border-white/20 flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                            نشط
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-indigo-100 text-sm font-medium mb-1">اسم الصيدلية</h3>
                                        <p className="text-2xl font-bold tracking-tight mb-5">{pharmacy?.name}</p>
                                        <div className="flex flex-col gap-2 text-indigo-50 text-sm">
                                            <div className="flex items-center gap-2">
                                                <FiMapPin className="w-4 h-4 text-indigo-200" />
                                                <span className="font-medium">{pharmacy?.neighborhood?.name || '-'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FiPhone className="w-4 h-4 text-indigo-200" />
                                                <span dir="ltr" className="font-mono font-medium opacity-90">{pharmacy?.phone || '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Verification Status / Next Shift Teaser */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-indigo-100 transition-all hover:shadow-md">
                                <div>
                                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                        <BsStars className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-slate-500 font-medium text-sm mb-1">حالة الحساب</h3>
                                    <p className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                        موثق ومفعل
                                        <span className="flex h-3 w-3 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                        </span>
                                    </p>
                                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                                        حسابك ظاهر للعامة ويمكن للمرضى العثور على صيدليتك في جدول المناوبات.
                                    </p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-50">
                                    <Link to="/pharmacist/profile" className="text-sm text-indigo-600 font-bold hover:text-indigo-700 flex items-center gap-1 group/link">
                                        عرض التفاصيل
                                        <span className="group-hover/link:-translate-x-1 transition-transform">&larr;</span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Recent Shifts List */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[300px]">
                            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2.5">
                                    <div className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600">
                                        <FiCalendar className="w-4 h-4" />
                                    </div>
                                    المناوبات القادمة
                                </h3>
                                <Link to="/pharmacist/schedule" className="text-xs font-semibold bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                                    عرض الجدول الكامل
                                </Link>
                            </div>

                            {upcomingSchedules.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                                        <FiCalendar className="w-10 h-10 text-slate-300" />
                                    </div>
                                    <p className="text-slate-600 font-medium text-lg">لا توجد مناوبات قادمة</p>
                                    <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">لم تقم بإضافة أي مناوبات قادمة بعد. أضف مناوباتك ليتمكن الناس من العثور عليك.</p>
                                    <Link
                                        to="/pharmacist/schedule"
                                        className="mt-6 text-indigo-600 font-medium text-sm hover:underline hover:text-indigo-700"
                                    >
                                        + إضافة مناوبة الآن
                                    </Link>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-50">
                                    {upcomingSchedules.map((schedule, index) => (
                                        <div key={schedule.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/80 transition-colors group cursor-default">
                                            <div className="flex items-center gap-4">
                                                <div className={`
                                                    w-14 h-14 rounded-2xl flex flex-col items-center justify-center shadow-sm border
                                                    ${schedule.shift_type === 'full' ? 'bg-purple-50 border-purple-100 text-purple-700' :
                                                        schedule.shift_type === 'day' ? 'bg-amber-50 border-amber-100 text-amber-700' :
                                                            'bg-blue-50 border-blue-100 text-blue-700'}
                                                `}>
                                                    <span className="text-lg font-bold leading-none">{new Date(schedule.duty_date).getDate()}</span>
                                                    <span className="text-[10px] font-medium uppercase opacity-75 pt-0.5">
                                                        {new Date(schedule.duty_date).toLocaleDateString('en-US', { month: 'short' })}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-lg mb-0.5">
                                                        {new Date(schedule.duty_date).toLocaleDateString('ar-SY', { weekday: 'long' })}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                                        <FiClock className="w-3.5 h-3.5" />
                                                        <span>
                                                            {schedule.shift_type === 'full' ? 'لمدة 24 ساعة' :
                                                                schedule.shift_type === 'day' ? 'دوام نهاري' : 'دوام مسائي'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="hidden sm:block">
                                                <span className={`
                                                    px-3 py-1 rounded-full text-xs font-bold border
                                                    ${schedule.shift_type === 'full' ? 'bg-white text-purple-700 border-purple-200' :
                                                        schedule.shift_type === 'day' ? 'bg-white text-amber-700 border-amber-200' :
                                                            'bg-white text-blue-700 border-blue-200'}
                                                `}>
                                                    {schedule.shift_type === 'full' ? 'كامل' :
                                                        schedule.shift_type === 'day' ? 'صباحي' : 'مسائي'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Quick Menu */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-24">
                            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <FiGrid className="w-5 h-5 text-indigo-500" />
                                وصول سريع
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                <Link to="/pharmacist/profile" className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 transition-all group border border-transparent hover:border-indigo-100">
                                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-500 group-hover:text-indigo-600 group-hover:scale-110 transition-all">
                                        <FiUser className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="block font-bold text-sm">الملف الشخصي</span>
                                        <span className="block text-xs text-slate-400 group-hover:text-indigo-400/80 transition-colors">تعديل بيانات الصيدلية</span>
                                    </div>
                                    <span className="text-slate-300 group-hover:text-indigo-500 transition-colors">&larr;</span>
                                </Link>

                                <Link to="/pharmacist/schedule" className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition-all group border border-transparent hover:border-emerald-100">
                                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-500 group-hover:text-emerald-600 group-hover:scale-110 transition-all">
                                        <FiCalendar className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="block font-bold text-sm">جدول المناوبات</span>
                                        <span className="block text-xs text-slate-400 group-hover:text-emerald-400/80 transition-colors">إدارة أوقات الدوام</span>
                                    </div>
                                    <span className="text-slate-300 group-hover:text-emerald-500 transition-colors">&larr;</span>
                                </Link>

                                <div className="h-px bg-slate-100 my-2"></div>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-4 p-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 transition-all group w-full text-right"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-red-500 group-hover:text-red-600 group-hover:scale-110 transition-all">
                                        <FiLogOut className="w-5 h-5 transform rotate-180" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="block font-bold text-sm">تسجيل خروج</span>
                                        <span className="block text-xs text-red-400 opacity-80">إنهاء الجلسة الحالية</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Tips Card */}
                        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg hidden lg:block">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/20 rounded-full -ml-10 -mb-10 blur-xl"></div>

                            <div className="relative z-10">
                                <div className="bg-white/10 w-fit p-2 rounded-lg mb-4 backdrop-blur-md">
                                    <BsStars className="text-yellow-300 w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">هل تعلم؟</h3>
                                <p className="text-indigo-100 text-sm leading-relaxed opacity-90">
                                    تحديث أوقات مناوباتك بانتظام يزيد من ثقة المرضى ويساعدهم في الوصول إليك عند الحاجة في الأوقات الحرجة.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PharmacistDashboard;
