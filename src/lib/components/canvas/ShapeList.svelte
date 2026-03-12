<script lang="ts">
	import type { Shape } from '$lib/stores/shapeStore';

	export let shapes: Shape[];
	export let onSelect: (shapeId: string) => void;
	export let onDelete: (shapeId: string) => void;

	const shapeInfo = {
		rectangle: { label: 'Rectangle', icon: '▭' },
		circle: { label: 'Circle', icon: '●' },
		line: { label: 'Line', icon: '━' }
	};
</script>

<div class="p-4 space-y-3">
	{#if shapes.length === 0}
		<div class="text-center py-8 text-gray-400">
			<p class="text-sm">No shapes yet</p>
			<p class="text-xs mt-1">Click a tool below to add shapes</p>
		</div>
	{:else}
		{#each shapes as shape (shape.id)}
			<div
				class="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer"
				onclick={() => onSelect(shape.id)}
			>
				<div class="flex items-start justify-between">
					<div class="flex items-center gap-3">
						<div class="text-2xl" style="color: {shape.color}">
							{shapeInfo[shape.type].icon}
						</div>
						<div>
							<p class="font-medium text-sm text-gray-800">
								{shapeInfo[shape.type].label}
							</p>
							<div class="text-xs text-gray-500 mt-1">
								{#if shape.type === 'line'}
									Length: {Math.round(Math.sqrt(Math.pow(shape.width, 2) + Math.pow(shape.height, 2)))}px
								{:else if shape.type === 'circle'}
									Radius: {Math.round(shape.width / 2)}px
								{:else}
									{Math.round(shape.width)} × {Math.round(shape.height)}
								{/if}
							</div>
							<div class="text-xs text-gray-400 mt-0.5">
								Position: ({Math.round(shape.x)}, {Math.round(shape.y)})
							</div>
						</div>
					</div>
					<button
						onclick={(e) => {
							e.stopPropagation();
							onDelete(shape.id);
						}}
						class="text-gray-400 hover:text-red-500 transition-colors p-1"
						title="Delete shape"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
						</svg>
					</button>
				</div>
			</div>
		{/each}
	{/if}
</div>
