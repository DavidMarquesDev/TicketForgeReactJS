import { clearAccessToken, getAccessToken } from '../auth/token-storage';
import { ApiClient } from './api-client';

const handleUnauthorized = (): void => {
    clearAccessToken();
    window.location.href = '/login';
};

export const apiClient = new ApiClient({
    getToken: getAccessToken,
    onUnauthorized: handleUnauthorized,
});
