<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '$lib/stores/auth';
  import { writable } from 'svelte/store';
  import { goto } from '$app/navigation';
  import OrderForm from './OrderForm.svelte';
  import InstallerForm from './InstallerForm.svelte';
  import { API_BASE } from '$lib/constants';
  
  
  interface Order {
    id: number;
    address: string;
    account_number: string;
    contact_details: string;
    status: string;
    installer_id: number | null;
    created_at: string;
    updated_at: string;
  }

  interface Installer {
    id: number;
    name: string;
    contact_info?: string | null;
  }

  let orders = writable<Order[]>([]);
  let installers: Installer[] = [];
  let error = '';
  let loading = false;
  let showCreateForm = false;
  let showEditForm = false;
  let showInstallerForm = false;
  let orderToEdit: Order | null = null;

  let token: string | null = null;
  const unsubscribe = auth.subscribe(value => {
    token = value;
  });

  async function fetchOrders() {
    if (!token) return;
    loading = true;
    error = '';
    try {
      const response = await fetch(`${API_BASE}/orders/`, {
        headers: {
          'Content-Type': 'application/json',
          'token': token
        }
      });
      if (!response.ok) {
        const data = await response.json();
        error = data.detail || 'Failed to fetch orders';
        loading = false;
        return;
      }
      const data = await response.json();
      orders.set(data);
    } catch (e) {
      error = 'Network error';
    } finally {
      loading = false;
    }
  }

  async function fetchInstallers() {
    if (!token) return;
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
        return;
      }
      installers = await response.json();
    } catch (e) {
      error = 'Network error';
    }
  }

  async function createOrder(event: CustomEvent) {
    if (!token) return;
    error = '';
    loading = true;
    try {
      const response = await fetch(`${API_BASE}/orders/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify(event.detail)
      });
      if (!response.ok) {
        const data = await response.json();
        error = data.detail || 'Failed to create order';
        loading = false;
        return;
      }
      const createdOrder = await response.json();
      if (event.detail.installer_id) {
        const assignResponse = await fetch(`${API_BASE}/orders/${createdOrder.id}/assign_installer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': token
          },
          body: JSON.stringify({ installer_id: event.detail.installer_id })
        });
        if (!assignResponse.ok) {
          const assignData = await assignResponse.json();
          error = assignData.detail || 'Failed to assign installer';
          loading = false;
          return;
        }
      }
      await fetchOrders();
      showCreateForm = false;
    } catch (e) {
      error = 'Network error';
    } finally {
      loading = false;
    }
  }

  async function updateOrder(event: CustomEvent) {
    if (!token || !orderToEdit) return;
    error = '';
    loading = true;
    try {
      const response = await fetch(`${API_BASE}/orders/${orderToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify(event.detail)
      });
      if (!response.ok) {
        const data = await response.json();
        error = data.detail || 'Failed to update order';
        loading = false;
        return;
      }
      if (event.detail.installer_id !== orderToEdit.installer_id) {
        const assignResponse = await fetch(`${API_BASE}/orders/${orderToEdit.id}/assign_installer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': token
          },
          body: JSON.stringify({ installer_id: event.detail.installer_id })
        });
        if (!assignResponse.ok) {
          const assignData = await assignResponse.json();
          error = assignData.detail || 'Failed to assign installer';
          loading = false;
          return;
        }
      }
      if (event.detail.status && event.detail.status !== orderToEdit.status) {
        const statusResponse = await fetch(`${API_BASE}/orders/${orderToEdit.id}/change_status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': token
          },
          body: JSON.stringify({ status: event.detail.status })
        });
        if (!statusResponse.ok) {
          const statusData = await statusResponse.json();
          error = statusData.detail || 'Failed to change status';
          loading = false;
          return;
        }
      }
      await fetchOrders();
      showEditForm = false;
      orderToEdit = null;
    } catch (e) {
      error = 'Network error';
    } finally {
      loading = false;
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
      showInstallerForm = false;
    } catch (e) {
      error = 'Network error';
    } finally {
      loading = false;
    }
  }

  function logout() {
    auth.logout();
  }
  function navigateToInstallers() {
    goto('/installers');
  }

  function startEdit(order: Order) {
    orderToEdit = order;
    showEditForm = true;
    showCreateForm = false;
    showInstallerForm = false;
  }

  function cancelEdit() {
    orderToEdit = null;
    showEditForm = false;
  }

  onMount(() => {
    fetchOrders();
    fetchInstallers();
  });

  function getStatusName(status: string): string {
    if (status === 'in_progress') {
      return 'В процессе';
    }
    if (status === 'needs_rework') {
      return 'Нуждается в доработке';
    }
    if (status === 'completed') {
      return 'Выполнено';
    }
    return 'Неизвестно';
  }
  
</script>

<div class="max-w-6xl mx-auto mt-10 p-6 border rounded shadow">
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-xl font-bold">Заявки</h2>
    <div>
      <button on:click={() => showCreateForm = !showCreateForm} class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mr-2">
        {showCreateForm ? 'Отменить' : 'Создать заявку'}
      </button>

      <button on:click={navigateToInstallers} class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 mr-2">
        К списку монтажников
      </button>

      <button on:click={logout} class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Выйти</button>
    </div>
  </div>

  {#if showCreateForm}
    <OrderForm users={installers} on:submit={createOrder} />
  {/if}

  {#if showEditForm && orderToEdit}
    <OrderForm mode="edit" initialData={orderToEdit} users={installers} on:submit={updateOrder} />
  {/if}

  {#if showInstallerForm}
    <InstallerForm on:submit={createInstaller} />
  {/if}

  {#if loading}
    <p>Loading orders...</p>
  {:else if error}
    <p class="text-red-600">{error}</p>
  {:else}
    {#if $orders.length === 0}
      <p>No orders found.</p>
    {:else}
      <table class="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-300 px-2 py-1">ID</th>
            <th class="border border-gray-300 px-2 py-1">Адрес</th>
            <th class="border border-gray-300 px-2 py-1">Номер абонента</th>
            <th class="border border-gray-300 px-2 py-1">Контактные данные</th>
            <th class="border border-gray-300 px-2 py-1">Статус</th>
            <th class="border border-gray-300 px-2 py-1">Монтажник</th>
            <th class="border border-gray-300 px-2 py-1">Создано</th>
            <th class="border border-gray-300 px-2 py-1">Обновлено</th>
            <th class="border border-gray-300 px-2 py-1">Действия</th>
          </tr>
        </thead>
        <tbody>
          {#each $orders as order}
            <tr>
              <td class="border border-gray-300 px-2 py-1">{order.id}</td>
              <td class="border border-gray-300 px-2 py-1">{order.address}</td>
              <td class="border border-gray-300 px-2 py-1">{order.account_number}</td>
              <td class="border border-gray-300 px-2 py-1">{order.contact_details}</td>
              <td class="border border-gray-300 px-2 py-1">{
                getStatusName(order.status)
                }</td>
              <td class="border border-gray-300 px-2 py-1">
                {#if order.installer_id !== null}
                  {#each installers as installer (installer.id)}
                    {#if installer.id === order.installer_id}
                      {installer.name}
                    {/if}
                  {/each}
                {:else}
                  -
                {/if}
              </td>
              <td class="border border-gray-300 px-2 py-1">{new Date(order.created_at).toLocaleString()}</td>
              <td class="border border-gray-300 px-2 py-1">{new Date(order.updated_at).toLocaleString()}</td>
                <td class="border border-gray-300 px-2 py-1">
                  <button on:click={() => startEdit(order)} class="w-full mt-2 bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2">
                    Редактировать
                  </button>
                  <button on:click={() => goto(`/orders/${order.id}/comments`)} class="w-full my-2 bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">
                    Комментарии
                  </button>
                </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  {/if}
</div>