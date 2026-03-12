<script lang="ts">
	import { cn } from '$lib/utils/cn';

	type $$Props = {
		class?: string;
		type?: 'button' | 'submit' | 'reset';
		children: import('svelte').Snippet;
		onclick?: () => void;
		disabled?: boolean;
	};

	let {
		className = undefined,
		type = 'button',
		children,
		onclick = undefined,
		disabled = false
	}: $$Props = $props();
</script>

<button
	{type}
	{disabled}
	onclick={onclick}
	class={cn(
		'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2',
		className
	)}
>
	{@render children()}
</button>
