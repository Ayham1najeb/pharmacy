import React, { useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';

const ScheduleManagement = () => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // Mock data for demonstration
    const schedules = [
        { id: 1, pharmacy: 'صيدلية الشفاء', date: '2025-12-15', shift: 'نهاري' },
        { id: 2, pharmacy: 'صيدلية النور', date: '2025-12-15', shift: 'ليلي' },
        { id: 3, pharmacy: 'صيدلية الأمل', date: '2025-12-16', shift: 'نهاري' },
        { id: 4, pharmacy: 'صيدلية السلام', date: '2025-12-16', shift: 'ليلي' },
    ];

    const months = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 lg:mr-80 p-4 lg:p-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">إدارة المناوبات</h1>
                    <p className="text-gray-600">جدولة وإدارة المناوبات اليومية للصيدليات</p>
                </div>

                {/* Month/Year Selector */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div className="flex gap-4 items-center">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">الشهر</label>
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                {months.map((month, index) => (
                                    <option key={index} value={index}>{month}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">السنة</label>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                {[2024, 2025, 2026].map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1 pt-7">
                            <button className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                                توليد مناوبات تلقائي
                            </button>
                        </div>
                    </div>
                </div>

                {/* Schedule Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                        <h2 className="text-xl font-bold text-gray-900">جدول المناوبات - {months[selectedMonth]} {selectedYear}</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">التاريخ</th>
                                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">الصيدلية</th>
                                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">الفترة</th>
                                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {schedules.map((schedule) => (
                                    <tr key={schedule.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-gray-900 font-semibold">
                                            {new Date(schedule.date).toLocaleDateString('ar-SY')}
                                        </td>
                                        <td className="px-6 py-4 text-gray-900">{schedule.pharmacy}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${schedule.shift === 'نهاري'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {schedule.shift}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold mr-2">
                                                تعديل
                                            </button>
                                            <button className="px-4 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold">
                                                حذف
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add New Schedule */}
                <div className="mt-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-6 border-2 border-green-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">إضافة مناوبة جديدة</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="date"
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder="التاريخ"
                        />
                        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                            <option>اختر الصيدلية</option>
                            <option>صيدلية الشفاء</option>
                            <option>صيدلية النور</option>
                        </select>
                        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                            <option>نهاري</option>
                            <option>ليلي</option>
                        </select>
                        <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
                            إضافة
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleManagement;
