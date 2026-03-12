import { writable, derived } from 'svelte/store';

export interface Shape {
	id: string;
	type: 'rectangle' | 'circle' | 'line';
	x: number;
	y: number;
	width: number;
	height: number;
	color: string;
}

function createShapeStore() {
	const { subscribe, set, update } = writable<Shape[]>([]);

	return {
		subscribe,
		set,
		update,
		add: (shape: Shape) => update((shapes) => [...shapes, shape]),
		remove: (id: string) => update((shapes) => shapes.filter((s) => s.id !== id)),
		clear: () => set([])
	};
}

export const shapes = createShapeStore();

// Derived stores
export const shapeCount = derived(shapes, ($shapes) => $shapes.length);
