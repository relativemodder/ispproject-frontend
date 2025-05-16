<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { auth } from '$lib/stores/auth';
  import { get } from 'svelte/store';
  import { API_BASE } from '$lib/constants';

  let comments: { id: number; text: string; created_at: string }[] = [];
  let loading = false;
  let error = '';
  let newCommentText = '';

  let token: string | null = null;
  auth.subscribe(value => {
    token = value;
  });

  let orderId: number | null = null;
  $: orderId = Number(get(page).params.order_id);

  async function fetchComments() {
    if (!token || !orderId) return;
    loading = true;
    error = '';
    try {
      const response = await fetch(`${API_BASE}/orders/${orderId}/comments`, {
        headers: {
          'Content-Type': 'application/json',
          'token': token
        }
      });
      if (!response.ok) {
        const data = await response.json();
        error = data.detail || 'Failed to fetch comments';
        loading = false;
        return;
      }
      comments = await response.json();
    } catch (e) {
      error = 'Network error';
    } finally {
      loading = false;
    }
  }

  async function addComment() {
    if (!token || !orderId || !newCommentText.trim()) return;
    loading = true;
    error = '';
    try {
      const response = await fetch(`${API_BASE}/orders/${orderId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify({ text: newCommentText.trim() })
      });
      if (!response.ok) {
        const data = await response.json();
        error = data.detail || 'Failed to add comment';
        loading = false;
        return;
      }
      newCommentText = '';
      await fetchComments();
    } catch (e) {
      error = 'Network error';
    } finally {
      loading = false;
    }
  }

  function goBack() {
    history.back();
  }

  onMount(() => {
    fetchComments();
  });
</script>

<svelte:head>
  <title>Комментарии | Провайдер</title>
</svelte:head>

<div class="max-w-2xl mx-auto p-4 rounded shadow mt-6">
  <button on:click={goBack} class="mb-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded">
    &larr; Назад
  </button>
  <h2 class="text-xl font-bold mb-4">Комментарии к заявке #{orderId}</h2>

  {#if error}
    <p class="text-red-600 mb-2">{error}</p>
  {/if}

  <form on:submit|preventDefault={addComment} class="mb-4">
    <textarea
      bind:value={newCommentText}
      placeholder="Напишите комментарий..."
      rows="3"
      class="w-full border rounded p-2 mb-2"
      required
    ></textarea>
    <button
      type="submit"
      class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      disabled={loading}
    >
      {loading ? 'Добавление...' : 'Оставить комментарий'}
    </button>
  </form>

  {#if loading && comments.length === 0}
    <p>Загрузка комментариев...</p>
  {:else if comments.length === 0}
    <p class="opacity-50">Нет комментариев</p>
  {:else}
    <ul class="space-y-4">
      {#each comments as comment}
        <li class="border border-gray-300 rounded p-3">
          <p>{comment.text}</p>
          <p class="text-xs text-gray-500 mt-1">{new Date(comment.created_at).toLocaleString()}</p>
        </li>
      {/each}
    </ul>
  {/if}
</div>