import React, { useState, useEffect } from 'react';
import { pharmacyService } from '../../services/pharmacyService';
import PharmacyCard from '../../components/shared/PharmacyCard';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const AllPharmacies = () => {
    const [pharmacies, setPharmacies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPharmacies();
    }, []);

    const fetchPharmacies = async () => {
        try {
            setLoading(true);
            const data = await pharmacyService.getAll();
            setPharmacies(data.data || data);
        } catch (err) {
            setError('حدث خطأ في تحميل الصيدليات');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-full mb-5 shadow-lg">
                        <span className="text-2xl">💊</span>
                        <span className="font-semibold">جميع الصيدليات</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                        دليل الصيدليات
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        <span className="font-bold text-2xl text-blue-600 dark:text-blue-400">{pharmacies.length}</span> صيدلية متوفرة في خدمتكم
                    </p>
                </div>

                {error && (
                    <div className="max-w-3xl mx-auto mb-8 p-5 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg shadow-md">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">⚠️</span>
                            <p className="text-red-800 dark:text-red-200 font-semibold text-lg">{error}</p>
                        </div>
                    </div>
                )}

                {pharmacies.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pharmacies.map(pharmacy => (
                            <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="inline-block p-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                            <div className="text-7xl mb-6">🏥</div>
                            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
                                لا توجد صيدليات متوفرة حالياً
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-lg">
                                يرجى المحاولة لاحقاً أو التواصل مع الإدارة
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllPharmacies;
