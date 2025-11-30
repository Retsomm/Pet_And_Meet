import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase";
import { ref, get, remove } from "firebase/database";
import type { Animal } from "../types";

export function useSyncFavoritesWithAPI(animals: Animal[], isLoading = false) {
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user || isLoading || !Array.isArray(animals) || animals.length === 0) return;

    const syncFavorites = async () => {
      try {
        const collectsRef = ref(db, `users/${user.uid}/collects`);
        const snapshot = await get(collectsRef);
        const collects = snapshot.val() || {};

        if (Object.keys(collects).length === 0) {
          console.log("No favorites to sync");
          return;
        }

        const apiAnimalIds = new Set(animals.map((a) => a.animal_id));
        console.log("API animals count:", animals.length);
        console.log("User favorites count:", Object.keys(collects).length);

        const removePromises: Promise<unknown>[] = [];
        Object.entries(collects).forEach(([key, item]) => {
          const entry = item as Record<string, unknown>;
          const animalId = entry['animal_id'] as string | number | undefined;
          if (animalId !== undefined && !apiAnimalIds.has(animalId)) {
            console.log(`Removing outdated favorite: ${animalId}`);
            removePromises.push(remove(ref(db, `users/${user.uid}/collects/${key}`)));
          }
        });

        if (removePromises.length > 0) {
          await Promise.all(removePromises);
          console.log(`Removed ${removePromises.length} outdated favorites`);
        } else {
          console.log("All favorites are up to date");
        }
      } catch (error) {
        console.error("Error syncing favorites:", error);
      }
    };

    syncFavorites();
  }, [animals, isLoading]);
}
