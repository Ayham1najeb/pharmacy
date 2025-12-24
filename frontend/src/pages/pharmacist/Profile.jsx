import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [pharmacy, setPharmacy] = useState({
        name: '',
        owner_name: '',
        phone: '',
        address: '',
    });
    const [passwords, setPasswords] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savingPharmacy, setSavingPharmacy] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchProfile();
        fetchPharmacy();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get('/api/v1/pharmacist/profile');
            const userData = res.data.user;
            setProfile({
                name: userData.name || '',
                email: userData.email || '',
                phone: userData.phone || '',
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPharmacy = async () => {
        try {
            const res = await axios.get('/api/v1/pharmacist/pharmacy');
            if (res.data.success && res.data.data) {
                const pharmacyData = res.data.data;
                setPharmacy({
                    name: pharmacyData.name || '',
                    owner_name: pharmacyData.owner_name || '',
                    phone: pharmacyData.phone || '',
                    address: pharmacyData.address || '',
                });
            }
        } catch (error) {
            console.error('Error fetching pharmacy:', error);
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await axios.put('/api/v1/pharmacist/profile', profile);
            setMessage({ type: 'success', text: res.data.message });
            setUser({ ...user, name: profile.name, email: profile.email });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'فشل تحديث البيانات' });
        } finally {
            setSaving(false);
        }
    };

    const handlePharmacySubmit = async (e) => {
        e.preventDefault();
        setSavingPharmacy(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await axios.put('/api/v1/pharmacist/pharmacy', pharmacy);
            setMessage({ type: 'success', text: res.data.message || 'تم تحديث بيانات الصيدلية بنجاح' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'فشل تحديث بيانات الصيدلية' });
        } finally {
            setSavingPharmacy(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await axios.put('/api/v1/pharmacist/password', passwords);
            setMessage({ type: 'success', text: res.data.message });
            setPasswords({
                current_password: '',
                new_password: '',
                new_password_confirmation: '',
            });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'فشل تغيير كلمة المرور' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 py-10">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-800">الملف الشخصي</h1>
                        <p className="text-slate-500 mt-1 text-lg">إدارة بيانات حسابك وصيدليتك</p>
                    </div>
                    <Link
                        to="/pharmacist/dashboard"
                        className="px-5 py-2.5 bg-white text-slate-600 hover:text-slate-900 text-sm font-medium rounded-lg border border-slate-200 hover:border-slate-300 transition-all shadow-sm"
                    >
                        ← لوحة التحكم
                    </Link>
                </div>

                {/* Messages */}
                {message.text && (
                    <div className={`mb-8 p-4 rounded-lg flex items-center gap-3 text-sm font-medium animate-fade-in-down ${message.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                        : 'bg-red-50 text-red-800 border border-red-100'
                        }`}>
                        <span className="text-lg">{message.type === 'success' ? '✅' : '⚠️'}</span>
                        {message.text}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Pharmacy Info Form */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                            <h2 className="text-lg font-semibold text-slate-800 mb-6 pb-4 border-b border-slate-100 flex items-center gap-2">
                                💊 بيانات الصيدلية
                            </h2>
                            <form onSubmit={handlePharmacySubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">اسم الصيدلية</label>
                                        <input
                                            type="text"
                                            value={pharmacy.name}
                                            onChange={(e) => setPharmacy({ ...pharmacy, name: e.target.value })}
                                            required
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                            placeholder="صيدلية..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">اسم المالك</label>
                                        <input
                                            type="text"
                                            value={pharmacy.owner_name}
                                            onChange={(e) => setPharmacy({ ...pharmacy, owner_name: e.target.value })}
                                            required
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                            placeholder="د. ..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">رقم هاتف الصيدلية</label>
                                    <input
                                        type="tel"
                                        value={pharmacy.phone}
                                        onChange={(e) => setPharmacy({ ...pharmacy, phone: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                        placeholder="0933123456"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">العنوان</label>
                                    <textarea
                                        value={pharmacy.address}
                                        onChange={(e) => setPharmacy({ ...pharmacy, address: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                        placeholder="العنوان التفصيلي للصيدلية"
                                    />
                                </div>

                                <div className="pt-2 border-t border-slate-50 mt-4">
                                    <button
                                        type="submit"
                                        disabled={savingPharmacy}
                                        className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {savingPharmacy ? 'جاري الحفظ...' : 'حفظ بيانات الصيدلية'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Profile Info Form */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                            <h2 className="text-lg font-semibold text-slate-800 mb-6 pb-4 border-b border-slate-100">المعلومات الشخصية</h2>
                            <form onSubmit={handleProfileSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">الاسم الكامل</label>
                                        <input
                                            type="text"
                                            value={profile.name}
                                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                            required
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">البريد الإلكتروني</label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                            required
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">رقم الهاتف</label>
                                    <input
                                        type="tel"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        placeholder="0933123456"
                                    />
                                </div>

                                <div className="pt-2 border-t border-slate-50 mt-4">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Change Password Form */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                            <h2 className="text-lg font-semibold text-slate-800 mb-6 pb-4 border-b border-slate-100">الأمان وكلمة المرور</h2>
                            <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                <div className="max-w-md space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">كلمة المرور الحالية</label>
                                    <input
                                        type="password"
                                        value={passwords.current_password}
                                        onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
                                        required
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">كلمة المرور الجديدة</label>
                                        <input
                                            type="password"
                                            value={passwords.new_password}
                                            onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                                            required
                                            minLength={6}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">تأكيد كلمة المرور الجديدة</label>
                                        <input
                                            type="password"
                                            value={passwords.new_password_confirmation}
                                            onChange={(e) => setPasswords({ ...passwords, new_password_confirmation: e.target.value })}
                                            required
                                            minLength={6}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-slate-50 mt-4">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {saving ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;

