import { useEffect, useState, useCallback } from "react";
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
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user || !animal?.animal_id) {
      setIsCollected(false);
      return;
    }
    const collectsRef = ref(db, `users/${user.uid}/collects`);
    const unsubscribe = onValue(collectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setIsCollected(Object.values(data).some((item: any) => item.animal_id === animal.animal_id));
      } else {
        setIsCollected(false);
      }
    });
    return () => unsubscribe();
  }, [animal]);

  const toggleFavorite = useCallback(async (): Promise<boolean> => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return false;
    try {
      const collectsRef = ref(db, `users/${user.uid}/collects`);
      if (!isCollected) {
        const snapshot = await get(collectsRef);
        const collects = snapshot.val() || {};
        const exists = Object.values(collects).some((item: any) => item.animal_id === animal?.animal_id);
        if (exists) return true;
        const newCollectRef = push(collectsRef);
        await set(newCollectRef, animal);
      } else {
        const q = query(collectsRef, orderByChild("animal_id"), equalTo(animal?.animal_id));
        const snapshot = await get(q);
        if (snapshot.exists()) {
          const removePromises: Promise<any>[] = [];
          snapshot.forEach((child: any) => {
            removePromises.push(remove(ref(db, `users/${user.uid}/collects/${child.key}`)));
          });
          await Promise.all(removePromises);
        }
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }, [animal, isCollected]);

  return { isCollected, toggleFavorite, isLoggedIn };
}
