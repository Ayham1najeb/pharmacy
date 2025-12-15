import React from 'react';

const Search = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                        البحث
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        قريباً - بحث متقدم عن الصيدليات
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
                    <div className="text-6xl mb-6">🔍</div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                        صفحة البحث قيد التطوير
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        سيتم إضافة بحث متقدم مع فلاتر قريباً
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Search;
