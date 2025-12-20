import { apiService } from './api';

export const pharmacyService = {
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return apiService.get(`/api/v1/pharmacies${query ? '?' + query : ''}`);
    },

    getById: (id) => {
        return apiService.get(`/api/v1/pharmacies/${id}`);
    },

    getOnDutyToday: () => {
        return apiService.get('/api/v1/pharmacies/on-duty-today');
    },

    getOnDutyNow: () => {
        return apiService.get('/api/v1/pharmacies/on-duty-now');
    },

    search: (params) => {
        const query = new URLSearchParams(params).toString();
        return apiService.get(`/api/v1/pharmacies/search?${query}`);
    },
};
