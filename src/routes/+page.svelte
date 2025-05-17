<script lang="ts">
  import { auth } from '$lib/stores/auth';
  import LoginForm from '$lib/components/LoginForm.svelte';
  import OrdersList from '$lib/components/OrdersList.svelte';
  import InstallerForm from '$lib/components/InstallerForm.svelte';

  let showInstallerForm = false;
  let createError: string | null = null;

  $: token = $auth;
</script>

<svelte:head>
  <title>Заявки | Провайдер</title>
</svelte:head>

{#if !token}
  <LoginForm />
{:else}
  {#if showInstallerForm}
    {#if createError}
      <p class="text-red-600 mb-2">{createError}</p>
    {/if}  
    <InstallerForm />
  {/if}
  <OrdersList />
{/if}
