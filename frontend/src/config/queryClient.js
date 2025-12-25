import { QueryClient } from '@tanstack/react-query';

// Create a client with optimized settings for free tier hosting
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Data stays fresh for 3 minutes - reduces API calls
            staleTime: 3 * 60 * 1000,
            // Data stays in cache for 10 minutes
            gcTime: 10 * 60 * 1000,
            // Don't refetch on window focus - saves API calls
            refetchOnWindowFocus: false,
            // Don't refetch on mount if data is fresh
            refetchOnMount: false,
            // Retry once on failure
            retry: 1,
            // Retry delay
            retryDelay: 1000,
        },
    },
});

// Cache keys for easy reference
export const QUERY_KEYS = {
    pharmacies: ['pharmacies'],
    onDutyNow: ['on-duty-now'],
    onDutyToday: ['on-duty-today'],
    statistics: ['statistics'],
    neighborhoods: ['neighborhoods'],
};
