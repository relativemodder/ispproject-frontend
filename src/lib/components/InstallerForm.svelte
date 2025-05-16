<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  interface User {
    id: number;
    username: string;
    email: string;
  }

  export let users: User[] = [];

  let name = '';
  let contact_info = '';
  let selectedUserId: number | null = null;
  let error = '';
  let loading = false;

  const dispatch = createEventDispatcher();

  async function handleSubmit() {
    error = '';
    loading = true;
    try {
      dispatch('submit', { name, contact_info, user_id: selectedUserId });
    } catch (e) {
      error = 'Failed to create installer';
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-md mx-auto p-4 rounded shadow mb-4">
  <h3 class="text-lg font-bold mb-4">Создать монтажника</h3>
  {#if error}
    <p class="text-red-600 mb-2">{error}</p>
  {/if}
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div>
      <label for="name" class="block mb-1">Name</label>
      <input id="name" type="text" bind:value={name} required class="w-full border rounded px-3 py-2" />
    </div>
    <div>
      <label for="contact_info" class="block mb-1">Contact Info</label>
      <input id="contact_info" type="text" bind:value={contact_info} class="w-full border rounded px-3 py-2" />
    </div>
    <div>
      <label for="user" class="block mb-1">Пользователь</label>
      <select id="user" bind:value={selectedUserId} required class="w-full border rounded px-3 py-2">
        <option value="" disabled selected>Выберите пользователя</option>
        {#each users as user}
          <option value={user.id}>{user.username} ({user.email})</option>
        {/each}
      </select>
    </div>
    <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={loading}>
      {#if loading}Creating...{:else}Create Installer{/if}
    </button>
  </form>
</div>
