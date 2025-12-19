const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

class ApiService {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;

        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                const error = new Error(data.message || 'حدث خطأ في الاتصال');
                error.response = { data, status: response.status };
                throw error;
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    get(endpoint, token = null) {
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        return this.request(endpoint, { method: 'GET', headers });
    }

    post(endpoint, data, token = null) {
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        return this.request(endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });
    }

    put(endpoint, data, token = null) {
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        return this.request(endpoint, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data),
        });
    }

    patch(endpoint, data, token = null) {
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        return this.request(endpoint, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(data),
        });
    }

    delete(endpoint, token = null) {
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        return this.request(endpoint, { method: 'DELETE', headers });
    }
}

export const apiService = new ApiService();
