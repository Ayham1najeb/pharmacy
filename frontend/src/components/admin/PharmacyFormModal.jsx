import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../../context/AuthContext';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const PharmacyFormModal = ({ isOpen, onClose, pharmacy = null, onSuccess }) => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isGeocoding, setIsGeocoding] = useState(false);
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

    // Geocoding function - Convert address to coordinates
    const handleGeocodeAddress = async () => {
        if (!formData.address || formData.address.trim() === '') {
            alert('⚠️ يرجى كتابة العنوان أولاً');
            return;
        }

        setIsGeocoding(true);
        try {
            // Using Nominatim (OpenStreetMap) geocoding API
            const searchQuery = `${formData.address}, معرة النعمان, سوريا`;
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
                {
                    headers: {
                        'Accept-Language': 'ar'
                    }
                }
            );

            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                setFormData(prev => ({
                    ...prev,
                    latitude: parseFloat(lat),
                    longitude: parseFloat(lon)
                }));
                alert('✅ تم العثور على الموقع بنجاح!');
            } else {
                alert('⚠️ لم يتم العثور على الموقع. يرجى تحديده يدوياً على الخريطة.');
                // Set default coordinates if not found
                setFormData(prev => ({
                    ...prev,
                    latitude: 35.6476,
                    longitude: 36.6746
                }));
            }
        } catch (error) {
            console.error('Geocoding error:', error);
            alert('❌ حدث خطأ أثناء البحث عن الموقع. يرجى تحديده يدوياً على الخريطة.');
            // Set default coordinates on error
            setFormData(prev => ({
                ...prev,
                latitude: 35.6476,
                longitude: 36.6746
            }));
        } finally {
            setIsGeocoding(false);
        }
    };


    // Map location picker component
    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                setFormData(prev => ({
                    ...prev,
                    latitude: e.latlng.lat,
                    longitude: e.latlng.lng
                }));
            },
        });

        return formData.latitude && formData.longitude ? (
            <Marker
                position={[formData.latitude, formData.longitude]}
            />
        ) : null;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate location is set
        if (!formData.latitude || !formData.longitude) {
            alert('⚠️ يرجى تحديد موقع الصيدلية على الخريطة أولاً');
            return;
        }

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
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
                    <h2 className="text-xl font-bold text-gray-900">
                        {pharmacy ? 'تعديل بيانات الصيدلية' : 'إضافة صيدلية جديدة'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 font-bold text-xl">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Map Location Picker */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <label className="block text-sm font-bold text-gray-800 mb-3">
                            📍 حدد موقع الصيدلية على الخريطة (مطلوب)
                        </label>
                        <div className="relative rounded-lg overflow-hidden border border-gray-300 h-[350px]">
                            <MapContainer
                                center={[
                                    formData.latitude || 35.6476,
                                    formData.longitude || 36.6746
                                ]}
                                zoom={15}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                />
                                <LocationMarker />
                            </MapContainer>
                        </div>
                        <div className="mt-3 text-sm">
                            {formData.latitude && formData.longitude ? (
                                <p className="text-green-700 font-medium bg-green-100 px-3 py-2 rounded-lg">
                                    ✅ تم تحديد الموقع: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                                </p>
                            ) : (
                                <p className="text-amber-700 font-medium bg-amber-100 px-3 py-2 rounded-lg">
                                    ⚠️ انقر على الخريطة لتحديد موقع الصيدلية
                                </p>
                            )}
                        </div>
                    </div>
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
                        <div className="flex gap-2">
                            <textarea
                                required
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="2"
                                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="مثال: شارع الجامع الكبير، بالقرب من السوق القديم"
                            />
                            <button
                                type="button"
                                onClick={handleGeocodeAddress}
                                disabled={isGeocoding || !formData.address}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                                title="تحويل العنوان إلى موقع على الخريطة"
                            >
                                {isGeocoding ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        جاري البحث...
                                    </>
                                ) : (
                                    <>
                                        🔍
                                        ابحث عن الموقع
                                    </>
                                )}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            💡 اكتب العنوان بالتفصيل ثم اضغط "ابحث عن الموقع" لتحديد الموقع تلقائياً، أو حدده يدوياً على الخريطة
                        </p>
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
