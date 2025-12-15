import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', text = 'جاري التحميل...' }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className={`spinner spinner-${size} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`}></div>
            {text && <p className="mt-4 text-gray-600 dark:text-gray-400">{text}</p>}
        </div>
    );
};

export default LoadingSpinner;
