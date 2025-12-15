import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { pharmacyService } from '../../services/pharmacyService';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const PharmacyDetails = () => {
    const { id } = useParams();
    const [pharmacy, setPharmacy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPharmacy();
    }, [id]);

    const fetchPharmacy = async () => {
        try {
            setLoading(true);
            const data = await pharmacyService.getById(id);
            setPharmacy(data);
        } catch (err) {
            setError('حدث خطأ في تحميل تفاصيل الصيدلية');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCall = (phone) => {
        window.location.href = `tel:${phone}`;
    };

    const handleWhatsApp = (phone) => {
        const cleanPhone = phone.replace(/\D/g, '');
        window.open(`https://wa.me/${cleanPhone}`, '_blank');
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error || !pharmacy) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
                <div className="container mx-auto px-4">
                    <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-6 rounded-lg text-center">
                        <div className="text-4xl mb-4">⚠️</div>
                        <p className="text-lg">{error || 'الصيدلية غير موجودة'}</p>
                        <Link to="/pharmacies" className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline">
                            العودة لقائمة الصيدليات
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="container mx-auto px-4">
                {/* Back Button */}
                <Link
                    to="/pharmacies"
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-6"
                >
                    ← العودة للقائمة
                </Link>

                {/* Main Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-4xl font-bold mb-2">{pharmacy.name}</h1>
                                <p className="text-blue-100 text-lg">د. {pharmacy.owner_name}</p>
                            </div>
                            {pharmacy.is_active && (
                                <span className="px-4 py-2 bg-green-500 text-white rounded-full flex items-center gap-2 animate-pulse-slow">
                                    <span className="w-3 h-3 bg-white rounded-full"></span>
                                    فعال
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Info Section */}
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                                    معلومات الصيدلية
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                        <span className="text-3xl">📍</span>
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-white">العنوان</p>
                                            <p className="text-gray-600 dark:text-gray-300">{pharmacy.address}</p>
                                        </div>
                                    </div>

                                    {pharmacy.neighborhood && (
                                        <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                            <span className="text-3xl">🏘️</span>
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-white">الحي</p>
                                                <p className="text-gray-600 dark:text-gray-300">{pharmacy.neighborhood.name}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                        <span className="text-3xl">📞</span>
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-white">رقم الهاتف</p>
                                            <p className="text-gray-600 dark:text-gray-300 font-mono">{pharmacy.phone}</p>
                                            {pharmacy.phone_secondary && (
                                                <p className="text-gray-500 dark:text-gray-400 font-mono text-sm mt-1">
                                                    {pharmacy.phone_secondary}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {pharmacy.notes && (
                                        <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-xl">
                                            <span className="text-3xl">📝</span>
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-white">ملاحظات</p>
                                                <p className="text-gray-600 dark:text-gray-300">{pharmacy.notes}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions Section */}
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                                    التواصل
                                </h2>

                                <div className="space-y-4">
                                    <button
                                        onClick={() => handleCall(pharmacy.phone)}
                                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold text-lg transition-all duration-200 hover:scale-105 shadow-lg"
                                    >
                                        <span className="text-2xl">📞</span>
                                        اتصال مباشر
                                    </button>

                                    <button
                                        onClick={() => handleWhatsApp(pharmacy.phone)}
                                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold text-lg transition-all duration-200 hover:scale-105 shadow-lg"
                                    >
                                        <span className="text-2xl">💬</span>
                                        راسلنا على واتساب
                                    </button>
                                </div>

                                {/* Rating */}
                                {pharmacy.average_rating > 0 && (
                                    <div className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900 rounded-xl text-center">
                                        <div className="text-4xl mb-2">⭐</div>
                                        <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                                            {pharmacy.average_rating}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            من {pharmacy.reviews_count} تقييم
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PharmacyDetails;
