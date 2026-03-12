<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Shape } from '$lib/stores/shapeStore';

	export let onShapeSelect: (shapeType: string) => void;
	export let onClear: () => void;
	export let shapeCount: number;

	const dispatch = createEventDispatcher();

	const tools = [
		{ type: 'rectangle', icon: '▭', label: 'Rectangle' },
		{ type: 'circle', icon: '●', label: 'Circle' },
		{ type: 'line', icon: '━', label: 'Line' }
	];

	function handleSelectTool(type: string) {
		onShapeSelect(type);
	}

	function handleClear() {
		if (confirm('Are you sure you want to clear all shapes?')) {
			onClear();
		}
	}
</script>

<div class="flex items-center gap-6">
	<div class="flex items-center gap-2">
		<span class="text-sm font-medium text-gray-600">Add Shape:</span>
		{#each tools as tool}
			<button
				onclick={() => handleSelectTool(tool.type)}
				class="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 transition-colors group"
				title={tool.label}
			>
				<div class="text-3xl text-gray-700 group-hover:text-blue-600">
					{tool.icon}
				</div>
				<span class="text-xs text-gray-500">{tool.label}</span>
			</button>
		{/each}
	</div>

	<div class="h-8 w-px bg-gray-300"></div>

	<div class="flex items-center gap-4">
		<div class="text-sm text-gray-600">
			<span class="font-medium">{shapeCount}</span>
			{shapeCount === 1 ? ' shape' : ' shapes'}
		</div>

		{#if shapeCount > 0}
			<button
				onclick={handleClear}
				class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
			>
				Clear All
			</button>
		{/if}
	</div>
</div>

<style>
	button {
		cursor: pointer;
	}
</style>
