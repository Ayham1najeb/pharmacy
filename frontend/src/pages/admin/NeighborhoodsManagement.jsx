import React, { useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';

const NeighborhoodsManagement = () => {
    const [neighborhoods] = useState([
        { id: 1, name: 'الحي الشرقي', pharmacies: 12, active: true },
        { id: 2, name: 'الحي الغربي', pharmacies: 8, active: true },
        { id: 3, name: 'الحي الشمالي', pharmacies: 10, active: true },
        { id: 4, name: 'الحي الجنوبي', pharmacies: 6, active: true },
        { id: 5, name: 'المركز', pharmacies: 15, active: true },
        { id: 6, name: 'الأطراف', pharmacies: 4, active: false },
    ]);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 mr-80 p-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">إدارة الأحياء</h1>
                    <p className="text-gray-600">عرض وإدارة أحياء المدينة</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-l-4 border-blue-500">
                        <h3 className="text-sm font-semibold text-gray-600 mb-2">إجمالي الأحياء</h3>
                        <p className="text-4xl font-black text-gray-900">{neighborhoods.length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-l-4 border-green-500">
                        <h3 className="text-sm font-semibold text-gray-600 mb-2">الأحياء النشطة</h3>
                        <p className="text-4xl font-black text-gray-900">{neighborhoods.filter(n => n.active).length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-l-4 border-purple-500">
                        <h3 className="text-sm font-semibold text-gray-600 mb-2">إجمالي الصيدليات</h3>
                        <p className="text-4xl font-black text-gray-900">{neighborhoods.reduce((sum, n) => sum + n.pharmacies, 0)}</p>
                    </div>
                </div>

                {/* Neighborhoods Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {neighborhoods.map((neighborhood) => (
                        <div key={neighborhood.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border-t-4 border-blue-500">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900">{neighborhood.name}</h3>
                                {neighborhood.active ? (
                                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                                        نشط
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full">
                                        غير نشط
                                    </span>
                                )}
                            </div>
                            <div className="mb-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <span className="text-2xl">💊</span>
                                    <span className="font-semibold">{neighborhood.pharmacies} صيدلية</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors">
                                    تعديل
                                </button>
                                <button className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold text-sm transition-colors">
                                    عرض
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add New Neighborhood */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-6 border-2 border-green-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">إضافة حي جديد</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="اسم الحي"
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                        <input
                            type="text"
                            placeholder="الوصف (اختياري)"
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                        <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
                            إضافة
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NeighborhoodsManagement;
