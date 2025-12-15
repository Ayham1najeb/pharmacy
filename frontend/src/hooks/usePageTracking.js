import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export const usePageTracking = () => {
    const location = useLocation();

    useEffect(() => {
        // Track page view
        const trackView = async () => {
            try {
                await axios.post('/api/v1/analytics/track', {
                    url: location.pathname
                });
            } catch (error) {
                // Silent fail - don't disrupt user experience
                console.log('Analytics tracking failed');
            }
        };

        trackView();
    }, [location]);
};
