import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Schedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedDate, setSelectedDate] = useState(null);

    const arabicMonths = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];

    const arabicDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

    useEffect(() => {
        fetchSchedules();
    }, [currentMonth, currentYear]);

    const fetchSchedules = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${API_BASE}/api/v1/schedule/calendar/${currentMonth}/${currentYear}`
            );
            // API returns object grouped by date like { "2024-12-10": [...], "2024-12-11": [...] }
            if (response.data && typeof response.data === 'object') {
                setSchedules(response.data);
            } else {
                setSchedules({});
            }
        } catch (error) {
            console.error('Error fetching schedules:', error);
            // Try alternative endpoint
            try {
                const response = await axios.get(`${API_BASE}/api/v1/schedule`);
                // This returns an array, convert to object
                if (Array.isArray(response.data)) {
                    const grouped = {};
                    response.data.forEach(schedule => {
                        const date = schedule.duty_date?.split('T')[0] || schedule.duty_date;
                        if (!grouped[date]) grouped[date] = [];
                        grouped[date].push(schedule);
                    });
                    setSchedules(grouped);
                } else {
                    setSchedules({});
                }
            } catch (err) {
                console.error('Error fetching schedules:', err);
                setSchedules({});
            }
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = (month, year) => {
        return new Date(year, month, 0).getDate();
    };

    const getFirstDayOfMonth = (month, year) => {
        return new Date(year, month - 1, 1).getDay();
    };

    const getSchedulesForDate = (day) => {
        const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        // schedules is now an object with dates as keys
        return schedules[dateStr] || [];
    };

    const isToday = (day) => {
        const today = new Date();
        return day === today.getDate() &&
            currentMonth === today.getMonth() + 1 &&
            currentYear === today.getFullYear();
    };

    const prevMonth = () => {
        if (currentMonth === 1) {
            setCurrentMonth(12);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
        setSelectedDate(null);
    };

    const nextMonth = () => {
        if (currentMonth === 12) {
            setCurrentMonth(1);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
        setSelectedDate(null);
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
        const days = [];

        // Empty cells before first day
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50 dark:bg-gray-800/50"></div>);
        }

        // Days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const daySchedules = getSchedulesForDate(day);
            const hasSchedule = daySchedules.length > 0;
            const isTodayDate = isToday(day);
            const isSelected = selectedDate === day;

            days.push(
                <div
                    key={day}
                    onClick={() => setSelectedDate(day)}
                    className={`min-h-[100px] md:h-24 p-2 md:p-2 border border-gray-200 dark:border-gray-700 cursor-pointer transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 ${isTodayDate ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500' : 'bg-white dark:bg-gray-800'
                        } ${isSelected ? 'ring-2 ring-green-500' : ''}`}
                >
                    <div className="flex justify-between items-start">
                        <span className={`font-bold ${isTodayDate ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-white'}`}>
                            {day}
                        </span>
                        {hasSchedule && (
                            <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                {daySchedules.length}
                            </span>
                        )}
                    </div>
                    {hasSchedule && (
                        <div className="mt-1 space-y-1">
                            {daySchedules.slice(0, 2).map((schedule, idx) => (
                                <div key={idx} className="text-xs bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 px-1 py-0.5 rounded truncate">
                                    {schedule.pharmacy?.name || 'صيدلية'}
                                </div>
                            ))}
                            {daySchedules.length > 2 && (
                                <div className="text-xs text-gray-500">+{daySchedules.length - 2} أخرى</div>
                            )}
                        </div>
                    )}
                </div>
            );
        }

        return days;
    };

    const selectedSchedules = selectedDate ? getSchedulesForDate(selectedDate) : [];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-900 font-sans text-slate-900 dark:text-white py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full mb-6 border border-blue-100 dark:border-blue-800 shadow-sm">
                        <span className="text-lg">📅</span>
                        <span className="font-medium text-sm">جدول المناوبات</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-3">
                        الصيدليات المناوبة
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        استعرض جدول المناوبات الشهري واعرف الصيدليات المتاحة لخدمتك في أي يوم
                    </p>
                </div>

                {/* Month Navigation */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700 p-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                        <button
                            onClick={prevMonth}
                            className="px-5 py-2.5 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 text-slate-600 dark:text-gray-300 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-600 hover:border-slate-300 transition-all font-medium shadow-sm hover:shadow"
                        >
                            ← الشهر السابق
                        </button>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                            {arabicMonths[currentMonth - 1]} <span className="text-slate-400 dark:text-gray-500 font-light">{currentYear}</span>
                        </h2>
                        <button
                            onClick={nextMonth}
                            className="px-5 py-2.5 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 text-slate-600 dark:text-gray-300 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-600 hover:border-slate-300 transition-all font-medium shadow-sm hover:shadow"
                        >
                            الشهر التالي →
                        </button>
                    </div>

                    {/* Day Headers */}
                    <div className="grid grid-cols-7 gap-px bg-slate-100 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-t-xl overflow-hidden text-center mb-px">
                        {arabicDays.map(day => (
                            <div key={day} className="py-2 md:py-3 bg-slate-50 dark:bg-gray-800 font-semibold text-slate-500 dark:text-gray-400 text-[10px] md:text-sm">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    {loading ? (
                        <div className="text-center py-24 bg-slate-50/50 dark:bg-gray-800/50 rounded-b-xl border border-slate-200/50 dark:border-gray-700">
                            <div className="w-8 h-8 border-2 border-slate-200 dark:border-gray-600 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
                            <p className="text-slate-400 dark:text-gray-500 font-medium">جاري جلب البيانات...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-gray-700 rounded-b-xl overflow-hidden border-x border-b border-slate-200 dark:border-gray-700">
                            {renderCalendar()}
                        </div>
                    )}
                </div>

                {/* Selected Day Details */}
                {selectedDate && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-gray-700 p-8 animate-fade-in-up">
                        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100 dark:border-gray-700">
                            <span className="flex items-center justify-center w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl text-xl font-bold border border-blue-100 dark:border-blue-800">
                                {selectedDate}
                            </span>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                    مناوبات يوم {arabicDays[new Date(currentYear, currentMonth - 1, selectedDate).getDay()]}
                                </h3>
                                <p className="text-slate-500 dark:text-gray-400 text-sm mt-0.5">
                                    {arabicMonths[currentMonth - 1]} {currentYear}
                                </p>
                            </div>
                        </div>

                        {selectedSchedules.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {selectedSchedules.map((schedule, idx) => (
                                    <div key={idx} className="group relative bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
                                        <div className="absolute top-4 left-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${schedule.shift_type === 'full' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                                                schedule.shift_type === 'day' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                                    'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                                }`}>
                                                {schedule.shift_type === 'full' ? '24 ساعة' :
                                                    schedule.shift_type === 'day' ? 'نهاري' : 'ليلي'}
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-2xl border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                                                💊
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                                                    {schedule.pharmacy?.name || 'صيدلية'}
                                                </h4>
                                                <div className="space-y-1.5">
                                                    <p className="text-slate-500 text-sm flex items-center gap-1.5">
                                                        <span className="text-slate-400">📍</span>
                                                        {schedule.pharmacy?.neighborhood?.name || 'العنوان غير متوفر'}
                                                    </p>
                                                    {schedule.pharmacy?.phone && (
                                                        <a
                                                            href={`tel:${schedule.pharmacy.phone}`}
                                                            className="text-slate-600 hover:text-blue-600 text-sm font-medium flex items-center gap-1.5 transition-colors w-max"
                                                        >
                                                            <span className="text-slate-400">📞</span>
                                                            <span dir="ltr">{schedule.pharmacy.phone}</span>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {schedule.notes && (
                                            <div className="mt-4 pt-4 border-t border-slate-50">
                                                <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                                                    📝 {schedule.notes}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <span className="text-4xl block mb-3 opacity-50">😴</span>
                                <h4 className="text-lg font-medium text-slate-900 mb-1">لا توجد مناوبات مسجلة</h4>
                                <p className="text-slate-500 text-sm">لم يتم تسجيل أي صيدليات مناوبة لهذا اليوم بعد.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Schedule;
