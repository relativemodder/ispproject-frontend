<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '$lib/stores/auth';
  import InstallerForm from '$lib/components/InstallerForm.svelte';
  import { writable, type Writable } from 'svelte/store';
  import { goto } from '$app/navigation';
  import { API_BASE } from '$lib/constants';

  interface Installer {
    id: number;
    name: string;
    contact_info?: string | null;
    user?: User | null;
  }

  interface User {
    id: number;
    username: string;
    email: string;
  }

  let token: string | null = null;
  const unsubscribe = auth.subscribe(value => {
    token = value;
  });

  let installers: Writable<Installer[]> = writable([]);
  let users: Writable<User[]> = writable([]);
  let error = '';
  let loading = false;
  let showCreateForm = false;
  let showEditForm = false;
  let installerToEdit: Installer | null = null;

  async function fetchInstallers() {
    if (!token) return;
    loading = true;
    error = '';
    try {
      const response = await fetch(`${API_BASE}/installers/`, {
        headers: {
          'Content-Type': 'application/json',
          'token': token
        }
      });
      if (!response.ok) {
        const data = await response.json();
        error = data.detail || 'Failed to fetch installers';
        loading = false;
        return;
      }
      const data = await response.json();
      installers.set(data);
    } catch (e) {
      error = 'Network error';
    } finally {
      loading = false;
    }
  }

  async function fetchUsers() {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE}/users/`, {
        headers: {
          'Content-Type': 'application/json',
          'token': token
        }
      });
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      users.set(data);
    } catch (e) {
      // ignore errors for users fetch
    }
  }

  async function createInstaller(event: CustomEvent) {
    if (!token) return;
    error = '';
    loading = true;
    try {
      const response = await fetch(`${API_BASE}/installers/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify(event.detail)
      });
      if (!response.ok) {
        const data = await response.json();
        error = data.detail || 'Failed to create installer';
        loading = false;
        return;
      }
      await fetchInstallers();
      showCreateForm = false;
    } catch (e) {
      error = 'Network error';
    } finally {
      loading = false;
    }
  }

  async function updateInstaller(event: CustomEvent) {
    if (!token || !installerToEdit) return;
    error = '';
    loading = true;
    try {
      const response = await fetch(`${API_BASE}/installers/${installerToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify(event.detail)
      });
      if (!response.ok) {
        const data = await response.json();
        error = data.detail || 'Failed to update installer';
        loading = false;
        return;
      }
      await fetchInstallers();
      showEditForm = false;
      installerToEdit = null;
    } catch (e) {
      error = 'Network error';
    } finally {
      loading = false;
    }
  }

  async function deleteInstaller(id: number) {
    if (!token) return;
    error = '';
    loading = true;
    try {
      const response = await fetch(`${API_BASE}/installers/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        }
      });
      if (!response.ok) {
        const data = await response.json();
        error = data.detail || 'Failed to delete installer';
        loading = false;
        return;
      }
      await fetchInstallers();
    } catch (e) {
      error = 'Network error';
    } finally {
      loading = false;
    }
  }

  function startEdit(installer: Installer) {
    installerToEdit = installer;
    showEditForm = true;
    showCreateForm = false;
  }

  function cancelEdit() {
    installerToEdit = null;
    showEditForm = false;
  }

  onMount(() => {
    fetchInstallers();
    fetchUsers();
  });
</script>

<svelte:head>
  <title>Монтажники | Провайдер</title>
</svelte:head>

<div class="max-w-4xl mx-auto mt-10 p-6 border rounded shadow">
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-xl font-bold">Монтажники</h2>
    <div>
      <button on:click={() => { showCreateForm = !showCreateForm; showEditForm = false; }} class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mr-2">
        {showCreateForm ? 'Отменить' : 'Создать монтажника'}
      </button>
      <button on:click={() => goto('/')} class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 ml-2">
        К заявкам
      </button>
    </div>
  </div>

  {#if showCreateForm}
    {#if error}
      <p class="text-red-600 mb-2">{error}</p>
    {/if}
    <InstallerForm users={$users} on:submit={createInstaller} />
  {/if}

  {#if showEditForm && installerToEdit}
    {#if error}
      <p class="text-red-600 mb-2">{error}</p>
    {/if}
    <InstallerForm users={$users} on:submit={updateInstaller} on:cancel={cancelEdit} />
  {/if}

  {#if loading}
    <p>Loading installers...</p>
  {:else if $installers.length === 0}
    <p>No installers found.</p>
  {:else}
    <table class="w-full table-auto border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 px-2 py-1">ID</th>
          <th class="border border-gray-300 px-2 py-1">Имя</th>
          <th class="border border-gray-300 px-2 py-1">Контактная информация</th>
          <th class="border border-gray-300 px-2 py-1">Пользователь</th>
        </tr>
      </thead>
      <tbody>
        {#each $installers as installer}
          <tr>
            <td class="border border-gray-300 px-2 py-1">{installer.id}</td>
            <td class="border border-gray-300 px-2 py-1">{installer.name}</td>
            <td class="border border-gray-300 px-2 py-1">{installer.contact_info || '-'}</td>
            <td class="border border-gray-300 px-2 py-1">{installer.user ? installer.user.username : '-'}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>