import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase";
import { ref, get, remove } from "firebase/database";

/**
 * 同步收藏清單與 API 資料
 * 當 API 回傳的動物資料有變動時，會自動檢查使用者收藏清單，
 * 若發現收藏中有已不存在於 API 的動物，則自動從 Firebase 收藏中移除。
 *
 * @param {Array} animals - 目前 API 回傳的動物清單（每個物件需有 animal_id）
 * @param {boolean} isLoading - API 是否正在載入中
 */
export function useSyncFavoritesWithAPI(animals, isLoading = false) {
  useEffect(() => {
    // 取得目前登入的使用者
    const auth = getAuth();
    const user = auth.currentUser;

    // 若未登入、正在載入、animals 非陣列或為空，則不執行同步
    if (!user || isLoading || !Array.isArray(animals) || animals.length === 0) {
      return;
    }

    /**
     * 執行同步邏輯
     * 1. 取得使用者收藏清單
     * 2. 建立 API animal_id 的集合
     * 3. 檢查收藏清單中每一筆，若 animal_id 不在 API 清單中，則從收藏移除
     */
    const syncFavorites = async () => {
      try {
        // 取得使用者收藏清單的資料庫參考
        const collectsRef = ref(db, `users/${user.uid}/collects`);
        // 取得收藏清單的快照
        const snapshot = await get(collectsRef);
        // 取得收藏清單物件（key: 收藏ID, value: 動物物件）
        const collects = snapshot.val() || {};
        
        // 如果沒有收藏，直接返回
        if (Object.keys(collects).length === 0) {
          console.log('No favorites to sync');
          return;
        }
        
        // 建立 API animal_id 的集合，方便比對
        const apiAnimalIds = new Set(animals.map(a => a.animal_id));
        console.log('API animals count:', animals.length);
        console.log('User favorites count:', Object.keys(collects).length);
        
        // 檢查每一筆收藏
        const removePromises = [];
        Object.entries(collects).forEach(([key, item]) => {
          // 若該 animal_id 不存在於 API，則移除
          if (!apiAnimalIds.has(item.animal_id)) {
            console.log(`Removing outdated favorite: ${item.animal_id}`);
            // 不存在於 API，從收藏移除
            removePromises.push(remove(ref(db, `users/${user.uid}/collects/${key}`)));
          }
        });
        
        // 等待所有移除操作完成
        if (removePromises.length > 0) {
          await Promise.all(removePromises);
          console.log(`Removed ${removePromises.length} outdated favorites`);
        } else {
          console.log('All favorites are up to date');
        }
      } catch (error) {
        console.error('Error syncing favorites:', error);
      }
    };

    // 執行同步
    syncFavorites();
  }, [animals, isLoading]);
}