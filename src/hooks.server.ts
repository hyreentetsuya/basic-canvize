import 'reflect-metadata';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Initialize reflect-metadata for server-side DI
	return resolve(event);
};
