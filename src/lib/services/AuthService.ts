import type { IAuthService } from './IAuthService';
import { injectable } from 'inversify';
import type { AuthResult, LoginCredentials, User } from '$lib/types/interfaces';

@injectable()
export class AuthService implements IAuthService {
	private currentUser: User | null = null;

	async login(credentials: LoginCredentials): Promise<AuthResult> {
		// Simulate API call delay
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Mock authentication - accept any credentials
		if (credentials.email && credentials.password) {
			this.currentUser = {
				id: crypto.randomUUID(),
				email: credentials.email,
				name: credentials.email.split('@')[0]
			};

			// Store in localStorage for persistence
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem('user', JSON.stringify(this.currentUser));
			}

			return { success: true, user: this.currentUser };
		}

		return { success: false, error: 'Invalid credentials' };
	}

	logout(): void {
		this.currentUser = null;
		if (typeof localStorage !== 'undefined') {
			localStorage.removeItem('user');
		}
	}

	getCurrentUser(): User | null {
		if (this.currentUser) {
			return this.currentUser;
		}

		// Check localStorage on client side
		if (typeof localStorage !== 'undefined') {
			const stored = localStorage.getItem('user');
			if (stored) {
				this.currentUser = JSON.parse(stored);
				return this.currentUser;
			}
		}

		return null;
	}

	isAuthenticated(): boolean {
		return this.getCurrentUser() !== null;
	}
}
