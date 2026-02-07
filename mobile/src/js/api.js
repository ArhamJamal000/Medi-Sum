/**
 * Medi-Sum Mobile App - API Client
 * Handles all API calls with JWT authentication
 */

const API_BASE_URL = localStorage.getItem('api_url') || 'https://snobbily-civilisatory-denis.ngrok-free.dev';

class ApiClient {
    constructor() {
        this.accessToken = null;
        this.refreshToken = null;
        this.loadTokens();
    }

    loadTokens() {
        this.accessToken = localStorage.getItem('access_token');
        this.refreshToken = localStorage.getItem('refresh_token');
    }

    saveTokens(access, refresh) {
        this.accessToken = access;
        this.refreshToken = refresh;
        localStorage.setItem('access_token', access);
        if (refresh) {
            localStorage.setItem('refresh_token', refresh);
        }
    }

    clearTokens() {
        this.accessToken = null;
        this.refreshToken = null;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    }

    isAuthenticated() {
        return !!this.accessToken;
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            ...options.headers
        };

        if (this.accessToken) {
            headers['Authorization'] = `Bearer ${this.accessToken}`;
        }

        try {
            let response = await fetch(url, {
                ...options,
                headers
            });

            // If 401 and we have refresh token, try to refresh
            if (response.status === 401 && this.refreshToken) {
                const refreshed = await this.refreshAccessToken();
                if (refreshed) {
                    // Retry original request with new token
                    headers['Authorization'] = `Bearer ${this.accessToken}`;
                    response = await fetch(url, { ...options, headers });
                }
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async refreshAccessToken() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.refreshToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.saveTokens(data.access_token, this.refreshToken);
                return true;
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
        }

        // Refresh failed - clear tokens
        this.clearTokens();
        return false;
    }

    // Auth endpoints
    async login(email, password) {
        const data = await this.request('/api/v1/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        this.saveTokens(data.access_token, data.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    }

    async register(name, email, password) {
        const data = await this.request('/api/v1/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });
        this.saveTokens(data.access_token, data.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    }

    async logout() {
        try {
            await this.request('/api/v1/auth/logout', { method: 'POST' });
        } finally {
            this.clearTokens();
        }
    }

    async getMe() {
        return this.request('/api/v1/auth/me');
    }

    // Dashboard
    async getDashboard() {
        return this.request('/api/v1/dashboard');
    }

    async generateHealthSummary() {
        return this.request('/api/v1/health-summary/generate', {
            method: 'POST'
        });
    }

    // Prescriptions
    async getPrescriptions(page = 1, perPage = 10) {
        return this.request(`/api/v1/prescriptions?page=${page}&per_page=${perPage}`);
    }

    async getPrescription(id) {
        return this.request(`/api/v1/prescriptions/${id}`);
    }

    async uploadPrescription(imageBase64) {
        return this.request('/api/v1/prescriptions', {
            method: 'POST',
            body: JSON.stringify({ image_base64: imageBase64 })
        });
    }

    async uploadReport(imageBase64) {
        return this.request('/api/v1/reports', {
            method: 'POST',
            body: JSON.stringify({ image: imageBase64 })
        });
    }

    async deletePrescription(id) {
        return this.request(`/api/v1/prescriptions/${id}`, { method: 'DELETE' });
    }

    // Health Readings
    async getHealthReadings() {
        return this.request('/api/v1/health-readings');
    }

    async addHealthReading(data) {
        return this.request('/api/v1/health-readings', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async deleteHealthReading(id) {
        return this.request(`/api/v1/health-readings/${id}`, { method: 'DELETE' });
    }

    // Timeline
    async getTimeline(page = 1, perPage = 20, filter = 'all') {
        return this.request(`/api/v1/timeline?page=${page}&per_page=${perPage}&filter=${filter}`);
    }

    // Chat
    async sendChatMessage(message, language = 'en') {
        return this.request('/api/v1/chat', {
            method: 'POST',
            body: JSON.stringify({ message, language })
        });
    }

    // Push tokens
    async registerPushToken(token, platform) {
        return this.request('/api/v1/push-tokens', {
            method: 'POST',
            body: JSON.stringify({ token, platform })
        });
    }

    // Pharma Assist
    async getPharmaAssist() {
        return this.request('/api/v1/pharma-assist');
    }

    async compareMedicine(medicine_name) {
        return this.request('/api/v1/pharma-assist/compare', {
            method: 'POST',
            body: JSON.stringify({ medicine_name })
        });
    }
}

export const api = new ApiClient();
