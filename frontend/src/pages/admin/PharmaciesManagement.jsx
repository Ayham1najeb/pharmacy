import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/admin/Sidebar';
import PharmacyFormModal from '../../components/admin/PharmacyFormModal';

const PharmaciesManagement = () => {
    const [pharmacies, setPharmacies] = useState([]);
    const [filter, setFilter] = useState('all'); // all, pending, approved
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPharmacy, setEditingPharmacy] = useState(null);

    useEffect(() => {
        fetchPharmacies();
    }, [filter]);

    const fetchPharmacies = async () => {
        try {
            setLoading(true);
            const endpoint = filter === 'pending'
                ? '/api/v1/admin/pharmacies/pending'
                : '/api/v1/admin/pharmacies';

            const response = await axios.get(endpoint);
            let data = response.data.data || [];

            if (filter === 'approved') {
                data = data.filter(p => p.is_approved);
            }

            setPharmacies(data);
        } catch (error) {
            console.error('Error fetching pharmacies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (!confirm('هل أنت متأكد من الموافقة على هذه الصيدلية؟')) return;

        try {
            await axios.patch(`/api/v1/admin/pharmacies/${id}/approve`);
            alert('تمت الموافقة بنجاح');
            fetchPharmacies();
        } catch (error) {
            alert('حدث خطأ أثناء الموافقة');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('هل أنت متأكد من حذف هذه الصيدلية؟ سيتم إزالتها نهائياً من النظام.')) return;

        try {
            await axios.delete(`/api/v1/admin/pharmacies/${id}`);
            alert('تم الحذف بنجاح');
            fetchPharmacies();
        } catch (error) {
            alert('حدث خطأ أثناء الحذف');
        }
    };

    // Kept for backward compatibility if needed, but redirects to delete
    const handleReject = (id) => handleDelete(id);

    const openAddModal = () => {
        setEditingPharmacy(null);
        setIsModalOpen(true);
    };

    const openEditModal = (pharmacy) => {
        setEditingPharmacy(pharmacy);
        setIsModalOpen(true);
    };

    const filteredPharmacies = pharmacies.filter(pharmacy =>
        pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pharmacy.owner_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 lg:mr-80 p-4 lg:p-8">
                {/* Header */}
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">إدارة الصيدليات</h1>
                        <p className="text-gray-600">عرض وإدارة جميع الصيدليات والموافقة على الطلبات</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                    >
                        <span className="text-xl">+</span>
                        إضافة صيدلية
                    </button>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">بحث</label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="ابحث بالاسم أو المالك..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filter Tabs */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">التصنيف</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    الكل
                                </button>
                                <button
                                    onClick={() => setFilter('pending')}
                                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    قيد الانتظار
                                </button>
                                <button
                                    onClick={() => setFilter('approved')}
                                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${filter === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    موافق عليها
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pharmacies Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : filteredPharmacies.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <div className="text-6xl mb-4">💊</div>
                        <p className="text-xl text-gray-600">لا توجد صيدليات</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPharmacies.map((pharmacy) => (
                            <div key={pharmacy.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border-t-4 border-blue-500 flex flex-col justify-between">
                                {/* Pharmacy Image */}
                                {pharmacy.image_url && (
                                    <div className="w-full h-48 overflow-hidden bg-gray-100">
                                        <img
                                            src={pharmacy.image_url}
                                            alt={pharmacy.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">{pharmacy.name}</h3>
                                            <p className="text-sm text-gray-600">{pharmacy.owner_name}</p>
                                        </div>
                                        {!pharmacy.is_approved && (
                                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                                                قيد الانتظار
                                            </span>
                                        )}
                                        {pharmacy.is_approved && (
                                            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                                                موافق عليها
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-gray-500">📞</span>
                                            <span className="text-gray-700">{pharmacy.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-gray-500">📍</span>
                                            <span className="text-gray-700 truncate" title={pharmacy.address}>{pharmacy.address}</span>
                                        </div>
                                        {pharmacy.neighborhood && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-gray-500">🏘️</span>
                                                <span className="text-gray-700">{pharmacy.neighborhood.name}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2 mt-4 pt-4 border-t border-gray-100">
                                    {!pharmacy.is_approved ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleApprove(pharmacy.id)}
                                                className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors text-sm"
                                            >
                                                ✓ موافقة
                                            </button>
                                            <button
                                                onClick={() => handleReject(pharmacy.id)}
                                                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors text-sm"
                                            >
                                                ✕ رفض
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEditModal(pharmacy)}
                                                className="flex-1 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-semibold transition-colors text-sm border border-blue-200"
                                            >
                                                ✏️ تعديل
                                            </button>
                                            <button
                                                onClick={() => handleDelete(pharmacy.id)}
                                                className="flex-1 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-semibold transition-colors text-sm border border-red-200"
                                            >
                                                🗑️ حذف
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* CRUD Modal */}
            <PharmacyFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                pharmacy={editingPharmacy}
                onSuccess={() => {
                    fetchPharmacies();
                }}
            />
        </div >
    );
};

export default PharmaciesManagement;
