import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import type { User } from '$lib/types/interfaces';

// Simple auth state interface (no DI dependency during SSR)
interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
}

// Create auth state with SSR-safe defaults
const initialState: AuthState = {
	user: null,
	isAuthenticated: false,
	isLoading: false,
	error: null
};

// Check if user exists in localStorage (client-side only)
function getStoredUser(): User | null {
	if (!browser) return null;

	try {
		const stored = localStorage.getItem('user');
		if (stored) {
			return JSON.parse(stored);
		}
	} catch (error) {
		console.error('Error reading from localStorage:', error);
	}
	return null;
}

// Save user to localStorage
function saveUser(user: User | null): void {
	if (!browser) return;

	try {
		if (user) {
			localStorage.setItem('user', JSON.stringify(user));
		} else {
			localStorage.removeItem('user');
		}
	} catch (error) {
		console.error('Error writing to localStorage:', error);
	}
}

// Create the auth store
function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>(initialState);

	return {
		subscribe,
		init: () => {
			const user = getStoredUser();
			set({
				user,
				isAuthenticated: user !== null,
				isLoading: false,
				error: null
			});
		},
		login: async (email: string, password: string) => {
			update((state) => ({ ...state, isLoading: true, error: null }));

			// Simulate API call delay
			await new Promise((resolve) => setTimeout(resolve, 500));

			try {
				// Mock authentication - accept any credentials
				if (email && password) {
					const user: User = {
						id: crypto.randomUUID(),
						email,
						name: email.split('@')[0]
					};

					saveUser(user);

					set({
						user,
						isAuthenticated: true,
						isLoading: false,
						error: null
					});

					return { success: true, user };
				} else {
					set({
						user: null,
						isAuthenticated: false,
						isLoading: false,
						error: 'Invalid credentials'
					});
					return { success: false, error: 'Invalid credentials' };
				}
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'An error occurred';
				set({
					user: null,
					isAuthenticated: false,
					isLoading: false,
					error: errorMessage
				});
				return { success: false, error: errorMessage };
			}
		},
		logout: () => {
			saveUser(null);
			set({
				user: null,
				isAuthenticated: false,
				isLoading: false,
				error: null
			});
		},
		// Sync method to update state from localStorage changes
		sync: () => {
			const user = getStoredUser();
			update((state) => ({
				...state,
				user,
				isAuthenticated: user !== null
			}));
		}
	};
}

export const authStore = createAuthStore();

// Initialize on mount (client-side)
if (browser) {
	authStore.init();
}

// Derived stores
export const user = derived(authStore, ($authStore) => $authStore.user);
export const isAuthenticated = derived(authStore, ($authStore) => $authStore.isAuthenticated);
export const isLoading = derived(authStore, ($authStore) => $authStore.isLoading);
export const error = derived(authStore, ($authStore) => $authStore.error);
