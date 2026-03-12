<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import { browser } from '$app/environment';

	type $$Props = {
		id: string;
		class?: string;
		onShapeDraw?: (data: { startX: number; startY: number; endX: number; endY: number }) => void;
	};

	let { id, class: className = undefined, onShapeDraw }: $$Props = $props();

	let canvasElement: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;

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
					// Set white background
					ctx.fillStyle = '#ffffff';
					ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
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
						// Save current canvas content
						const imageData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);

						// Resize
						canvasElement.width = parent.clientWidth;
						canvasElement.height = parent.clientHeight;

						// Restore content (will be cropped if smaller)
						ctx.putImageData(imageData, 0, 0);
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

	function handleMouseDown(e: MouseEvent) {
		if (!browser || !canvasElement) return;

		const rect = canvasElement.getBoundingClientRect();
		const startX = e.clientX - rect.left;
		const startY = e.clientY - rect.top;

		if (onShapeDraw) {
			onShapeDraw({ startX, startY, endX: startX, endY: startY });
		}
	}
</script>

<svelte:component
	this={canvasElement}
	on:canvasDraw={(e) => {
		if (onShapeDraw && e.detail) {
			onShapeDraw(e.detail);
		}
	}}
>
	<canvas
		{id}
		class={className}
		style="cursor: crosshair; display: block; width: 100%; height: 100%;"
	></canvas>
</svelte:component>
