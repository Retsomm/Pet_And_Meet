import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase";

/**
 * React Hook：取得目前登入使用者的收藏清單
 * 會即時監聽 Firebase Database 中該使用者的收藏資料
 * @returns {Object} { collects, loading }
 *   - collects: 收藏的動物陣列（每個物件含 animal_id 與 id）
 *   - loading: 是否正在載入中
 */
export function useUserCollects() {
  // 收藏清單狀態，預設為 null
  const [collects, setCollects] = useState(null); 
  // 載入狀態
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 取得 Firebase Auth 實例
    const auth = getAuth();
    // 取得目前登入的使用者
    const user = auth.currentUser;
    // 若未登入，直接回傳空陣列並結束 loading
    if (!user) {
      setCollects([]);
      setLoading(false);
      return;
    }

    // 取得該使用者收藏清單的資料庫參考
    const collectsRef = ref(db, `users/${user.uid}/collects`);
    // 監聽收藏清單資料變化
    const unsubscribe = onValue(collectsRef, (snapshot) => {
      // 取得快照資料
      const data = snapshot.val();
      if (data) {
        // 將每筆收藏轉為陣列，並補上 id 欄位（等同 animal_id）
        const collectsWithId = Object.values(data).map(item => ({
          ...item,
          id: item.animal_id,
        }));
        setCollects(collectsWithId);
      } else {
        // 若無資料，設為空陣列
        setCollects([]);
      }
      // 結束 loading 狀態
      setLoading(false);
    });

    // 卸載時移除監聽
    return () => unsubscribe();
  }, []);

  // 回傳收藏清單與 loading 狀態
  return { collects, loading };
}