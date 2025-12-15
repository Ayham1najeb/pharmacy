import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await login(formData.email, formData.password);

            if (response.data.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/pharmacist/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'فشل تسجيل الدخول. تحقق من البيانات.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">
                        صيدليات معرة النعمان
                    </h1>
                    <p className="text-gray-500 text-sm">
                        سجل دخولك للمتابعة
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                        تسجيل الدخول
                    </h2>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-5 text-center text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-gray-600 text-sm font-medium mb-2">
                                البريد الإلكتروني
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-gray-700 placeholder-gray-400 transition-all text-sm"
                                placeholder="example@email.com"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-gray-600 text-sm font-medium mb-2">
                                كلمة المرور
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-gray-700 placeholder-gray-400 transition-all text-sm"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    جاري تسجيل الدخول...
                                </span>
                            ) : 'تسجيل الدخول'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-gray-100"></div>
                        <span className="text-gray-400 text-xs">أو</span>
                        <div className="flex-1 h-px bg-gray-100"></div>
                    </div>

                    {/* Register Link */}
                    <Link
                        to="/register"
                        className="block w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium rounded-xl transition-all duration-200 text-center text-sm"
                    >
                        تسجيل صيدلية جديدة
                    </Link>

                    {/* Demo Credentials */}
                    <div className="mt-5 p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-center text-gray-500">
                            <span className="font-semibold text-gray-600">للتجربة:</span>{' '}
                            admin@test.com / admin123
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <Link to="/" className="text-blue-600 hover:text-blue-700 transition-colors text-base font-semibold">
                        ← العودة للصفحة الرئيسية
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
