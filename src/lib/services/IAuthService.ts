import type { interfaces } from 'inversify';
import type { AuthResult, LoginCredentials, User } from '$lib/types/interfaces';

export const IAuthService = Symbol('IAuthService');

export interface IAuthService {
	login(credentials: LoginCredentials): Promise<AuthResult>;
	logout(): void;
	getCurrentUser(): User | null;
	isAuthenticated(): boolean;
}

export type Newable<T> = interfaces.Newable<T>;
