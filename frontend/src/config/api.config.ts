export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1',
    TIMEOUT: 15000,  // 15 seconds (increased from 10s to handle cold starts)
} as const;

export const TOKEN_KEYS = {
    ACCESS_TOKEN: 'poketab_access_token',
    REFRESH_TOKEN: 'poketab_refresh_token',
} as const;
