import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiService } from '../../services/api';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        pharmacy_name: '',
        owner_name: '',
        phone: '',
        address: '',
        neighborhood_id: '',
        latitude: '',
        longitude: '',
    });

    const [neighborhoods, setNeighborhoods] = useState([]);

    // Fetch neighborhoods on mount
    React.useEffect(() => {
        const fetchNeighborhoods = async () => {
            try {
                const response = await apiService.get('/api/v1/neighborhoods');
                // Handle both raw array (direct get) and wrapped data (paginated/resource)
                const data = Array.isArray(response) ? response : (response.data || []);
                setNeighborhoods(data);
            } catch (err) {
                console.error('Error fetching neighborhoods:', err);
            }
        };
        fetchNeighborhoods();
    }, []);

    // Validation Helpers
    const isValidSyrianPhone = (phone) => {
        const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
        const patterns = [
            /^09[3-9]\d{7}$/,
            /^\+9639[3-9]\d{7}$/,
            /^009639[3-9]\d{7}$/,
            /^9639[3-9]\d{7}$/,
        ];
        return patterns.some(pattern => pattern.test(cleanPhone));
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (errors[e.target.name] || errors.general) {
            setErrors({ ...errors, [e.target.name]: null, general: null });
        }
    };

    // Map Components
    const pharmacyIcon = new L.Icon({
        iconUrl: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
                <circle cx="12" cy="12" r="11" fill="#10b981" stroke="#fff" stroke-width="2"/>
                <path d="M16 11h-3V8h-2v3H8v2h3v3h2v-3h3z" fill="#fff"/>
            </svg>
        `),
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                setFormData({
                    ...formData,
                    latitude: e.latlng.lat,
                    longitude: e.latlng.lng,
                });
            },
        });

        return formData.latitude && formData.longitude ? (
            <Marker
                position={[formData.latitude, formData.longitude]}
                icon={pharmacyIcon}
            />
        ) : null;
    };

    // Validations
    const validateForm = () => {
        const newErrors = {};

        if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'كلمات المرور غير متطابقة';
        }

        if (formData.name.trim().length < 3) {
            newErrors.name = 'الاسم يجب أن يكون 3 أحرف على الأقل';
        }

        if (formData.pharmacy_name.trim().length < 3) {
            newErrors.pharmacy_name = 'اسم الصيدلية يجب أن يكون 3 أحرف على الأقل';
        }

        if (formData.owner_name.trim().length < 3) {
            newErrors.owner_name = 'اسم المالك يجب أن يكون 3 أحرف على الأقل';
        }

        if (formData.address.trim().length < 10) {
            newErrors.address = 'العنوان يجب أن يكون 10 أحرف على الأقل';
        }

        if (!isValidSyrianPhone(formData.phone)) {
            newErrors.phone = 'يرجى إدخال رقم هاتف سوري صالح (مثال: 0933123456)';
        }

        if (!formData.latitude || !formData.longitude) {
            newErrors.location = 'الرجاء تحديد موقع الصيدلية على الخريطة';
        }

        if (!formData.email) newErrors.email = 'البريد الإلكتروني مطلوب';
        if (!formData.password) newErrors.password = 'كلمة المرور مطلوبة';
        if (!formData.neighborhood_id) newErrors.neighborhood_id = 'الحي مطلوب';

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        try {
            const response = await apiService.post('/auth/register', formData);

            if (response.success) {
                const message = response.data?.auto_approved
                    ? 'تم إنشاء حسابك بنجاح! يمكنك تسجيل الدخول الآن.'
                    : 'تم تسجيل طلبك بنجاح! بانتظار موافقة الإدارة.';

                setSuccessMessage(message);
                setSuccess(true);
                setLoading(false);

                // Redirect after 2 seconds
                setTimeout(() => {
                    navigate('/login', {
                        state: { successMessage: message }
                    });
                }, 2000);
            }
        } catch (err) {
            if (err.response?.data?.errors) {
                // Map backend validation errors to form fields
                const backendErrors = err.response.data.errors;
                const mappedErrors = {};

                // Convert Laravel validation errors format to our format
                Object.keys(backendErrors).forEach(key => {
                    // Laravel returns arrays of error messages, take the first one
                    mappedErrors[key] = Array.isArray(backendErrors[key])
                        ? backendErrors[key][0]
                        : backendErrors[key];
                });

                setErrors(mappedErrors);
            } else {
                setErrors({ general: err.response?.data?.message || 'حدث خطأ أثناء التسجيل' });
            }
            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-full mb-4">
                        <span className="text-2xl">💊</span>
                        <span className="font-semibold">تسجيل صيدلية جديدة</span>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                        انضم إلى شبكة الصيدليات
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        سجل صيدليتك وابدأ بإدارة مناوباتك
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
                    {success ? (
                        <div className="text-center py-12">
                            <div className="mb-6">
                                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                                    تم التسجيل بنجاح! ✅
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    {successMessage}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-500">
                                    جاري تحويلك لصفحة تسجيل الدخول...
                                </p>
                            </div>
                            <div className="flex justify-center">
                                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {errors.general && (
                                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded">
                                    <p className="text-red-800 dark:text-red-200">{errors.general}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* User Information */}
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 pb-2 border-b-2 border-blue-500">
                                        معلومات الحساب
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                الاسم الكامل *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white`}
                                                placeholder="أدخل اسمك الكامل"
                                            />
                                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                البريد الإلكتروني *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white`}
                                                placeholder="example@email.com"
                                            />
                                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                كلمة المرور *
                                            </label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white`}
                                                placeholder="8 أحرف على الأقل"
                                            />
                                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                تأكيد كلمة المرور *
                                            </label>
                                            <input
                                                type="password"
                                                name="password_confirmation"
                                                value={formData.password_confirmation}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 border ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white`}
                                                placeholder="أعد إدخال كلمة المرور"
                                            />
                                            {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Pharmacy Information */}
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 pb-2 border-b-2 border-green-500">
                                        معلومات الصيدلية
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                اسم الصيدلية *
                                            </label>
                                            <input
                                                type="text"
                                                name="pharmacy_name"
                                                value={formData.pharmacy_name}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 border ${errors.pharmacy_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white`}
                                                placeholder="صيدلية..."
                                            />
                                            {errors.pharmacy_name && <p className="text-red-500 text-xs mt-1">{errors.pharmacy_name}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                اسم المالك *
                                            </label>
                                            <input
                                                type="text"
                                                name="owner_name"
                                                value={formData.owner_name}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 border ${errors.owner_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white`}
                                                placeholder="د. ..."
                                            />
                                            {errors.owner_name && <p className="text-red-500 text-xs mt-1">{errors.owner_name}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                رقم الهاتف *
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white`}
                                                placeholder="+963 ..."
                                            />
                                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                الحي *
                                            </label>
                                            <select
                                                name="neighborhood_id"
                                                value={formData.neighborhood_id}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 border ${errors.neighborhood_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white`}
                                            >
                                                <option value="">اختر الحي</option>
                                                {neighborhoods.map(neighborhood => (
                                                    <option key={neighborhood.id} value={neighborhood.id}>
                                                        {neighborhood.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.neighborhood_id && <p className="text-red-500 text-xs mt-1">{errors.neighborhood_id}</p>}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                العنوان *
                                            </label>
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                rows={3}
                                                className={`w-full px-4 py-3 border ${errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white`}
                                                placeholder="العنوان التفصيلي للصيدلية"
                                            />
                                            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                                        </div>
                                    </div>
                                </div>


                                {/* Location Picker */}
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 pb-2 border-b-2 border-yellow-500">
                                        موقع الصيدلية
                                    </h3>
                                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                            الرجاء تحديد موقع الصيدلية بدقة على الخريطة. هذا الموقع هو الذي سيظهر للجمهور.
                                        </p>
                                        <div className="h-[400px] rounded-lg overflow-hidden relative z-0">
                                            <MapContainer
                                                center={[35.6476, 36.6746]} // Maarrat al-Nu'man default center
                                                zoom={14}
                                                style={{ height: '100%', width: '100%' }}
                                            >
                                                <TileLayer
                                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                />
                                                <LocationMarker />
                                            </MapContainer>
                                        </div>
                                        {formData.latitude && (
                                            <div className="mt-2 text-xs text-green-600 dark:text-green-400 font-mono">
                                                تم تحديد الموقع: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                                            </div>
                                        )}
                                        {!formData.latitude && (
                                            <div className="mt-2 text-xs text-red-500 font-medium">
                                                * يجب تحديد الموقع على الخريطة
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex flex-col gap-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'جاري التسجيل...' : 'تسجيل الصيدلية'}
                                    </button>

                                    <p className="text-center text-gray-600 dark:text-gray-400">
                                        لديك حساب بالفعل؟{' '}
                                        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                                            تسجيل الدخول
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div >
        </div >
    );
};

export default Register;
