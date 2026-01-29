import { apiClient } from './api';
import { TOKEN_KEYS } from '@/config/api.config';
import type { LoginRequest, RegisterRequest, AuthResponse, UserResponse } from '@/types/auth.types';

export const authService = {
    /**
     * Register a new user
     */
    async register(data: RegisterRequest): Promise<UserResponse> {
        const response = await apiClient.post<UserResponse>('/auth/register', data);
        return response.data;
    },

    /**
     * Login user and store tokens
     */
    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/login', data);
        const { access_token, refresh_token } = response.data;

        // Store tokens in localStorage
        localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, access_token);
        localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refresh_token);

        return response.data;
    },

    /**
     * Logout user and clear tokens
     */
    logout(): void {
        localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
    },

    /**
     * Get current user info
     */
    async getCurrentUser(): Promise<UserResponse> {
        const response = await apiClient.get<UserResponse>('/auth/me');
        return response.data;
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    },

    /**
     * Get access token
     */
    getAccessToken(): string | null {
        return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    },
};
