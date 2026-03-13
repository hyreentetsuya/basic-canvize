<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import { browser } from '$app/environment';

	type ShapeType = 'rectangle' | 'circle' | 'line' | 'select';

	type Shape = {
		id: string;
		type: 'rectangle' | 'circle' | 'line';
		x: number;
		y: number;
		width: number;
		height: number;
		color: string;
	};

	type $Props = {
		id: string;
		class?: string;
		currentTool: ShapeType | null;
		shapes: Shape[];
		selectedShapeId: string | null;
		onShapeDraw?: (shape: Shape) => void;
		onShapeSelect?: (shapeId: string | null) => void;
		onShapeUpdate?: (shapeId: string, updates: Partial<Shape>) => void;
	};

	let {
		id,
		class: className = undefined,
		currentTool,
		shapes,
		selectedShapeId,
		onShapeDraw,
		onShapeSelect,
		onShapeUpdate
	}: $Props = $props();

	let canvasElement: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let isDrawing = $state(false);
	let startX = 0;
	let startY = 0;
	let lastShapesHash = $state('');

	// Track shapes changes for redraw
	$effect(() => {
		const hash = JSON.stringify(shapes.map((s) => `${s.id}:${s.color}`));
		if (hash !== lastShapesHash) {
			lastShapesHash = hash;
			if (ctx && canvasElement) {
				drawAllShapes();
			}
		}
	});

	// Also redraw when selection changes
	$effect(() => {
		selectedShapeId;
		if (ctx && canvasElement) {
			drawAllShapes();
		}
	});

	onMount(() => {
		if (!browser) return;

		// Wait for DOM to be ready
		tick().then(() => {
			if (canvasElement) {
				const parent = canvasElement.parentElement;
				if (parent) {
					canvasElement.width = parent.clientWidth;
					canvasElement.height = parent.clientHeight;
				}

				ctx = canvasElement.getContext('2d');
				if (ctx) {
					drawAllShapes();
				}
			}
		});

		// Handle resize with debounce
		let resizeTimeout: ReturnType<typeof setTimeout>;
		const handleResize = () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				if (canvasElement && ctx) {
					const parent = canvasElement.parentElement;
					if (parent) {
						canvasElement.width = parent.clientWidth;
						canvasElement.height = parent.clientHeight;
						drawAllShapes();
					}
				}
			}, 100);
		};

		window.addEventListener('resize', handleResize);

		onDestroy(() => {
			window.removeEventListener('resize', handleResize);
			clearTimeout(resizeTimeout);
		});
	});

	function drawAllShapes() {
		if (!ctx || !canvasElement) return;

		// Clear canvas and set white background
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);

		// Draw all existing shapes
		shapes.forEach((shape) => {
			const isSelected = shape.id === selectedShapeId;
			drawShape(shape, false, isSelected);
		});
	}

	function drawShape(shape: Shape, isPreview = false, isSelected = false) {
		if (!ctx) return;

		ctx.save();

		if (isPreview) {
			ctx.globalAlpha = 0.5;
			ctx.setLineDash([5, 5]);
		}

		// Draw selection highlight
		if (isSelected && !isPreview && (shape.type === 'rectangle' || shape.type === 'circle')) {
			ctx.shadowColor = '#3B82F6';
			ctx.shadowBlur = 15;
			ctx.strokeStyle = '#3B82F6';
			ctx.lineWidth = 3;
		}

		if (shape.type === 'rectangle') {
			ctx.fillStyle = shape.color;
			ctx.strokeStyle = '#000000';
			ctx.lineWidth = isSelected ? 3 : 2;
			ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
			if (!isSelected) {
				ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
			}
		} else if (shape.type === 'circle') {
			ctx.fillStyle = shape.color;
			ctx.strokeStyle = '#000000';
			ctx.lineWidth = isSelected ? 3 : 2;
			ctx.beginPath();
			const radius = Math.abs(shape.width) / 2;
			const centerX = shape.x + shape.width / 2;
			const centerY = shape.y + shape.height / 2;
			ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
			ctx.fill();
			if (!isSelected) {
				ctx.stroke();
			}
		} else if (shape.type === 'line') {
			ctx.strokeStyle = '#000000';
			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.moveTo(shape.x, shape.y);
			ctx.lineTo(shape.x + shape.width, shape.y + shape.height);
			ctx.stroke();
		}

		ctx.restore();
	}

	function isPointInShape(x: number, y: number, shape: Shape): boolean {
		if (shape.type === 'rectangle') {
			// Handle negative width/height
			const minX = Math.min(shape.x, shape.x + shape.width);
			const maxX = Math.max(shape.x, shape.x + shape.width);
			const minY = Math.min(shape.y, shape.y + shape.height);
			const maxY = Math.max(shape.y, shape.y + shape.height);
			return x >= minX && x <= maxX && y >= minY && y <= maxY;
		} else if (shape.type === 'circle') {
			const radius = Math.abs(shape.width) / 2;
			const centerX = shape.x + shape.width / 2;
			const centerY = shape.y + shape.height / 2;
			const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
			return distance <= radius;
		}
		return false;
	}

	function handleMouseDown(e: MouseEvent) {
		if (!browser || !canvasElement || !ctx) return;

		const rect = canvasElement.getBoundingClientRect();
		const clickX = e.clientX - rect.left;
		const clickY = e.clientY - rect.top;

		// If in select mode, check if clicked on a shape
		if (currentTool === 'select' || currentTool === null) {
			// Check shapes in reverse order (top to bottom)
			for (let i = shapes.length - 1; i >= 0; i--) {
				const shape = shapes[i];
				if ((shape.type === 'rectangle' || shape.type === 'circle') &&
					isPointInShape(clickX, clickY, shape)) {
					if (onShapeSelect) {
						onShapeSelect(shape.id);
					}
					return;
				}
			}
			// Clicked on empty space - deselect
			if (onShapeSelect) {
				onShapeSelect(null);
			}
			return;
		}

		// Drawing mode
		startX = clickX;
		startY = clickY;
		isDrawing = true;
	}

	function handleMouseMove(e: MouseEvent) {
		if (!isDrawing || !canvasElement || !ctx || !currentTool || currentTool === 'select') return;

		const rect = canvasElement.getBoundingClientRect();
		const currentX = e.clientX - rect.left;
		const currentY = e.clientY - rect.top;

		// Clear and redraw existing shapes
		drawAllShapes();

		// Draw preview
		const width = currentX - startX;
		const height = currentY - startY;

		drawShape(
			{
				id: 'preview',
				type: currentTool as 'rectangle' | 'circle' | 'line',
				x: startX,
				y: startY,
				width,
				height,
				color: '#4ECDC4'
			},
			true
		);
	}

	function handleMouseUp(e: MouseEvent) {
		if (!isDrawing || !canvasElement || !ctx || !currentTool || currentTool === 'select') return;

		const rect = canvasElement.getBoundingClientRect();
		const endX = e.clientX - rect.left;
		const endY = e.clientY - rect.top;

		const width = endX - startX;
		const height = endY - startY;

		// Only create shape if it has meaningful size
		if (Math.abs(width) > 5 || Math.abs(height) > 5) {
			const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#A29BFE', '#FD79A8'];
			const randomColor = colors[Math.floor(Math.random() * colors.length)];

			const newShape = {
				id: crypto.randomUUID(),
				type: currentTool as 'rectangle' | 'circle' | 'line',
				x: startX,
				y: startY,
				width,
				height,
				color: randomColor
			};

			if (onShapeDraw) {
				onShapeDraw(newShape);
			}
		}

		isDrawing = false;

		// Redraw everything including new shape
		drawAllShapes();
	}

	function handleMouseLeave() {
		if (isDrawing) {
			isDrawing = false;
			drawAllShapes();
		}
	}

	// Set cursor based on current tool
	let cursorStyle = $derived(
		currentTool === 'select' || currentTool === null ? 'pointer' : 'crosshair'
	);
</script>

<canvas
	bind:this={canvasElement}
	{id}
	class={className}
	style="cursor: {cursorStyle}; display: block; width: 100%; height: 100%; touch-action: none;"
	onmousedown={handleMouseDown}
	onmousemove={handleMouseMove}
	onmouseup={handleMouseUp}
	onmouseleave={handleMouseLeave}
></canvas>
