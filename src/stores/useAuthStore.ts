import { create } from "zustand";
import { openDB } from "idb";
import type { StateCreator } from "zustand";

const DB_NAME = "auth-db";
const STORE_NAME = "auth";
const USER_KEY = "user";

async function getUserFromIDB(): Promise<any | undefined> {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME);
    },
  });
  return await db.get(STORE_NAME, USER_KEY);
}

async function setUserToIDB(user: any) {
  const db = await openDB(DB_NAME, 1);
  await db.put(STORE_NAME, user, USER_KEY);
}

async function removeUserFromIDB() {
  const db = await openDB(DB_NAME, 1);
  await db.delete(STORE_NAME, USER_KEY);
}

interface AuthState {
  isLoggedIn: boolean;
  user: any | null;
  isLoading: boolean;
  init: () => Promise<void>;
  login: (user: any) => Promise<void>;
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  isLoading: true,
  init: async () => {
    set({ isLoading: true });
    const user = await getUserFromIDB();
    set({ isLoggedIn: !!user, user: user || null, isLoading: false });
  },
  login: async (user) => {
    await setUserToIDB(user);
    set({ isLoggedIn: true, user });
  },
  logout: async () => {
    await removeUserFromIDB();
    set({ isLoggedIn: false, user: null });
  },
}));

export default useAuthStore;
