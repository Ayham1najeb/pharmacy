import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/admin/Sidebar';
import CircularProgress from '../../components/admin/CircularProgress';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPharmacies: 0,
        approvedPharmacies: 0,
        pendingPharmacies: 0,
        totalNeighborhoods: 0,
        dailyVisitors: 0,
        monthlyVisitors: 0,
        totalVisitors: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRealData();
    }, []);

    const fetchRealData = async () => {
        try {
            setLoading(true);

            const [usersRes, pharmaciesRes, pendingRes, neighborhoodsRes, analyticsRes] = await Promise.all([
                axios.get('/api/v1/admin/users').catch(() => ({ data: { total: 0, data: [] } })),
                axios.get('/api/v1/admin/pharmacies').catch(() => ({ data: { total: 0, data: [] } })),
                axios.get('/api/v1/admin/pharmacies/pending').catch(() => ({ data: { data: [] } })),
                axios.get('/api/v1/neighborhoods').catch(() => ({ data: [] })),
                axios.get('/api/v1/analytics/stats').catch(() => ({ data: { daily: 0, monthly: 0, total: 0 } })),
            ]);

            const totalPharmacies = pharmaciesRes.data.total || pharmaciesRes.data.data?.length || 0;
            const pendingCount = pendingRes.data.data?.length || 0;
            const approvedCount = totalPharmacies - pendingCount;

            setStats({
                totalUsers: usersRes.data.total || usersRes.data.data?.length || 0,
                totalPharmacies: totalPharmacies,
                approvedPharmacies: approvedCount,
                pendingPharmacies: pendingCount,
                totalNeighborhoods: neighborhoodsRes.data.length || neighborhoodsRes.data.data?.length || 0,
                dailyVisitors: analyticsRes.data.daily || 0,
                monthlyVisitors: analyticsRes.data.monthly || 0,
                totalVisitors: analyticsRes.data.total || 0,
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, subtitle, gradient, borderColor }) => (
        <div className={`bg-gradient-to-br ${gradient} rounded-xl p-6 shadow-lg border-l-4 ${borderColor} transition-all hover:scale-105 duration-200`}>
            <h3 className="text-gray-700 text-sm font-semibold mb-1">{title}</h3>
            <p className="text-4xl font-black text-gray-900 mb-1">{loading ? '...' : value}</p>
            {subtitle && <p className="text-xs text-gray-600">{subtitle}</p>}
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <Sidebar />

            <div className="flex-1 mr-80 p-8">
                {/* Welcome Header */}
                <div className="mb-8">
                    <h1 className="text-5xl font-black text-gray-900 mb-2">
                        مرحباً، {user?.name}!
                    </h1>
                    <p className="text-xl text-gray-600">إليك نظرة عامة على أداء النظام</p>
                </div>

                {/* Visitors Statistics - Daily & Monthly */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-100 via-blue-50 to-cyan-50 rounded-xl p-8 shadow-xl border-2 border-blue-200">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-sm font-semibold text-blue-800 mb-1">الزوار اليوم</h3>
                                <p className="text-5xl font-black text-blue-900">{loading ? '...' : stats.dailyVisitors}</p>
                                <p className="text-sm text-blue-600 mt-2">زائر في آخر 24 ساعة</p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-blue-200">
                            <div className="flex justify-between text-sm">
                                <span className="text-blue-700 font-semibold">معدل الزيارات</span>
                                <span className="text-blue-900 font-bold">
                                    {loading || stats.dailyVisitors === 0 ? '0' : Math.max(1, Math.floor(stats.dailyVisitors / 24))} / ساعة
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-100 via-purple-50 to-pink-50 rounded-xl p-8 shadow-xl border-2 border-purple-200">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-sm font-semibold text-purple-800 mb-1">الزوار هذا الشهر</h3>
                                <p className="text-5xl font-black text-purple-900">{loading ? '...' : stats.monthlyVisitors}</p>
                                <p className="text-sm text-purple-600 mt-2">زائر في آخر 30 يوم</p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-purple-200">
                            <div className="flex justify-between text-sm">
                                <span className="text-purple-700 font-semibold">معدل يومي</span>
                                <span className="text-purple-900 font-bold">
                                    {loading || stats.monthlyVisitors === 0 ? '0' : Math.max(1, Math.floor(stats.monthlyVisitors / 30))} زائر
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="إجمالي المستخدمين"
                        value={stats.totalUsers}
                        subtitle="مستخدم مسجل"
                        gradient="from-blue-50 to-cyan-50"
                        borderColor="border-blue-400"
                    />
                    <StatCard
                        title="إجمالي الصيدليات"
                        value={stats.totalPharmacies}
                        subtitle="صيدلية في النظام"
                        gradient="from-green-50 to-emerald-50"
                        borderColor="border-green-400"
                    />
                    <StatCard
                        title="صيدليات معلقة"
                        value={stats.pendingPharmacies}
                        subtitle="تحتاج موافقة"
                        gradient="from-yellow-50 to-amber-50"
                        borderColor="border-yellow-400"
                    />
                    <StatCard
                        title="الأحياء"
                        value={stats.totalNeighborhoods}
                        subtitle="حي مغطى"
                        gradient="from-purple-50 to-pink-50"
                        borderColor="border-purple-400"
                    />
                </div>

                {/* Advanced Statistics with Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Pharmacies Distribution */}
                    <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-xl p-8 border border-blue-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">توزيع الصيدليات</h2>
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-6">
                                <CircularProgress
                                    percentage={stats.totalPharmacies > 0 ? (stats.approvedPharmacies / stats.totalPharmacies) * 100 : 0}
                                    color="#10b981"
                                    label="صيدليات موافق عليها"
                                    value={stats.approvedPharmacies}
                                />
                                <CircularProgress
                                    percentage={stats.totalPharmacies > 0 ? (stats.pendingPharmacies / stats.totalPharmacies) * 100 : 0}
                                    color="#f59e0b"
                                    label="صيدليات معلقة"
                                    value={stats.pendingPharmacies}
                                />
                            </div>
                        )}
                        <div className="mt-6 pt-6 border-t border-blue-200">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-gray-600">إجمالي الصيدليات</span>
                                <span className="text-2xl font-black text-gray-900">{stats.totalPharmacies}</span>
                            </div>
                        </div>
                    </div>

                    {/* System Overview */}
                    <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-xl p-8 border border-purple-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">نظرة عامة على النظام</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                                <div>
                                    <p className="text-sm font-semibold text-gray-700">المستخدمون المسجلون</p>
                                    <p className="text-3xl font-black text-blue-700">{stats.totalUsers}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                <div>
                                    <p className="text-sm font-semibold text-gray-700">الصيدليات النشطة</p>
                                    <p className="text-3xl font-black text-green-700">{stats.approvedPharmacies}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                                <div>
                                    <p className="text-sm font-semibold text-gray-700">إجمالي الزوار</p>
                                    <p className="text-3xl font-black text-purple-700">{stats.totalVisitors}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl p-8 mb-8 border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">إجراءات سريعة</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link
                            to="/admin/users"
                            className="group p-6 bg-gradient-to-br from-blue-100 to-cyan-100 hover:from-blue-200 hover:to-cyan-200 rounded-xl transition-all duration-200 border-2 border-blue-300 hover:scale-105 shadow-md"
                        >
                            <h3 className="font-bold text-gray-900 text-lg mb-2">إدارة المستخدمين</h3>
                            <p className="text-sm text-gray-700 mb-4">عرض وحذف المستخدمين</p>
                            <div className="text-right">
                                <span className="text-3xl font-black text-blue-700">{stats.totalUsers}</span>
                                <span className="text-sm text-gray-600 mr-2">مستخدم</span>
                            </div>
                        </Link>

                        <Link
                            to="/admin/pharmacies"
                            className="group p-6 bg-gradient-to-br from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 rounded-xl transition-all duration-200 border-2 border-green-300 hover:scale-105 shadow-md"
                        >
                            <h3 className="font-bold text-gray-900 text-lg mb-2">إدارة الصيدليات</h3>
                            <p className="text-sm text-gray-700 mb-4">الموافقة على الصيدليات</p>
                            <div className="text-right">
                                <span className="text-3xl font-black text-green-700">{stats.totalPharmacies}</span>
                                <span className="text-sm text-gray-600 mr-2">صيدلية</span>
                            </div>
                        </Link>

                        <Link
                            to="/admin/schedule"
                            className="group p-6 bg-gradient-to-br from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 rounded-xl transition-all duration-200 border-2 border-purple-300 hover:scale-105 shadow-md"
                        >
                            <h3 className="font-bold text-gray-900 text-lg mb-2">إدارة المناوبات</h3>
                            <p className="text-sm text-gray-700 mb-4">جدولة المناوبات</p>
                            <div className="text-right">
                                <span className="text-3xl font-black text-purple-700">--</span>
                                <span className="text-sm text-gray-600 mr-2">مناوبة</span>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Progress Bars */}
                <div className="bg-gradient-to-br from-white to-indigo-50 rounded-xl shadow-xl p-8 border border-indigo-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">إحصائيات التقدم</h2>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-700">نسبة الصيدليات الموافق عليها</span>
                                <span className="text-sm font-bold text-green-700">
                                    {stats.totalPharmacies > 0 ? Math.round((stats.approvedPharmacies / stats.totalPharmacies) * 100) : 0}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4">
                                <div
                                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-4 rounded-full transition-all duration-1000 shadow-md"
                                    style={{ width: `${stats.totalPharmacies > 0 ? (stats.approvedPharmacies / stats.totalPharmacies) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-700">نسبة التغطية (الأحياء)</span>
                                <span className="text-sm font-bold text-blue-700">
                                    {stats.totalNeighborhoods > 0 ? Math.round((stats.totalNeighborhoods / 6) * 100) : 0}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4">
                                <div
                                    className="bg-gradient-to-r from-blue-400 to-cyan-500 h-4 rounded-full transition-all duration-1000 shadow-md"
                                    style={{ width: `${stats.totalNeighborhoods > 0 ? (stats.totalNeighborhoods / 6) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-700">نسبة النمو الشهري</span>
                                <span className="text-sm font-bold text-purple-700">
                                    {stats.monthlyVisitors > 0 ? Math.round((stats.monthlyVisitors / 5000) * 100) : 0}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4">
                                <div
                                    className="bg-gradient-to-r from-purple-400 to-pink-500 h-4 rounded-full transition-all duration-1000 shadow-md"
                                    style={{ width: `${stats.monthlyVisitors > 0 ? Math.min((stats.monthlyVisitors / 5000) * 100, 100) : 0}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
