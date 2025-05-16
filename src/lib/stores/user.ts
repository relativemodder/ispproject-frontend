import { writable } from 'svelte/store';

export interface User {
  username: string;
  role: string;
}

const defaultUser: User = {
  username: '',
  role: ''
};

export const user = writable<User>(defaultUser);
