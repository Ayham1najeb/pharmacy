import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'جاري التحميل...' }) => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-pulse">
            {/* Hero Skeleton */}
            <div className="bg-slate-900 py-24 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Badge Skeleton */}
                        <div className="flex justify-center mb-8">
                            <div className="h-8 w-48 bg-slate-700/50 rounded-full"></div>
                        </div>

                        {/* Title Skeleton */}
                        <div className="space-y-4 mb-8">
                            <div className="h-12 md:h-16 bg-slate-700/50 rounded-xl mx-auto max-w-xl"></div>
                            <div className="h-10 md:h-14 bg-slate-700/30 rounded-xl mx-auto max-w-sm"></div>
                        </div>

                        {/* Description Skeleton */}
                        <div className="space-y-2 mb-10 max-w-2xl mx-auto">
                            <div className="h-5 bg-slate-700/40 rounded-lg mx-auto"></div>
                            <div className="h-4 bg-slate-700/30 rounded-lg mx-auto max-w-md"></div>
                        </div>

                        {/* Buttons Skeleton */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <div className="h-12 w-48 bg-blue-600/50 rounded-xl"></div>
                            <div className="h-12 w-40 bg-slate-700/50 rounded-xl"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Skeleton */}
            <div className="py-16 bg-gray-100 dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
                                <div className="h-12 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-4"></div>
                                <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Loading Indicator */}
            <div className="py-12 text-center">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="w-5 h-5 border-2 border-gray-200 dark:border-gray-600 border-t-blue-600 rounded-full animate-spin"></div>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">{text}</span>
                </div>
            </div>
        </div>
    );
};

export default LoadingSpinner;
