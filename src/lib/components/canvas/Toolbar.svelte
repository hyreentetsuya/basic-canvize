<script lang="ts">
	type Tool = 'rectangle' | 'circle' | 'line' | 'select' | null;

	type $Props = {
		selectedTool: Tool;
		onClear: () => void;
		shapeCount: number;
		onToolSelect: (tool: Tool) => void;
	};

	let { selectedTool, onClear, shapeCount, onToolSelect }: $Props = $props();

	const tools = [
		{ type: 'select' as const, icon: '↖', label: 'Select' },
		{ type: 'rectangle' as const, icon: '▭', label: 'Rectangle' },
		{ type: 'circle' as const, icon: '●', label: 'Circle' },
		{ type: 'line' as const, icon: '━', label: 'Line' }
	];

	function handleSelectTool(type: Tool) {
		// Toggle tool selection
		if (selectedTool === type) {
			onToolSelect(null);
		} else {
			onToolSelect(type);
		}
	}

	function handleClear() {
		if (confirm('Are you sure you want to clear all shapes?')) {
			onClear();
		}
	}
</script>

<div class="flex items-center gap-6">
	<div class="flex items-center gap-2">
		<span class="text-sm font-medium text-gray-600">Tool:</span>
		{#each tools as tool}
			<button
				onclick={() => handleSelectTool(tool.type)}
				class="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors group"
				title={tool.label}
				class:bg-blue-100={selectedTool === tool.type}
				class:border-blue-400={selectedTool === tool.type}
				class:border={selectedTool === tool.type}
			>
				<div
					class="text-3xl transition-colors"
					class:text-gray-700={selectedTool !== tool.type}
					class:text-blue-600={selectedTool === tool.type}
				>
					{tool.icon}
				</div>
				<span
					class="text-xs transition-colors"
					class:text-gray-500={selectedTool !== tool.type}
					class:text-blue-600={selectedTool === tool.type}
				>
					{tool.label}
				</span>
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
