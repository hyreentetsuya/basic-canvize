<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Card from '$lib/components/ui/card/card.svelte';
	import { Button } from '$lib/components/ui/button';
	import { authStore } from '$lib/stores/authStore';

	let email = '';
	let password = '';
	let mounted = false;

	onMount(() => {
		mounted = true;
		// Redirect if already authenticated
		if ($authStore.isAuthenticated) {
			goto('/draw');
		}
	});

	// Watch for auth changes
	$: if (mounted && $authStore.isAuthenticated) {
		goto('/draw');
	}

	async function handleLogin() {
		await authStore.login(email, password);
	}

	function handleLogout() {
		authStore.logout();
	}
</script>

{#if mounted}
	<div class="min-h-screen flex items-center justify-center bg-gray-100">
		<Card class="w-full max-w-md p-6">
			<h1 class="text-2xl font-bold mb-6 text-center">
				{#if $authStore.isAuthenticated}
					Welcome!
				{:else}
					Login
				{/if}
			</h1>

			{#if $authStore.isAuthenticated}
				<div class="space-y-4">
					<p class="text-center text-gray-600">
						Logged in as: <strong>{$authStore.user?.email}</strong>
					</p>
					<Button onclick={handleLogout} class="w-full">Logout</Button>
				</div>
			{:else}
				<form onsubmit={(e) => { e.preventDefault(); handleLogin(); }} class="space-y-4">
					<div class="space-y-2">
						<label for="email" class="text-sm font-medium">Email</label>
						<input
							id="email"
							type="email"
							placeholder="user@example.com"
							bind:value={email}
							required
							class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						/>
					</div>

					<div class="space-y-2">
						<label for="password" class="text-sm font-medium">Password</label>
						<input
							id="password"
							type="password"
							placeholder="••••••••"
							bind:value={password}
							required
							class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						/>
					</div>

					{#if $authStore.error}
						<p class="text-sm text-red-500">{$authStore.error}</p>
					{/if}

					<Button type="submit" class="w-full">Login</Button>
				</form>

				<div class="mt-4 text-center text-sm text-gray-500">
					<p>Use any email and password to login</p>
				</div>
			{/if}
		</Card>
	</div>
{:else}
	<div class="min-h-screen flex items-center justify-center bg-gray-100">
		<p>Loading...</p>
	</div>
{/if}
