import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase";
import type { Animal, UseUserCollectsResult } from "../types";

export function useUserCollects(): UseUserCollectsResult {
  // Initialize based on current auth state to avoid calling setState
  // synchronously inside an effect when there's no user.
  const initialUser = getAuth().currentUser;
  const [collects, setCollects] = useState<(Animal & { id?: string })[] | null>(
    () => (initialUser ? null : [])
  );
  const [loading, setLoading] = useState(() => (initialUser ? true : false));

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      // No user — nothing to subscribe to. We avoid calling setState here
      // synchronously because the initial state already reflects the
      // unauthenticated value.
      return;
    }

    const collectsRef = ref(db, `users/${user.uid}/collects`);
    const unsubscribe = onValue(collectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const entries = Object.values(data) as unknown[];
        const collectsWithId = entries.map((entry) => {
          const item = entry as Animal & { id?: string };
          return { ...item, id: item.animal_id } as Animal & { id?: string };
        });
        setCollects(collectsWithId);
      } else {
        setCollects([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { collects, loading };
}
