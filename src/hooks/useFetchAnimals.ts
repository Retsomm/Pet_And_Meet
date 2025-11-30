import { useState, useEffect, useCallback } from "react";
import { openDB } from "idb";
import type { Animal, UseFetchAnimalsResult } from "../types";

const API_URL = "https://us-central1-animal-adoption-vite-app.cloudfunctions.net/api/animals";
const DB_NAME = "animal-cache";
const STORE_NAME = "animals";
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24h

async function getCache(): Promise<{ cache: any; expire: string | undefined }> {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME);
    },
  });
  const cache = await db.get(STORE_NAME, "data");
  const expire = await db.get(STORE_NAME, "expire");
  return { cache, expire };
}

async function setCache(data: any, expire: string) {
  const db = await openDB(DB_NAME, 1);
  await db.put(STORE_NAME, data, "data");
  await db.put(STORE_NAME, expire, "expire");
}

export function useFetchAnimals(): UseFetchAnimalsResult {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [forceRefresh, setForceRefresh] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAnimals = async () => {
      try {
        const { cache, expire } = await getCache();
        const now = Date.now();

        if (cache && expire && now < Number(expire) && forceRefresh === 0) {
          setAnimals(cache);
          setLoading(false);
          return;
        }

        const response = await fetch(API_URL, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();

        await setCache(data, String(now + CACHE_DURATION));
        setAnimals(data);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err);
          console.error("Fetch error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();

    return () => controller.abort();
  }, [forceRefresh]);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    setForceRefresh((prev) => prev + 1);
  }, []);

  return { animals, loading, error, refetch };
}
