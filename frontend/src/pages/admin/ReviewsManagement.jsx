import React, { useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';

const ReviewsManagement = () => {
    const [reviews] = useState([
        { id: 1, pharmacy: 'صيدلية الشفاء', user: 'محمد أحمد', rating: 5, comment: 'خدمة ممتازة وموظفين لطفاء', approved: true, date: '2025-12-10' },
        { id: 2, pharmacy: 'صيدلية النور', user: 'فاطمة علي', rating: 4, comment: 'جيدة لكن الأسعار مرتفعة', approved: false, date: '2025-12-11' },
        { id: 3, pharmacy: 'صيدلية الأمل', user: 'أحمد خالد', rating: 5, comment: 'أفضل صيدلية في المنطقة', approved: true, date: '2025-12-09' },
        { id: 4, pharmacy: 'صيدلية السلام', user: 'سارة محمود', rating: 3, comment: 'خدمة عادية', approved: false, date: '2025-12-11' },
    ]);

    const [filter, setFilter] = useState('all');

    const filteredReviews = reviews.filter(review => {
        if (filter === 'pending') return !review.approved;
        if (filter === 'approved') return review.approved;
        return true;
    });

    const renderStars = (rating) => {
        return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 mr-80 p-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">إدارة التقييمات</h1>
                    <p className="text-gray-600">مراجعة والموافقة على تقييمات المستخدمين</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
                        <h3 className="text-sm font-semibold text-gray-600 mb-2">إجمالي التقييمات</h3>
                        <p className="text-3xl font-black text-gray-900">{reviews.length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-green-500">
                        <h3 className="text-sm font-semibold text-gray-600 mb-2">موافق عليها</h3>
                        <p className="text-3xl font-black text-gray-900">{reviews.filter(r => r.approved).length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-yellow-500">
                        <h3 className="text-sm font-semibold text-gray-600 mb-2">قيد المراجعة</h3>
                        <p className="text-3xl font-black text-gray-900">{reviews.filter(r => !r.approved).length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-purple-500">
                        <h3 className="text-sm font-semibold text-gray-600 mb-2">متوسط التقييم</h3>
                        <p className="text-3xl font-black text-gray-900">
                            {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            الكل ({reviews.length})
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            قيد المراجعة ({reviews.filter(r => !r.approved).length})
                        </button>
                        <button
                            onClick={() => setFilter('approved')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filter === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            موافق عليها ({reviews.filter(r => r.approved).length})
                        </button>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                    {filteredReviews.map((review) => (
                        <div key={review.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-gray-900">{review.pharmacy}</h3>
                                        {review.approved ? (
                                            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                                                موافق عليه
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                                                قيد المراجعة
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600">بواسطة: {review.user}</p>
                                    <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString('ar-SY')}</p>
                                </div>
                                <div className="text-2xl">{renderStars(review.rating)}</div>
                            </div>

                            <p className="text-gray-700 mb-4 bg-gray-50 p-4 rounded-lg">{review.comment}</p>

                            {!review.approved && (
                                <div className="flex gap-2">
                                    <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm transition-colors">
                                        ✓ موافقة
                                    </button>
                                    <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm transition-colors">
                                        ✕ رفض
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReviewsManagement;
