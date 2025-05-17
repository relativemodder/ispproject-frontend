<script lang="ts">
  import UserForm from '$lib/components/UserForm.svelte';
  import UsersList from '$lib/components/UsersList.svelte';
  import { API_BASE } from '$lib/constants';
  import { writable } from 'svelte/store';


  const successMessage = writable('');
  const errorMessage = writable('');

  async function handleUserSubmit(event: CustomEvent) {
    successMessage.set('');
    errorMessage.set('');
    const { username, password, role } = event.detail;

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, role })
      });

      if (response.ok) {
        successMessage.set('User created successfully.');
      } else {
        const errorData = await response.json();
        errorMessage.set(errorData.detail ? JSON.stringify(errorData.detail) : 'Failed to create user.');
      }
    } catch (error: any) {
      errorMessage.set('Network error: ' + error.message);
    }
  }
</script>

<svelte:head>
  <title>Пользователи | Провайдер</title>
</svelte:head>

<div class="max-w-lg mx-auto mt-10 p-4 rounded text-gray-800">
  <h1 class="text-2xl font-bold mb-4 text-center">Создать пользователя</h1>

  {#if $successMessage}
    <div class="mb-4 p-2 bg-green-200 text-green-800 rounded">{$successMessage}</div>
  {/if}

  {#if $errorMessage}
    <div class="mb-4 p-2 bg-red-200 text-red-800 rounded">{$errorMessage}</div>
  {/if}

  <UserForm on:submit={handleUserSubmit} />
</div>

<UsersList />
