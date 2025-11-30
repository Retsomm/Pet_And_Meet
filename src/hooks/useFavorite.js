// 取得單一動物的收藏狀態與切換功能
import { useEffect, useState, useCallback } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../firebase";
import { ref, onValue, query, orderByChild, equalTo, get, remove, push, set } from "firebase/database";
/**
 * useFavorite
 * 管理單一動物的收藏狀態與切換收藏功能
 * @param {Object} animal - 需包含 animal_id 屬性的動物物件
 * @returns {Object} { isCollected, toggleFavorite, isLoggedIn }
 */
export function useFavorite(animal) {
  // isCollected: 是否已收藏該動物
  const [isCollected, setIsCollected] = useState(false);
  // isLoggedIn: 使用者是否已登入
  const [isLoggedIn, setIsLoggedIn] = useState(false);
// 監聽 Firebase Auth 狀態，更新登入狀態
useEffect(() => {
    const auth = getAuth();
    // 註冊登入狀態監聽
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // 有 user 則為已登入
    });
    // 卸載時移除監聽
    return () => unsubscribeAuth();
  }, []);

  // 監聽收藏狀態變化
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    // 若未登入或無 animal_id，直接設為未收藏
    if (!user || !animal?.animal_id) {
      setIsCollected(false);
      return;
    }
    // 取得該使用者的收藏清單
    const collectsRef = ref(db, `users/${user.uid}/collects`);
    // 監聽收藏清單變化
    const unsubscribe = onValue(collectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // 檢查收藏清單中是否有該 animal_id
        setIsCollected(Object.values(data).some(item => item.animal_id === animal.animal_id));
      } else {
        setIsCollected(false);
      }
    });
    // 卸載時移除監聽
    return () => unsubscribe();
  // 若 animal 物件其他屬性變動也需觸發，請改為 [animal]
  }, [animal]);

  /**
   * 切換收藏狀態
   * 若未收藏則加入收藏，已收藏則移除
   */
  const toggleFavorite = useCallback(async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return; // 未登入不執行
    try {

    const collectsRef = ref(db, `users/${user.uid}/collects`);
    if (!isCollected) {
      // 尚未收藏，先檢查是否已存在
      const snapshot = await get(collectsRef);
      const collects = snapshot.val() || {};
      const exists = Object.values(collects).some(
        (item) => item.animal_id === animal.animal_id
      );
      if (exists) return; // 已存在就不再加入
      // 新增收藏
      const newCollectRef = push(collectsRef);
      await set(newCollectRef, animal);
    } else {
      // 已收藏，移除該 animal_id 的收藏
      const q = query(collectsRef, orderByChild("animal_id"), equalTo(animal.animal_id));
      const snapshot = await get(q);
      if (snapshot.exists()) {
        const removePromises = [];
        snapshot.forEach(child => {
          removePromises.push(remove(ref(db, `users/${user.uid}/collects/${child.key}`)));
        });
        await Promise.all(removePromises);
      }
    }
    } catch (error){
      console.error(error);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // animal 與 isCollected 已在依賴陣列，避免因 showError 或其他未變動的外部依賴導致不必要的 re-render
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animal, isCollected]);

  // 回傳收藏狀態、切換函式、登入狀態
  return { isCollected, toggleFavorite, isLoggedIn };
}
