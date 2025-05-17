<script lang="ts">
	import '../app.css';
	import { auth } from '$lib/stores/auth';
	import { API_BASE } from '$lib/constants';
    import { onMount } from 'svelte';
	import { user } from '$lib/stores/user';
    import { getStatusName } from '$lib';
    import Icon from '@iconify/svelte';

	let username = $state("Username");
	let role = $state("Role");

	async function fetchMe(token: string) {
		if (token === 'nothing') {
			username = '';
			role = '';
			user.set({ username: '', role: '' });
			return;
		}

		const response = await fetch(API_BASE + "/users/me", {
			headers: {
				'token': token
			}
		});

		const result = await response.json();

		username = result['username'];
		role = getStatusName(result['role']);
		user.set({ username, role });
	}

	auth.subscribe((token) => {
		fetchMe(token || 'nothing');
	});
	
	let { children } = $props();

	onMount(() => {
		fetchMe($auth || 'nothing');
	});
	
	

</script>

<div class="w-full flex flex-col gap-2 items-end justify-end mt-10 pr-28">
	<h1 class="text-2xl uppercase font-semibold flex items-center gap-3">
		{#if $user.username}
			<Icon icon="codicon:account" width="24" height="24" />
			{$user.username}
		{/if}
	</h1>
	<h2>{$user.role}</h2>
</div>

{@render children()}
