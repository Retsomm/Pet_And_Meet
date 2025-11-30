import { useState, useEffect, useCallback } from "react";
import { openDB } from "idb";

// API 端點
const API_URL = "https://us-central1-animal-adoption-vite-app.cloudfunctions.net/api/animals";
// IndexedDB 資料庫名稱
const DB_NAME = "animal-cache";
// IndexedDB store 名稱
const STORE_NAME = "animals";
// 快取有效時間（24 小時，單位：毫秒）
const CACHE_DURATION = 1000 * 60 * 60 * 24;

/**
 * 從 IndexedDB 取得快取資料與過期時間
 * @returns {Promise<{cache: any, expire: string}>}
 */
async function getCache() {
  // 開啟（或建立）資料庫
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      // 若第一次建立則新增 store
      db.createObjectStore(STORE_NAME);
    },
  });
  // 取得快取資料與過期時間
  const cache = await db.get(STORE_NAME, "data");
  const expire = await db.get(STORE_NAME, "expire");
  return { cache, expire };
}

/**
 * 將資料與過期時間寫入 IndexedDB
 * @param {any} data - 要快取的資料
 * @param {string} expire - 過期時間（timestamp 字串）
 */
async function setCache(data, expire) {
  const db = await openDB(DB_NAME, 1);
  await db.put(STORE_NAME, data, "data");
  await db.put(STORE_NAME, expire, "expire");
}

/**
 * React Hook：取得動物資料，支援快取
 * @returns {Object} { animals, loading, error, refetch }
 */
export function useFetchAnimals() {
  // 動物資料狀態
  const [animals, setAnimals] = useState([]);
  // 載入狀態
  const [loading, setLoading] = useState(true);
  // 錯誤狀態
  const [error, setError] = useState(null);
  // 強制刷新觸發器
  const [forceRefresh, setForceRefresh] = useState(0);

  useEffect(() => {
    // 建立 AbortController 以便中止 fetch
    const controller = new AbortController();

    /**
     * 取得動物資料主流程
     */
    const fetchAnimals = async () => {
      try {
        // 先檢查 IndexedDB 是否有快取且未過期（除非強制刷新）
        const { cache, expire } = await getCache();
        const now = Date.now();

        // 若快取存在且未過期，且非強制刷新，直接使用快取
        if (cache && expire && now < Number(expire) && forceRefresh === 0) {
          setAnimals(cache);
          setLoading(false);
          return;
        }

        // 否則從 API 取得資料
        const response = await fetch(API_URL, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const data = await response.json();

        // 將資料與新的過期時間寫入快取
        await setCache(data, String(now + CACHE_DURATION));
        setAnimals(data);
      } catch (err) {
        // 若不是因為 abort，才記錄錯誤
        if (err.name !== "AbortError") {
          setError(err);
          console.error("Fetch error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    // 執行資料取得
    fetchAnimals();

    // 組件卸載時中止 fetch
    return () => {
      controller.abort();
    };
  }, [forceRefresh]);

  // 強制刷新函數 - 使用 useCallback 避免無限循環
  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    setForceRefresh(prev => prev + 1);
  }, []);

  // 回傳動物資料、載入狀態、錯誤、刷新函數
  return { animals, loading, error, refetch };
}