<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { auth } from '$lib/stores/auth';
  import { onMount } from 'svelte';
  import { API_BASE } from '$lib/constants';

  let username = '';
  let password = '';
  let error = '';
  const dispatch = createEventDispatcher();

  async function handleLogin() {
    error = '';
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!response.ok) {
        const data = await response.json();
        error = data.detail || 'Не удалось войти';
        return;
      }
      const data = await response.json();
      auth.login(data.token);
      dispatch('loginSuccess');
    } catch (e) {
      error = 'Network error';
    }
  }
</script>

<div class="max-w-sm mx-auto mt-10 p-6 rounded shadow bg-white">
  <h2 class="text-xl font-bold mb-4">Войти</h2>
  {#if error}
    <p class="text-red-600 mb-4">{error}</p>
  {/if}
  <form on:submit|preventDefault={handleLogin} class="space-y-4">
    <div>
      <label for="username" class="block mb-1">Имя пользователя</label>
      <input id="username" type="text" bind:value={username} required class="w-full border-gray-400 border rounded px-3 py-2" />
    </div>
    <div>
      <label for="password" class="block mb-1">Пароль</label>
      <input id="password" type="password" bind:value={password} required class="w-full border-gray-400 border rounded px-3 py-2" />
    </div>
    <button type="submit" class="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-primary-light">
      Войти
    </button>
  </form>
</div>
