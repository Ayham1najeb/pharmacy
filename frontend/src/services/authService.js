import { apiService } from './api';

export const authService = {
    login: (email, password) => {
        return apiService.post('/admin/auth/login', { email, password });
    },

    logout: (token) => {
        return apiService.post('/admin/auth/logout', {}, token);
    },

    me: (token) => {
        return apiService.get('/admin/auth/me', token);
    },
};
