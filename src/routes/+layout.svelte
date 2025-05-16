<script lang="ts">
	import '../app.css';
	import { auth } from '$lib/stores/auth';
	import { API_BASE } from '$lib/constants';
    import { onMount } from 'svelte';
	import { user } from '$lib/stores/user';

	let username = $state("Username");
	let role = $state("Role");

	function getStatusName(status: string): string {
		if (status === 'administrator') {
			return 'Администратор';
		}
		if (status === 'dispatcher') {
			return 'Диспетчер';
		}
		if (status === 'installer') {
			return 'Монтажник';
		}
		return 'Неизвестно';
	}

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
	<h1 class="text-2xl uppercase font-semibold">{$user.username}</h1>
	<h2>{$user.role}</h2>
</div>

{@render children()}
