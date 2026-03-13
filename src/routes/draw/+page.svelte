<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import CanvasEditor from '$lib/components/canvas/CanvasEditor.svelte';
	import ShapeList from '$lib/components/canvas/ShapeList.svelte';
	import Toolbar from '$lib/components/canvas/Toolbar.svelte';
	import { shapes } from '$lib/stores/shapeStore';
	import { authStore } from '$lib/stores/authStore';

	let mounted = false;
	let currentTool: 'rectangle' | 'circle' | 'line' | 'select' | null = null;
	let selectedShapeId: string | null = null;
	let selectedShape:
		| {
				id: string;
				type: 'rectangle' | 'circle' | 'line';
				x: number;
				y: number;
				width: number;
				height: number;
				color: string;
		  }
		| null = null;

	onMount(() => {
		mounted = true;

		// Check authentication
		if (!$authStore.isAuthenticated) {
			goto('/');
			return;
		}
	});

	// Watch for auth changes
	$: if (mounted && !$authStore.isAuthenticated) {
		goto('/');
	}

	// Update selected shape when shapes or selection changes
	$: if (mounted) {
		if (selectedShapeId) {
			const found = $shapes.find((s) => s.id === selectedShapeId);
			selectedShape = found || null;
		} else {
			selectedShape = null;
		}
	}

	function handleLogout() {
		authStore.logout();
		// The reactive statement above will handle navigation
	}

	function handleToolSelect(tool: 'rectangle' | 'circle' | 'line' | 'select' | null) {
		currentTool = tool;
		// Clear selection when switching to draw tools
		if (tool !== 'select' && tool !== null) {
			selectedShapeId = null;
		}
	}

	function handleShapeSelect(shapeId: string | null) {
		selectedShapeId = shapeId;
		// Auto switch to select mode
		if (shapeId) {
			currentTool = 'select';
		}
	}

	function handleShapeDraw(shape: {
		id: string;
		type: 'rectangle' | 'circle' | 'line';
		x: number;
		y: number;
		width: number;
		height: number;
		color: string;
	}) {
		// Add the new shape to the store
		$shapes = [...$shapes, shape];
	}

	function handleShapeUpdate(shapeId: string, updates: Partial<{ color: string }>) {
		$shapes = $shapes.map((s) => (s.id === shapeId ? { ...s, ...updates } : s));
	}

	function handleShapeSelectFromList(shapeId: string) {
		selectedShapeId = shapeId;
		currentTool = 'select';
	}

	function handleShapeDelete(shapeId: string) {
		$shapes = $shapes.filter((s) => s.id !== shapeId);
		if (selectedShapeId === shapeId) {
			selectedShapeId = null;
		}
	}

	function handleClearCanvas() {
		$shapes = [];
		currentTool = null;
		selectedShapeId = null;
	}

	const predefinedColors = [
		'#FF6B6B',
		'#4ECDC4',
		'#45B7D1',
		'#96CEB4',
		'#FFEAA7',
		'#A29BFE',
		'#FD79A8',
		'#F8B500',
		'#FF6F61',
		'#6B5B95',
		'#88B04B',
		'#F7CAC9'
	];
</script>

{#if mounted}
	<div class="flex h-screen bg-gray-100">
		<!-- Sidebar -->
		<div class="w-80 bg-white border-r border-gray-200 overflow-y-auto flex flex-col">
			<div class="p-4 border-b border-gray-200 flex items-center justify-between shrink-0">
				<div>
					<h2 class="text-lg font-semibold">Shapes</h2>
					<p class="text-sm text-gray-500">{$shapes.length} shape(s)</p>
				</div>
				<button
					onclick={handleLogout}
					class="text-sm text-gray-500 hover:text-red-500 transition-colors"
					title="Logout"
					type="button"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
						/>
					</svg>
				</button>
			</div>
			<div class="p-4 border-b border-gray-200 shrink-0">
				<p class="text-sm text-gray-600">
					Logged in as: <strong class="truncate">{$authStore.user?.email || 'User'}</strong>
				</p>
			</div>

			<!-- Color Picker for Selected Shape -->
			{#if selectedShape && (selectedShape.type === 'rectangle' || selectedShape.type === 'circle')}
				<div class="p-4 border-b border-gray-200 shrink-0">
					<div class="flex items-center justify-between mb-2">
						<h3 class="text-sm font-medium text-gray-700">Edit Color</h3>
						<button
							onclick={() => (selectedShapeId = null)}
							class="text-gray-400 hover:text-gray-600 text-sm"
						>
							Close
						</button>
					</div>
					<div class="grid grid-cols-6 gap-2">
						{#each predefinedColors as color}
							<button
								onclick={() => handleShapeUpdate(selectedShape!.id, { color })}
								class="w-8 h-8 rounded-lg border-2 transition-all hover:scale-110"
								class:border-blue-500={selectedShape.color === color}
								class:border-gray-300={selectedShape.color !== color}
								style="background-color: {color};"
								title={color}
							></button>
						{/each}
					</div>
					<div class="mt-3 flex items-center gap-2">
						<label for="customColor" class="text-xs text-gray-600">Custom:</label>
						<input
							id="customColor"
							type="color"
							bind:value={selectedShape.color}
							onchange={(e) => handleShapeUpdate(selectedShape!.id, { color: e.target.value })}
							class="w-8 h-8 rounded cursor-pointer border-0"
						/>
						<span class="text-xs text-gray-500 font-mono">{selectedShape.color}</span>
					</div>
				</div>
			{/if}

			<div class="flex-1 overflow-y-auto">
				<ShapeList
					shapes={$shapes}
					onSelect={handleShapeSelectFromList}
					onDelete={handleShapeDelete}
					{selectedShapeId}
				/>
			</div>
		</div>

		<!-- Main Canvas Area -->
		<div class="flex-1 flex flex-col min-w-0">
			<!-- Canvas Container -->
			<div class="flex-1 p-4">
				<div class="w-full h-full bg-white rounded-lg shadow-md overflow-hidden relative">
					<CanvasEditor
						id="drawing-canvas"
						class="w-full h-full"
						{currentTool}
						shapes={$shapes}
						{selectedShapeId}
						onShapeDraw={handleShapeDraw}
						onShapeSelect={handleShapeSelect}
						onShapeUpdate={handleShapeUpdate}
					/>
				</div>
			</div>

			<!-- Toolbar -->
			<div class="h-20 bg-white border-t border-gray-200 flex items-center justify-center gap-4 px-4 shrink-0">
				<Toolbar
					{currentTool}
					onClear={handleClearCanvas}
					shapeCount={$shapes.length}
					onToolSelect={handleToolSelect}
				/>
			</div>
		</div>
	</div>
{:else}
	<div class="flex h-screen items-center justify-center bg-gray-100">
		<p class="text-gray-500">Loading...</p>
	</div>
{/if}
