<script lang="ts">
	import { cn } from '$lib/utils/cn';

	type $$Props = {
		class?: string;
		type?: string;
		placeholder?: string;
		value?: string;
		required?: boolean;
		id?: string;
		oninput?: (event: Event) => void;
	};

	let {
		className = undefined,
		type = 'text',
		placeholder = '',
		value = '',
		required = false,
		id = '',
		oninput = undefined
	}: $$Props = $props();
</script>

<input
	{id}
	{type}
	{placeholder}
	{value}
	{required}
	oninput={oninput}
	class={cn(
		'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
/>
