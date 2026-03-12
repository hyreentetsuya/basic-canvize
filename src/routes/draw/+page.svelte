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
	let canvasRef: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;

	onMount(() => {
		mounted = true;

		// Check authentication
		if (!$authStore.isAuthenticated) {
			goto('/');
			return;
		}

		// Initialize canvas after DOM is ready
		tick().then(() => {
			if (browser) {
				const canvas = document.getElementById('drawing-canvas') as HTMLCanvasElement;
				if (canvas) {
					canvasRef = canvas;
					ctx = canvas.getContext('2d');
				}
			}
		});
	});

	// Watch for auth changes
	$: if (mounted && !$authStore.isAuthenticated) {
		goto('/');
	}

	function handleLogout() {
		authStore.logout();
		// The reactive statement above will handle navigation
	}

	function handleShapeSelect(shapeType: string) {
		if (!browser || !canvasRef || !ctx) return;

		// Add new shape with safe defaults
		const newShape = {
			id: crypto.randomUUID(),
			type: shapeType as 'rectangle' | 'circle' | 'line',
			x: Math.max(50, Math.min(canvasRef.width - 150, Math.random() * (canvasRef.width - 100) + 50)),
			y: Math.max(50, Math.min(canvasRef.height - 150, Math.random() * (canvasRef.height - 100) + 50)),
			width: shapeType === 'circle' ? 50 : 100,
			height: shapeType === 'circle' ? 50 : 100,
			color: getRandomColor()
		};

		$shapes = [...$shapes, newShape];
		drawAllShapes();
	}

	function handleShapeSelectFromList(shapeId: string) {
		// Could implement selection highlighting here
		console.log('Selected shape:', shapeId);
	}

	function handleShapeDelete(shapeId: string) {
		$shapes = $shapes.filter((s) => s.id !== shapeId);
		drawAllShapes();
	}

	function handleClearCanvas() {
		$shapes = [];
		if (ctx && canvasRef) {
			ctx.fillStyle = '#ffffff';
			ctx.fillRect(0, 0, canvasRef.width, canvasRef.height);
		}
	}

	function drawAllShapes() {
		if (!ctx || !canvasRef) return;

		// Clear canvas and set white background
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, canvasRef.width, canvasRef.height);

		// Draw all shapes
		$shapes.forEach((shape) => {
			ctx.fillStyle = shape.color;
			ctx.strokeStyle = '#000000';
			ctx.lineWidth = 2;

			if (shape.type === 'rectangle') {
				ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
				ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
			} else if (shape.type === 'circle') {
				ctx.beginPath();
				ctx.arc(shape.x, shape.y, shape.width / 2, 0, Math.PI * 2);
				ctx.fill();
				ctx.stroke();
			} else if (shape.type === 'line') {
				ctx.beginPath();
				ctx.moveTo(shape.x, shape.y);
				ctx.lineTo(shape.x + shape.width, shape.y + shape.height);
				ctx.strokeStyle = shape.color;
				ctx.lineWidth = 4;
				ctx.stroke();
			}
		});
	}

	function getRandomColor() {
		const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DFE6E9', '#A29BFE', '#FD79A8'];
		return colors[Math.floor(Math.random() * colors.length)];
	}
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
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
					</svg>
				</button>
			</div>
			<div class="p-4 border-b border-gray-200 shrink-0">
				<p class="text-sm text-gray-600">
					Logged in as: <strong class="truncate">{$authStore.user?.email || 'User'}</strong>
				</p>
			</div>
			<div class="flex-1 overflow-y-auto">
				<ShapeList
					shapes={$shapes}
					onSelect={handleShapeSelectFromList}
					onDelete={handleShapeDelete}
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
						onShapeDraw={(data) => {
							// Optional: Handle canvas drawing interactions
							console.log('Canvas draw:', data);
						}}
					/>
				</div>
			</div>

			<!-- Toolbar -->
			<div class="h-20 bg-white border-t border-gray-200 flex items-center justify-center gap-4 px-4 shrink-0">
				<Toolbar
					onShapeSelect={handleShapeSelect}
					onClear={handleClearCanvas}
					shapeCount={$shapes.length}
				/>
			</div>
		</div>
	</div>
{:else}
	<div class="flex h-screen items-center justify-center bg-gray-100">
		<p class="text-gray-500">Loading...</p>
	</div>
{/if}
