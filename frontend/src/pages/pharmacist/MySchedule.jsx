import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MySchedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        duty_date: '',
        shift_type: 'day',
        notes: '',
    });

    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const res = await axios.get('/api/v1/pharmacist/my-schedules');
            setSchedules(res.data.data || []);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            if (editingId) {
                await axios.put(`/api/v1/pharmacist/my-schedules/${editingId}`, formData);
                setMessage({ type: 'success', text: 'تم تحديث المناوبة بنجاح' });
            } else {
                await axios.post('/api/v1/pharmacist/my-schedules', formData);
                setMessage({ type: 'success', text: 'تم إضافة المناوبة بنجاح' });
            }

            fetchSchedules();
            resetForm();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'فشلت العملية' });
        }
    };

    const handleEdit = (schedule) => {
        setEditingId(schedule.id);
        setFormData({
            duty_date: schedule.duty_date,
            shift_type: schedule.shift_type,
            notes: schedule.notes || '',
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('هل أنت متأكد من حذف هذه المناوبة؟')) return;

        try {
            await axios.delete(`/api/v1/pharmacist/my-schedules/${id}`);
            setMessage({ type: 'success', text: 'تم حذف المناوبة بنجاح' });
            fetchSchedules();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'فشل الحذف' });
        }
    };

    const resetForm = () => {
        setFormData({ duty_date: '', shift_type: 'day', notes: '' });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 py-10">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-800">إدارة المناوبات</h1>
                        <p className="text-slate-500 mt-1 text-lg">جدولة مناوبات الصيدلية</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            to="/pharmacist/dashboard"
                            className="px-5 py-2.5 bg-white text-slate-600 hover:text-slate-900 text-sm font-medium rounded-lg border border-slate-200 hover:border-slate-300 transition-all shadow-sm"
                        >
                            ← لوحة التحكم
                        </Link>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className={`px-5 py-2.5 text-sm font-medium rounded-lg shadow-sm transition-all border ${showForm
                                ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                                : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700'
                                }`}
                        >
                            {showForm ? 'إلغاء' : '+ إضافة مناوبة'}
                        </button>
                    </div>
                </div>

                {/* Messages */}
                {message.text && (
                    <div className={`mb-8 p-4 rounded-lg flex items-center gap-3 text-sm font-medium ${message.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                        : 'bg-red-50 text-red-800 border border-red-100'
                        }`}>
                        <span className="text-lg">{message.type === 'success' ? '✅' : '⚠️'}</span>
                        {message.text}
                    </div>
                )}

                {/* Add/Edit Form */}
                {showForm && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8 animate-fade-in-down">
                        <h2 className="text-lg font-semibold text-slate-800 mb-6 pb-4 border-b border-slate-100">
                            {editingId ? 'تعديل المناوبة' : 'إضافة مناوبة جديدة'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">التاريخ</label>
                                    <input
                                        type="date"
                                        value={formData.duty_date}
                                        onChange={(e) => setFormData({ ...formData, duty_date: e.target.value })}
                                        required
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">نوع المناوبة</label>
                                    <select
                                        value={formData.shift_type}
                                        onChange={(e) => setFormData({ ...formData, shift_type: e.target.value })}
                                        required
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    >
                                        <option value="day">نهاري</option>
                                        <option value="night">ليلي</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">ملاحظات (اختياري)</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
                                    placeholder="أي ملاحظات إضافية..."
                                ></textarea>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow"
                                >
                                    {editingId ? 'حفظ التغييرات' : 'إضافة المناوبة'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-2.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 text-sm font-medium rounded-lg transition-all"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Schedules List */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h2 className="text-base font-semibold text-slate-800">سجل المناوبات</h2>
                        <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-full">{schedules.length} مناوبات</span>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-16">
                            <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                        </div>
                    ) : schedules.length === 0 ? (
                        <div className="text-center py-16 px-4">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">📅</span>
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 mb-1">لا توجد مناوبات</h3>
                            <p className="text-slate-500 text-sm mb-4">لم تقم بإضافة أي مناوبات للصيدلية بعد.</p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
                            >
                                + إضافة المناوبة الأولى
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-right">
                                <thead className="bg-slate-50/80 text-slate-500 font-medium border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-3">التاريخ</th>
                                        <th className="px-6 py-3">نوع المناوبة</th>
                                        <th className="px-6 py-3">ملاحظات</th>
                                        <th className="px-6 py-3 text-center">الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {schedules.map((schedule) => (
                                        <tr key={schedule.id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                {new Date(schedule.duty_date).toLocaleDateString('ar-SY', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${schedule.shift_type === 'full' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                    schedule.shift_type === 'day' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                        'bg-indigo-50 text-indigo-700 border-indigo-100'
                                                    }`}>
                                                    {schedule.shift_type === 'full' && 'كامل (24 ساعة)'}
                                                    {schedule.shift_type === 'day' && 'نهاري'}
                                                    {schedule.shift_type === 'night' && 'ليلي'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 max-w-xs truncate">
                                                {schedule.notes || <span className="text-slate-300">-</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleEdit(schedule)}
                                                        className="p-1 text-slate-400 hover:text-blue-600 transition-colors rounded hover:bg-blue-50"
                                                        title="تعديل"
                                                    >
                                                        ✎
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(schedule.id)}
                                                        className="p-1 text-slate-400 hover:text-red-500 transition-colors rounded hover:bg-red-50"
                                                        title="حذف"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MySchedule;
