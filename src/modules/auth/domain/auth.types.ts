export type UserRole = 'admin' | 'support' | 'user';

export type AuthUser = {
    id: number;
    name: string;
    cpf: string;
    email: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
};

export type LoginRequest = {
    cpf: string;
    password: string;
};

export type RegisterRequest = {
    name: string;
    cpf: string;
    email: string;
    password: string;
};
