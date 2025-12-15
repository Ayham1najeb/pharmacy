import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/admin/Sidebar';

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [deleteModal, setDeleteModal] = useState({ show: false, user: null });

    useEffect(() => {
        fetchUsers();
    }, [searchTerm, roleFilter]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = {};
            if (searchTerm) params.search = searchTerm;
            if (roleFilter !== 'all') params.role = roleFilter;

            const response = await axios.get('/api/v1/admin/users', { params });
            setUsers(response.data.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`/api/v1/admin/users/${userId}`);
            setUsers(users.filter(user => user.id !== userId));
            setDeleteModal({ show: false, user: null });
            // Show success toast (you can add toast notification library)
            alert('تم حذف المستخدم بنجاح');
        } catch (error) {
            console.error('Error deleting user:', error);
            alert(error.response?.data?.message || 'حدث خطأ أثناء حذف المستخدم');
        }
    };

    const getRoleBadge = (role) => {
        const styles = {
            admin: 'bg-purple-100 text-purple-800 border-purple-300',
            pharmacist: 'bg-green-100 text-green-800 border-green-300'
        };
        const labels = {
            admin: 'مدير',
            pharmacist: 'صيدلاني'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${styles[role]}`}>
                {labels[role]}
            </span>
        );
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 mr-80 p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">إدارة المستخدمين</h1>
                    <p className="text-gray-600">عرض وإدارة جميع مستخدمي النظام</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">بحث</label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="ابحث بالاسم أو البريد الإلكتروني..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Role Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">الدور الوظيفي</label>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">الكل</option>
                                <option value="admin">مدير</option>
                                <option value="pharmacist">صيدلاني</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-16">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <p className="mt-4 text-gray-500 text-lg">لا يوجد مستخدمين</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">الاسم</th>
                                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">البريد الإلكتروني</th>
                                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">الدور</th>
                                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">تاريخ الإنشاء</th>
                                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <span className="text-blue-600 font-bold text-lg">
                                                        {user.name.charAt(0)}
                                                    </span>
                                                </div>
                                                <span className="font-semibold text-gray-900">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(user.created_at).toLocaleDateString('ar-SY')}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => setDeleteModal({ show: true, user })}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold"
                                            >
                                                حذف
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Delete Confirmation Modal */}
                {deleteModal.show && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">تأكيد الحذف</h3>
                            <p className="text-gray-600 mb-6">
                                هل أنت متأكد من حذف المستخدم <strong>{deleteModal.user?.name}</strong>؟
                                <br />
                                سيتم حذف جميع البيانات المرتبطة به نهائياً.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setDeleteModal({ show: false, user: null })}
                                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteModal.user.id)}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                                >
                                    حذف
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsersManagement;
