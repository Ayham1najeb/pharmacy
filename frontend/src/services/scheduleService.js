import { apiService } from './api';

export const scheduleService = {
    getSchedule: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return apiService.get(`/schedule${query ? '?' + query : ''}`);
    },

    getCalendar: (month, year) => {
        return apiService.get(`/schedule/calendar/${month}/${year}`);
    },

    getWeek: () => {
        return apiService.get('/schedule/week');
    },
};
