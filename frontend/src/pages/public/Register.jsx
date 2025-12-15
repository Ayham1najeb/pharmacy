import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        // User data
        name: '',
        email: '',
        password: '',
        password_confirmation: '',

        // Pharmacy data
        pharmacy_name: '',
        owner_name: '',
        phone: '',
        address: '',
        neighborhood_id: '',
    });

    const [neighborhoods, setNeighborhoods] = useState([]);

    // Fetch neighborhoods on mount
    React.useEffect(() => {
        const fetchNeighborhoods = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/v1/neighborhoods');
                setNeighborhoods(response.data);
            } catch (err) {
                console.error('Error fetching neighborhoods:', err);
            }
        };
        fetchNeighborhoods();
    }, []);

    // التحقق من رقم الهاتف السوري
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
        // مسح رسالة الخطأ عند الكتابة
        if (error) setError('');
    };

    const [autoApproved, setAutoApproved] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // التحقق من كلمة المرور
        if (formData.password !== formData.password_confirmation) {
            setError('كلمات المرور غير متطابقة');
            setLoading(false);
            return;
        }

        // التحقق من طول الحقول
        if (formData.name.trim().length < 3) {
            setError('الاسم يجب أن يكون 3 أحرف على الأقل');
            setLoading(false);
            return;
        }

        if (formData.pharmacy_name.trim().length < 3) {
            setError('اسم الصيدلية يجب أن يكون 3 أحرف على الأقل');
            setLoading(false);
            return;
        }

        if (formData.address.trim().length < 10) {
            setError('العنوان يجب أن يكون 10 أحرف على الأقل');
            setLoading(false);
            return;
        }

        // التحقق من رقم الهاتف السوري
        if (!isValidSyrianPhone(formData.phone)) {
            setError('يرجى إدخال رقم هاتف سوري صالح (مثال: 0933123456)');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/v1/auth/register', formData);

            if (response.data.success) {
                setAutoApproved(response.data.data?.auto_approved || false);
                setSuccess(true);
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        } catch (err) {
            // عرض رسائل الخطأ بشكل أفضل
            if (err.response?.data?.errors) {
                const errors = err.response.data.errors;
                const firstError = Object.values(errors)[0];
                setError(Array.isArray(firstError) ? firstError[0] : firstError);
            } else {
                setError(err.response?.data?.message || 'حدث خطأ أثناء التسجيل');
            }
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="text-6xl mb-4">{autoApproved ? '🎉' : '✅'}</div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                        تم التسجيل بنجاح!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {autoApproved
                            ? 'تم تفعيل حسابك تلقائياً! يمكنك تسجيل الدخول الآن وإدارة مناوباتك.'
                            : 'تم إرسال طلبك للإدارة للمراجعة. سيتم إعلامك عند الموافقة على حسابك.'
                        }
                    </p>
                    <p className="text-sm text-gray-500">
                        جاري التحويل لصفحة تسجيل الدخول...
                    </p>
                </div>
            </div>
        );
    }

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
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded">
                            <p className="text-red-800 dark:text-red-200">{error}</p>
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
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="أدخل اسمك الكامل"
                                    />
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
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="example@email.com"
                                    />
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
                                        required
                                        minLength={8}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="8 أحرف على الأقل"
                                    />
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
                                        required
                                        minLength={8}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="أعد إدخال كلمة المرور"
                                    />
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
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="صيدلية..."
                                    />
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
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="د. ..."
                                    />
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
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="+963 ..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        الحي *
                                    </label>
                                    <select
                                        name="neighborhood_id"
                                        value={formData.neighborhood_id}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">اختر الحي</option>
                                        {neighborhoods.map(neighborhood => (
                                            <option key={neighborhood.id} value={neighborhood.id}>
                                                {neighborhood.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        العنوان *
                                    </label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="العنوان التفصيلي للصيدلية"
                                    />
                                </div>
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
                </div>
            </div>
        </div>
    );
};

export default Register;
