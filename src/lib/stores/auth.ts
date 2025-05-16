import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const TOKEN_KEY = 'auth_token';

function createAuthStore() {
  let storedToken: string | null = null;
  if (browser) {
    storedToken = localStorage.getItem(TOKEN_KEY);
  }
  const { subscribe, set } = writable<string | null>(storedToken);

  return {
    subscribe,
    login: (token: string) => {
      if (browser) {
        localStorage.setItem(TOKEN_KEY, token);
      }
      set(token);
    },
    logout: () => {
      if (browser) {
        localStorage.removeItem(TOKEN_KEY);
      }
      set(null);
    }
  };
}

export const auth = createAuthStore();
