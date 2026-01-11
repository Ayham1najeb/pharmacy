import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { pharmacyService } from '../../services/pharmacyService';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

import SEO from '../../components/SEO';
import { Helmet } from 'react-helmet-async';

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

    const handleGoogleMaps = () => {
        if (pharmacy.latitude && pharmacy.longitude) {
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}`, '_blank');
        }
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

    // Structured Data JSON-LD
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Pharmacy",
        "name": pharmacy.name,
        "image": "https://maarrat-pharmacy.com/logo.png", // Replace with actual logo URL if available
        "telephone": pharmacy.phone,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": pharmacy.address,
            "addressLocality": "Maarrat al-Numan",
            "addressRegion": "Idlib",
            "addressCountry": "SY"
        },
        "geo": pharmacy.latitude && pharmacy.longitude ? {
            "@type": "GeoCoordinates",
            "latitude": pharmacy.latitude,
            "longitude": pharmacy.longitude
        } : undefined,
        "url": window.location.href,
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday"
                ],
                "opens": "00:00",
                "closes": "23:59"
            }
        ]
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <SEO
                title={pharmacy.name}
                description={`تفاصيل صيدلية ${pharmacy.name} - ${pharmacy.address} - رقم الهاتف: ${pharmacy.phone}`}
            />
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Helmet>

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
                    {/* Pharmacy Image - Fixed Zoom Issue */}
                    <div className="relative h-64 md:h-96 w-full overflow-hidden bg-slate-900">
                        {pharmacy.image_url ? (
                            <>
                                {/* Blurred Background for Fill */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center opacity-50 blur-xl scale-110"
                                    style={{ backgroundImage: `url(${pharmacy.image_url})` }}
                                ></div>
                                {/* Main Image - Contain to show full image */}
                                <img
                                    src={pharmacy.image_url}
                                    alt={pharmacy.name}
                                    className="relative w-full h-full object-contain z-10"
                                />
                            </>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700 dark:text-slate-600 bg-slate-100 dark:bg-slate-800">
                                <span className="text-8xl mb-4 opacity-50">🏥</span>
                                <span className="text-lg font-medium">لا توجد صورة متوفرة</span>
                            </div>
                        )}
                        {/* Status Badge */}
                        {pharmacy.is_active && (
                            <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-green-500/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/20">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                                </span>
                                <span className="text-white font-bold text-sm">مـنـاوب الآن</span>
                            </div>
                        )}
                    </div>

                    {/* Header */}
                    <div className="bg-white dark:bg-gray-800 p-6 md:p-8 border-b border-slate-100 dark:border-gray-700">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">{pharmacy.name}</h1>
                                <div className="flex items-center gap-3 text-slate-600 dark:text-gray-300">
                                    <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg text-sm font-bold">
                                        🩺 بإدارة: د. {pharmacy.owner_name}
                                    </span>
                                    {pharmacy.neighborhood && (
                                        <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-lg text-sm font-medium">
                                            📍 {pharmacy.neighborhood.name}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Rating */}
                            {pharmacy.average_rating > 0 && (
                                <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-xl border border-yellow-100 dark:border-yellow-900/50">
                                    <span className="text-2xl">⭐</span>
                                    <div>
                                        <div className="font-black text-xl text-yellow-600 dark:text-yellow-400 leading-none">
                                            {pharmacy.average_rating}
                                        </div>
                                        <div className="text-xs text-yellow-600/70 dark:text-yellow-400/70 font-medium">
                                            {pharmacy.reviews_count} تقييم
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-900/50">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Right Column: Info & Map */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Map Section */}
                                {pharmacy.latitude && pharmacy.longitude && (
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700 overflow-hidden">
                                        <div className="p-4 border-b border-slate-100 dark:border-gray-700 flex justify-between items-center">
                                            <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                                                <span>🗺️</span>
                                                الموقع على الخريطة
                                            </h3>
                                        </div>
                                        <div className="h-64 w-full bg-slate-100 relative">
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                frameBorder="0"
                                                scrolling="no"
                                                marginHeight="0"
                                                marginWidth="0"
                                                src={`https://maps.google.com/maps?q=${pharmacy.latitude},${pharmacy.longitude}&hl=ar&z=15&output=embed`}
                                                className="absolute inset-0"
                                                title="Pharmacy Location"
                                            ></iframe>
                                        </div>
                                    </div>
                                )}

                                {/* Info Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm">
                                        <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">العنوان التفصيلي</p>
                                        <p className="font-semibold text-slate-800 dark:text-white text-lg">{pharmacy.address}</p>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm">
                                        <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">رقم الهاتف</p>
                                        <div className="flex items-center justify-between">
                                            <p className="font-mono font-bold text-slate-800 dark:text-white text-xl" dir="ltr">{pharmacy.phone}</p>
                                            <button onClick={() => handleCall(pharmacy.phone)} className="text-blue-600 bg-blue-50 p-2 rounded-full hover:bg-blue-100">📞</button>
                                        </div>
                                    </div>
                                    {pharmacy.notes && (
                                        <div className="md:col-span-2 bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-800">
                                            <p className="text-sm text-blue-600 dark:text-blue-300 font-bold mb-1">ملاحظات إضافية</p>
                                            <p className="text-slate-700 dark:text-blue-100">{pharmacy.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Left Column: Actions */}
                            <div className="space-y-4">
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700 sticky top-24">
                                    <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-6">تواصل معنا</h3>

                                    <div className="space-y-3">
                                        <button
                                            onClick={() => handleCall(pharmacy.phone)}
                                            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-blue-500/25 active:scale-95"
                                        >
                                            <span>📞</span>
                                            اتصال هاتفي
                                        </button>

                                        <button
                                            onClick={() => handleWhatsApp(pharmacy.phone)}
                                            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-emerald-500/25 active:scale-95"
                                        >
                                            <span>💬</span>
                                            واتساب
                                        </button>
                                    </div>

                                    <p className="text-center text-xs text-slate-400 mt-6">
                                        متاح لخدمتكم، لا تتردد في الاتصال
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PharmacyDetails;
