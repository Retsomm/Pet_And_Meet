import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../firebase";
import { ref, onValue, query, orderByChild, equalTo, get, remove, push, set } from "firebase/database";
import type { Animal, UseFavoriteResult } from "../types";

export function useFavorite(animal?: Animal): UseFavoriteResult {
  const [isCollected, setIsCollected] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      // If the user logged out, ensure collected state is reset. This
      // happens asynchronously inside the onAuthStateChanged callback
      // which is fine and does not trigger the "setState in effect"
      // lint warning.
      if (!user) setIsCollected(false);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    // Avoid calling setState synchronously in the effect body. If there's
    // no user or no animal id, we'll simply return early; the initial state
    // already defaults to false and the auth change handler above will
    // reset `isCollected` when the user logs out.
    if (!user || !animal?.animal_id) {
      return;
    }
    const collectsRef = ref(db, `users/${user.uid}/collects`);
    const unsubscribe = onValue(collectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const entries = Object.values(data) as unknown[];
        setIsCollected(entries.some((entry) => (entry as Record<string, unknown>)['animal_id'] === animal.animal_id));
      } else {
        setIsCollected(false);
      }
    });
    return () => unsubscribe();
  }, [animal]);

  async function toggleFavorite(): Promise<boolean> {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return false;
    try {
      const collectsRef = ref(db, `users/${user.uid}/collects`);
      if (!isCollected) {
        const snapshot = await get(collectsRef);
        const collects = snapshot.val() || {};
        const entries = Object.values(collects) as unknown[];
        const exists = entries.some((entry) => (entry as Record<string, unknown>)['animal_id'] === animal?.animal_id);
        if (exists) return true;
        const newCollectRef = push(collectsRef);
        await set(newCollectRef, animal);
      } else {
        const q = query(collectsRef, orderByChild("animal_id"), equalTo(animal?.animal_id));
        const snapshot = await get(q);
        if (snapshot.exists()) {
          const removePromises: Promise<unknown>[] = [];
          snapshot.forEach((child) => {
            const key = (child as { key?: string }).key;
            if (key) removePromises.push(remove(ref(db, `users/${user.uid}/collects/${key}`)));
          });
          await Promise.all(removePromises);
        }
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  return { isCollected, toggleFavorite, isLoggedIn };
}
