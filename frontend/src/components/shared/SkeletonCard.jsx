import React from 'react';

const SkeletonCard = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse">
            {/* Header with pharmacy icon placeholder */}
            <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="flex-1">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
            </div>

            {/* Address line */}
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3"></div>

            {/* Phone line */}
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>

            {/* Button placeholder */}
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-full"></div>
        </div>
    );
};

export const SkeletonStatsCard = () => {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto"></div>
        </div>
    );
};

export const HomePageSkeleton = () => {
    return (
        <>
            {/* Stats Skeleton */}
            <section className="py-16 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <SkeletonStatsCard />
                        <SkeletonStatsCard />
                        <SkeletonStatsCard />
                    </div>
                </div>
            </section>

            {/* On Duty Now Skeleton */}
            <section className="py-20 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="mb-12">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4 animate-pulse"></div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-3 animate-pulse"></div>
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                </div>
            </section>
        </>
    );
};

export default SkeletonCard;
