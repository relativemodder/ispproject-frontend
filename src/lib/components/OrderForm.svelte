<script lang="ts">
    import { user } from '$lib/stores/user';
  import { createEventDispatcher, onMount } from 'svelte';

  export let initialData: {
    address?: string;
    account_number?: string;
    contact_details?: string;
    installer_id?: number | null;
    status?: string;
  } = {};

  export let mode: 'create' | 'edit' = 'create';

  export let users: { id: number; name: string; contact_info?: string | null }[] = [];

  let address = '';
  let account_number = '';
  let contact_details = '';
  let installer_id: number | null = null;
  let status = 'in_progress';
  let error = '';
  let loading = false;

  const dispatch = createEventDispatcher();

  onMount(() => {
    address = initialData.address ?? '';
    account_number = initialData.account_number ?? '';
    contact_details = initialData.contact_details ?? '';
    installer_id = initialData.installer_id ?? null;
    status = initialData.status ?? 'in_progress';
  });

  async function handleSubmit() {
    error = '';
    loading = true;
    try {
      dispatch('submit', { address, account_number, contact_details, installer_id, status });
    } catch (e) {
      error = 'Failed to submit order';
    } finally {
      loading = false;
    }
  }

  $: is_installer = $user.role == 'Монтажник';
</script>

<div class="max-w-md mx-auto p-4 border rounded shadow mb-4">
  <h3 class="text-lg font-bold mb-4">
    {mode === 'create' ? 'Создать заявку' : 'Редактировать заявку'}
  </h3>
  {#if error}
    <p class="text-red-600 mb-2">{error}</p>
  {/if}
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div>
      <label for="address" class="block mb-1">Адрес</label>
      <input id="address" disabled={is_installer} type="text" 
        bind:value={address} required 
        class={
          "w-full border rounded px-3 py-2"
          + (
            is_installer
             ? " text-gray-500"
             : ""
          )
        } />
    </div>
    <div>
      <label for="account_number" class="block mb-1">Номер абонента</label>
      <input id="account_number" type="text" bind:value={account_number} required class={
        "w-full border rounded px-3 py-2"
        + (
          is_installer
           ? " text-gray-500"
           : ""
        )} />
    </div>
    <div>
      <label for="contact_details" class="block mb-1">Контактные данные</label>
      <input id="contact_details" type="text" bind:value={contact_details} required class={
        "w-full border rounded px-3 py-2"
        + (
          is_installer
           ? " text-gray-500"
           : ""
        )} />
    </div>
    <div>
      <label for="installer" class="block mb-1">Назначить монтажника</label>
      <select id="installer" bind:value={installer_id} class={
        "w-full border rounded px-3 py-2"
        + (
          is_installer
           ? " text-gray-500"
           : ""
        )}>
        <option value={null}>-- Монтажник не выбран --</option>
        {#each users as user}
          <option value={user.id}>{user.name}</option>
        {/each}
      </select>
    </div>
    <div>
      <label for="status" class="block mb-1">Статус заявки</label>
      <select id="status" bind:value={status} class="w-full border rounded px-3 py-2">
        <option value="in_progress">В процессе</option>
        <option value="needs_rework">Требует доработки</option>
        <option value="completed">Завершена</option>
      </select>
    </div>
    <button type="submit" class="bg-green-600 text-white w-full px-4 py-2 rounded hover:bg-success-light" disabled={loading}>
      {#if loading}
        {mode === 'create' ? 'Создание...' : 'Сохранение...'}
      {:else}
        {mode === 'create' ? 'Создать заявку' : 'Сохранить изменения'}
      {/if}
    </button>
  </form>
</div>
