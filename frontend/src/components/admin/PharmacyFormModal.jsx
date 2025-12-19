import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const PharmacyFormModal = ({ isOpen, onClose, pharmacy = null, onSuccess }) => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [neighborhoods, setNeighborhoods] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        owner_name: '',
        phone: '',
        phone_secondary: '',
        address: '',
        neighborhood_id: '',
        notes: '',
        is_active: true,
        latitude: '',
        longitude: ''
    });

    useEffect(() => {
        // Fetch neighborhoods when modal opens
        if (isOpen) {
            axios.get('/api/v1/neighborhoods')
                .then(res => setNeighborhoods(res.data.data || res.data))
                .catch(err => console.error(err));
        }

        // Populate form if editing
        if (pharmacy) {
            setFormData({
                name: pharmacy.name || '',
                owner_name: pharmacy.owner_name || '',
                phone: pharmacy.phone || '',
                phone_secondary: pharmacy.phone_secondary || '',
                address: pharmacy.address || '',
                neighborhood_id: pharmacy.neighborhood_id || '',
                notes: pharmacy.notes || '',
                is_active: pharmacy.is_active ?? true,
                latitude: pharmacy.latitude || '',
                longitude: pharmacy.longitude || ''
            });
        } else {
            // Reset form for create
            setFormData({
                name: '',
                owner_name: '',
                phone: '',
                phone_secondary: '',
                address: '',
                neighborhood_id: '',
                notes: '',
                is_active: true,
                latitude: '',
                longitude: ''
            });
        }
    }, [isOpen, pharmacy]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (pharmacy) {
                // Update
                await axios.put(`/api/v1/admin/pharmacies/${pharmacy.id}`, formData);
                alert('تم تعديل الصيدلية بنجاح');
            } else {
                // Create
                await axios.post('/api/v1/admin/pharmacies', formData);
                alert('تم إضافة الصيدلية بنجاح');
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert('حدث خطأ أثناء الحفظ. تأكد من صحة البيانات.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
                    <h2 className="text-xl font-bold text-gray-900">
                        {pharmacy ? 'تعديل بيانات الصيدلية' : 'إضافة صيدلية جديدة'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 font-bold text-xl">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">اسم الصيدلية</label>
                            <input
                                required
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">اسم المالك</label>
                            <input
                                required
                                name="owner_name"
                                value={formData.owner_name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">رقم الهاتف</label>
                            <input
                                required
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">الحي</label>
                            <select
                                required
                                name="neighborhood_id"
                                value={formData.neighborhood_id}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">اختر الحي...</option>
                                {neighborhoods.map(n => (
                                    <option key={n.id} value={n.id}>{n.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">العنوان بالتفصيل</label>
                        <textarea
                            required
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows="2"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">خط العرض (Latitude)</label>
                            <input
                                type="number"
                                step="any"
                                name="latitude"
                                value={formData.latitude}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">خط الطول (Longitude)</label>
                            <input
                                type="number"
                                step="any"
                                name="longitude"
                                value={formData.longitude}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleChange}
                            id="is_active"
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="is_active" className="text-sm font-semibold text-gray-700">تفعيل الصيدلية (تظهر في الموقع)</label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'جاري الحفظ...' : 'حفظ البيانات'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PharmacyFormModal;
