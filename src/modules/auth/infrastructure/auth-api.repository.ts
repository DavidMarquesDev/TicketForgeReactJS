import { ApiClient, HttpError } from '../../../core/http/api-client';
import { apiClient } from '../../../core/http/api-instance';
import type { AuthRepository } from '../application/auth.repository';
import type { AuthUser, LoginRequest, RegisterRequest } from '../domain/auth.types';

type LoginResponse = {
    success: true;
    token: string;
};

export class AuthApiRepository implements AuthRepository
{
    private readonly client: ApiClient;

    constructor(client: ApiClient = apiClient)
    {
        this.client = client;
    }

    public async login(payload: LoginRequest): Promise<string>
    {
        const response = await this.client.request<LoginResponse>('/auth/login', {
            method: 'POST',
            body: payload,
        });

        if ('token' in response && response.success && typeof response.token === 'string') {
            return response.token;
        }

        throw new HttpError(500);
    }

    public async register(payload: RegisterRequest): Promise<number>
    {
        const response = await this.client.request<{ id: number }>('/auth/register', {
            method: 'POST',
            body: payload,
        });

        if ('id' in response && response.success && typeof response.id === 'number') {
            return response.id;
        }

        if ('data' in response && response.success) {
            return response.data.id;
        }

        throw new HttpError(500);
    }

    public async logout(): Promise<void>
    {
        await this.client.request<unknown>('/auth/logout', {
            method: 'POST',
        });
    }

    public async me(): Promise<AuthUser>
    {
        const response = await this.client.request<AuthUser>('/auth/me');
        return ApiClient.unwrapData<AuthUser>(response);
    }
}
