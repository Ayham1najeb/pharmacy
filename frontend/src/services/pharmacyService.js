import { apiService } from './api';

export const pharmacyService = {
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return apiService.get(`/pharmacies${query ? '?' + query : ''}`);
    },

    getById: (id) => {
        return apiService.get(`/pharmacies/${id}`);
    },

    getOnDutyToday: () => {
        return apiService.get('/pharmacies/on-duty-today');
    },

    getOnDutyNow: () => {
        return apiService.get('/pharmacies/on-duty-now');
    },

    search: (params) => {
        const query = new URLSearchParams(params).toString();
        return apiService.get(`/pharmacies/search?${query}`);
    },
};
