import React from 'react';

const LoadingSpinner = ({ fullScreen = false, message = 'جاري التحميل...' }) => {
    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 z-50">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-900 rounded-full"></div>
                    <div className="w-16 h-16 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                </div>
                <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium animate-pulse">
                    {message}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
                <div className="w-12 h-12 border-3 border-blue-200 dark:border-blue-900 rounded-full"></div>
                <div className="w-12 h-12 border-3 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="mt-3 text-gray-500 dark:text-gray-400 text-sm animate-pulse">
                {message}
            </p>
        </div>
    );
};

export default LoadingSpinner;
