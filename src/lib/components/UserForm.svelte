<script lang="ts">
    import { getStatusName } from '$lib';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let username = '';
  let password = '';
  let role = 'installer';

  const roles = ['administrator', 'dispatcher', 'installer'];

  function submitForm() {
    dispatch('submit', { username, password, role });
  }
</script>

<form on:submit|preventDefault={submitForm} class="max-w-md mx-auto p-8 shadow border-gray-500 rounded">
  <div class="mb-4">
    <label for="username" class="block mb-1 font-semibold">Логин</label>
    <input id="username" type="text" bind:value={username} required class="w-full border px-2 py-1 rounded" />
  </div>

  <div class="mb-4">
    <label for="password" class="block mb-1 font-semibold">Пароль</label>
    <input id="password" type="password" bind:value={password} required class="w-full border px-2 py-1 rounded" />
  </div>

  <div class="mb-4">
    <label for="role" class="block mb-1 font-semibold">Роль</label>
    <select id="role" bind:value={role} class="w-full border px-2 py-1 rounded">
      {#each roles as r}
        <option value={r}>{getStatusName(r)}</option>
      {/each}
    </select>
  </div>

  <button type="submit" class="bg-blue-600 w-full text-white mt-5 px-4 py-2 rounded hover:bg-blue-700">Подтвердить</button>
</form>
