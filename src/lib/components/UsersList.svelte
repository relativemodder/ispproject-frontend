<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { API_BASE } from '$lib/constants';
  import { user } from '$lib/stores/user';
  import { getStatusName } from '$lib';

  interface Installer {
    id: number;
    name: string;
    contact_info?: string | null;
  }

  interface User {
    id: number;
    username: string;
    role: string;
    installer?: Installer | null;
  }

  let users: User[] = [];
  let error = '';
  let loading = false;

  $: token = $auth;
  $: role = $user.role;

  $: if (token) {
    fetchUsers();
  }

  async function fetchUsers() {
    loading = true;
    error = '';
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['token'] = token;
      }
      const response = await fetch(API_BASE + '/users/', {
        headers
      });
      if (!response.ok) {
        const data = await response.json();
        error = data.detail || 'Failed to fetch users';
        loading = false;
        return;
      }
      const data = await response.json();
      users = data;
    } catch (e) {
      error = 'Network error';
    } finally {
      loading = false;
    }
  }

  function logout() {
    auth.logout();
  }

  function goBack() {
    history.back();
  }

  onMount(() => {
    fetchUsers();
  });
</script>

<div class="max-w-6xl mx-auto mt-10 p-6 rounded shadow bg-white mb-5">
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-xl font-bold">Пользователи</h2>
    <div>
      <button on:click={goBack} class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">&lt;- Назад</button>
    </div>
  </div>

  {#if loading}
    <p>Loading users...</p>
  {:else if error}
    <p class="text-red-600">{error}</p>
  {:else}
{#if users.length === 0}
      <p>No users found.</p>
    {:else}
      <table class="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-300 px-2 py-1">ID</th>
            <th class="border border-gray-300 px-2 py-1">Логин</th>
            <th class="border border-gray-300 px-2 py-1">Роль</th>
            <th class="border border-gray-300 px-2 py-1">Монтажник?</th>
            <th class="border border-gray-300 px-2 py-1">Действия</th>
          </tr>
        </thead>
        <tbody>
          {#each users as user}
            <tr>
              <td class="border border-gray-300 px-2 py-1">{user.id}</td>
              <td class="border border-gray-300 px-2 py-1">{user.username}</td>
              <td class="border border-gray-300 px-2 py-1">{getStatusName(user.role)}</td>
              <td class="border border-gray-300 px-2 py-1">
                {#if user.installer}
                  {user.installer.name}
                {:else}
                  -
                {/if}
              </td>
              <td class="border border-gray-300 px-2 py-1 text-center">
                -
                <!--
                <button disabled class="w-full mt-2 bg-yellow-500 text-white px-2 py-1 rounded opacity-50 cursor-not-allowed mr-2">
                  Редактировать
                </button>
                -->
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  {/if}
</div>
