import type { AuthUser, LoginRequest, RegisterRequest } from '../domain/auth.types';

export interface AuthRepository {
    login(payload: LoginRequest): Promise<string>;
    register(payload: RegisterRequest): Promise<number>;
    logout(): Promise<void>;
    me(): Promise<AuthUser>;
}
