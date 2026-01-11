import React from 'react';
import { Link } from 'react-router-dom';

const PharmacyCard = ({ pharmacy, showSchedule = false, date = null }) => {
    const handleWhatsApp = (phone) => {
        const cleanPhone = phone.replace(/\D/g, '');
        window.open(`https://wa.me/${cleanPhone}`, '_blank');
    };

    return (
        <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Pharmacy Image with Info Overlay */}
            <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-700 dark:to-gray-800">
                {pharmacy.image_url ? (
                    <img
                        src={pharmacy.image_url}
                        alt={pharmacy.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : null}
                <div
                    className={`absolute inset-0 flex flex-col items-center justify-center text-blue-500 dark:text-blue-400 ${pharmacy.image_url ? 'hidden' : 'flex'}`}
                    style={{ display: pharmacy.image_url ? 'none' : 'flex' }}
                >
                    <span className="text-6xl mb-2">🏪</span>
                    <span className="text-sm font-medium text-blue-600/70 dark:text-blue-400/70">صيدلية</span>
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                {/* Pharmacy Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-xl font-bold mb-1 drop-shadow-lg">
                        {pharmacy.name}
                    </h3>
                    <p className="text-white/90 flex items-center gap-1.5 text-sm drop-shadow">
                        <span>👨‍⚕️</span>
                        <span>د. {pharmacy.owner_name}</span>
                    </p>
                </div>

                {/* Status Badge */}
                {pharmacy.is_active && (
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-green-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span className="text-white font-semibold text-xs">مفتوح</span>
                    </div>
                )}
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
