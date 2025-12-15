import React from 'react';
import { Link } from 'react-router-dom';

const PharmacyCard = ({ pharmacy, showSchedule = false, date = null }) => {
    const handleWhatsApp = (phone) => {
        const cleanPhone = phone.replace(/\D/g, '');
        window.open(`https://wa.me/${cleanPhone}`, '_blank');
    };

    return (
        <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 px-8 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-1.5">
                            {pharmacy.name}
                        </h3>
                        <p className="text-blue-100 flex items-center gap-2">
                            <span className="text-lg">👨‍⚕️</span>
                            <span>د. {pharmacy.owner_name}</span>
                        </p>
                    </div>
                    {pharmacy.is_active && (
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-white font-semibold text-sm">فعال</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="px-8 py-6">
                <div className="space-y-4">
                    {/* Address */}
                    <div className="flex items-start gap-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <span className="text-xl">📍</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">العنوان</p>
                            <p className="text-gray-900 dark:text-gray-100 font-medium leading-relaxed">{pharmacy.address}</p>
                        </div>
                    </div>

                    {/* Neighborhood & Phone */}
                    <div className="grid grid-cols-2 gap-4">
                        {pharmacy.neighborhood && (
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                    <span className="text-xl">🏘️</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">الحي</p>
                                    <p className="text-gray-900 dark:text-gray-100 font-medium truncate">{pharmacy.neighborhood.name}</p>
                                </div>
                            </div>
                        )}

                        {date && (
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                                    <span className="text-xl">📅</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">تاريخ المناوبة</p>
                                    <p className="text-gray-900 dark:text-gray-100 font-bold text-base">
                                        {new Date(date).toLocaleDateString('ar-SY', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                <span className="text-xl">📞</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">الهاتف</p>
                                <p className="text-gray-900 dark:text-gray-100 font-mono font-bold text-base">{pharmacy.phone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Rating */}
                    {pharmacy.average_rating > 0 && (
                        <div className="flex items-center gap-3 pt-2">
                            <div className="flex-shrink-0 w-10 h-10 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                                <span className="text-xl">⭐</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">التقييم</p>
                                <p className="text-gray-900 dark:text-gray-100 font-semibold">
                                    {pharmacy.average_rating} <span className="text-sm text-gray-500">({pharmacy.reviews_count} تقييم)</span>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions - WhatsApp & Details Only */}
            <div className="px-8 pb-8 pt-2">
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => handleWhatsApp(pharmacy.phone)}
                        className="group/btn relative px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full font-bold text-base transition-all duration-500 shadow-lg hover:shadow-xl overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2.5">
                            <span className="text-xl">💬</span>
                            <span>واتساب</span>
                        </span>
                        <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity"></div>
                    </button>

                    <Link
                        to={`/pharmacy/${pharmacy.id}`}
                        className="group/btn relative px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-full font-bold text-base transition-all duration-500 shadow-lg hover:shadow-xl overflow-hidden flex items-center justify-center"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2.5">
                            <span className="text-xl">ℹ️</span>
                            <span>التفاصيل</span>
                        </span>
                        <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity"></div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PharmacyCard;
