<script lang="ts">
  import { onDestroy } from 'svelte';
  import { auth } from '$lib/stores/auth';
  import LoginForm from '$lib/components/LoginForm.svelte';
  import OrdersList from '$lib/components/OrdersList.svelte';
  import InstallerForm from '$lib/components/InstallerForm.svelte';
  import { goto } from '$app/navigation';

  let token: string | null = null;
  let showInstallerForm = false;
  let createError: string | null = null;

  const unsubscribe = auth.subscribe(value => {
    token = value;
  });

  onDestroy(() => {
    unsubscribe();
  });

  function handleLoginSuccess() {
    // token is already set in store, no need to resubscribe
  }

  function handleInstallerSubmit(event: CustomEvent) {
    // Placeholder for installer submit handler
  }

</script>

<svelte:head>
  <title>Заявки | Провайдер</title>
</svelte:head>

{#if !token}
  <LoginForm on:loginSuccess={handleLoginSuccess} />
{:else}
  {#if showInstallerForm}
    {#if createError}
      <p class="text-red-600 mb-2">{createError}</p>
    {/if}  
    <InstallerForm on:submit={handleInstallerSubmit} />
  {/if}
  <OrdersList />
{/if}
