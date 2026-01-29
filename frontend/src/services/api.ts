import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG, TOKEN_KEYS } from '@/config/api.config';

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_CONFIG.BASE_URL,
            timeout: API_CONFIG.TIMEOUT,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Request interceptor - Add auth token
        this.client.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const token = localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor - Handle errors
        this.client.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                // If 401 and we haven't retried yet, try to refresh token
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const refreshToken = localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
                        if (refreshToken) {
                            // Note: Backend doesn't have refresh endpoint yet, so we'll just logout
                            // TODO: Implement refresh token endpoint in backend
                            this.clearTokens();
                            window.location.href = '/login';
                        }
                    } catch (refreshError) {
                        this.clearTokens();
                        window.location.href = '/login';
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    private clearTokens() {
        localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
    }

    public getClient(): AxiosInstance {
        return this.client;
    }
}

// Export singleton instance
export const apiClient = new ApiClient().getClient();
