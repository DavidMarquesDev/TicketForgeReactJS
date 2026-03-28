import { env } from '../config/env';
import type { ApiError, ApiResponse, ApiSuccessEnvelope } from '../../shared/domain/api.types';

type RequestConfig = {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    body?: unknown;
    headers?: Record<string, string>;
};

type ApiClientOptions = {
    getToken: () => string | null;
    onUnauthorized: () => void;
};

class HttpError extends Error
{
    public readonly status: number;
    public readonly payload?: ApiError;

    constructor(status: number, payload?: ApiError)
    {
        super(payload?.message ?? 'Falha na requisição');
        this.name = 'HttpError';
        this.status = status;
        this.payload = payload;
    }
}

class ApiClient
{
    private readonly getToken: () => string | null;
    private readonly onUnauthorized: () => void;

    constructor(options: ApiClientOptions)
    {
        this.getToken = options.getToken;
        this.onUnauthorized = options.onUnauthorized;
    }

    public async request<T>(path: string, config: RequestConfig = {}): Promise<ApiResponse<T>>
    {
        const token = this.getToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(config.headers ?? {}),
        };

        const response = await fetch(`${env.apiBaseUrl}${path}`, {
            method: config.method ?? 'GET',
            headers,
            body: config.body ? JSON.stringify(config.body) : undefined,
        });

        const payload = (await response.json()) as ApiResponse<T>;
        if (!response.ok) {
            if (response.status === 401 && token) {
                this.onUnauthorized();
            }
            throw new HttpError(response.status, 'success' in payload && !payload.success ? payload : undefined);
        }

        return payload;
    }

    public static unwrapData<T>(response: ApiResponse<T>): T
    {
        if (!('success' in response) || !response.success) {
            throw new Error('Resposta inválida da API');
        }

        if ('data' in response) {
            return (response as ApiSuccessEnvelope<T>).data;
        }

        return response as T;
    }
}

export { ApiClient, HttpError };
