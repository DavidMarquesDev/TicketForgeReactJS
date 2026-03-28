import { clearAccessToken, getAccessToken, setAccessToken } from '../../../core/auth/token-storage';
import type { AuthUser, LoginRequest, RegisterRequest } from '../domain/auth.types';
import type { AuthRepository } from './auth.repository';

export class AuthService
{
    private readonly repository: AuthRepository;

    constructor(repository: AuthRepository)
    {
        this.repository = repository;
    }

    public async login(payload: LoginRequest): Promise<AuthUser>
    {
        const token = await this.repository.login(payload);
        setAccessToken(token);
        return this.repository.me();
    }

    public async register(payload: RegisterRequest): Promise<number>
    {
        return this.repository.register(payload);
    }

    public async bootstrap(): Promise<AuthUser | null>
    {
        const token = getAccessToken();
        if (!token) {
            return null;
        }

        try {
            return await this.repository.me();
        } catch {
            clearAccessToken();
            return null;
        }
    }

    public async logout(): Promise<void>
    {
        try {
            await this.repository.logout();
        } finally {
            clearAccessToken();
        }
    }
}
