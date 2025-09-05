/**
 * 使用者收藏頁面
 *
 * 此頁面提供使用者收藏動物的管理功能，包括：
 * 1. 顯示使用者收藏的所有動物
 * 2. 即時同步收藏清單與 API 資料
 * 3. 自動移除已不存在的動物收藏
 * 4. 處理未登入狀態的顯示
 * 5. 載入狀態管理
 *
 * 資料同步機制：
 * - 進入頁面時強制刷新 API 資料
 * - 比對收藏清單與 API 資料的一致性
 * - 自動清理無效的收藏項目
 */

import AnimalCard from "../components/AnimalCard";
import { useUserCollects } from "../hooks/useUserCollects";
import useAuthStore from "../stores/useAuthStore";
import { useFetchAnimals } from "../hooks/useFetchAnimals";
import { useSyncFavoritesWithAPI } from "../hooks/useSyncFavoritesWithAPI";
import { useEffect, useRef } from "react";

/**
 * 收藏頁面主元件
 *
 * 功能流程：
 * 1. 檢查使用者登入狀態
 * 2. 取得使用者收藏清單
 * 3. 取得最新的 API 動物資料
 * 4. 同步收藏清單與 API 資料
 * 5. 過濾並顯示有效的收藏項目
 *
 * @returns {JSX.Element} 收藏頁面元件
 */
export default function Collect() {
  // === Hook 調用區域 ===

  /** 取得使用者登入狀態 */
  const { isLoggedIn } = useAuthStore();

  /**
   * 取得使用者收藏清單
   * collects: 收藏的動物陣列
   * loading: 收藏資料載入狀態
   */
  const { collects, loading } = useUserCollects();

  /**
   * 取得 API 動物資料
   * animals: 所有動物資料陣列
   * loading: API 資料載入狀態（重新命名為 animalsLoading）
   * refetch: 強制重新取得資料的函數
   */
  const { animals, loading: animalsLoading, refetch } = useFetchAnimals();

  /**
   * 追蹤是否已執行過強制刷新
   * 使用 useRef 確保在元件重新渲染時保持狀態
   * 防止重複執行 refetch 造成不必要的 API 請求
   */
  const hasRefetched = useRef(false);

  // === 副作用處理區域 ===

  /**
   * 進入收藏頁面時的資料同步處理
   *
   * 目的：
   * - 確保收藏頁面顯示的是最新的 API 資料
   * - 避免顯示已被刪除的動物收藏
   *
   * 執行條件：
   * - 使用者已登入
   * - 尚未執行過強制刷新
   *
   * 執行邏輯：
   * 1. 標記已執行過刷新（防止重複執行）
   * 2. 調用 refetch 函數重新取得最新資料
   */
  useEffect(() => {
    if (isLoggedIn && !hasRefetched.current) {
      hasRefetched.current = true;
      refetch();
    }
  }, [isLoggedIn, refetch]);

  /**
   * 收藏清單與 API 資料同步
   *
   * 使用自訂 Hook 自動處理：
   * - 比對收藏清單中的動物 ID 與 API 資料
   * - 移除 API 中已不存在的收藏項目
   * - 保持收藏清單的準確性
   */
  useSyncFavoritesWithAPI(animals, animalsLoading);

  // === 資料處理區域 ===

  /**
   * 有效收藏清單過濾
   *
   * 篩選邏輯：
   * 1. 確保 collects 存在且為陣列
   * 2. 使用 filter 方法篩選收藏項目
   * 3. 使用 some 方法檢查每個收藏是否在 API 資料中存在
   * 4. 只保留 API 中仍存在的動物收藏
   *
   * 容錯處理：
   * - 如果 collects 為 null/undefined，回傳空陣列
   * - 防止後續的 map 操作出錯
   */
  const validCollects =
    collects?.filter((c) => animals.some((a) => a.animal_id === c.animal_id)) ||
    [];

  // === 條件式渲染區域 ===

  /**
   * 未登入狀態處理
   *
   * 顯示內容：
   * - 頁面標題
   * - 登入提示訊息
   * - 置中佈局，適合各種螢幕尺寸
   */
  if (!isLoggedIn) {
    return (
      <div className="w-full mx-auto flex flex-col items-center mt-10 h-screen justify-center">
        <h2 className="text-2xl font-bold mb-4 text-center">我的收藏</h2>
        <div className="text-center">請先登入</div>
      </div>
    );
  }

  // === 主要內容渲染 ===

  return (
    <div className="w-full mx-auto h-screen justify-center mt-10">
      {/* 頁面標題 */}
      <h2 className="text-2xl font-bold mb-4 text-center sm:mt-5">我的收藏</h2>

      {/* 根據載入狀態和資料狀況顯示不同內容 */}
      {loading || animalsLoading ? (
        /* 載入中狀態：顯示載入動畫 */
        <div className="flex justify-center items-center h-40">
          <span className="loading loading-infinity loading-xl"></span>
        </div>
      ) : validCollects.length === 0 ? (
        /* 空收藏狀態：顯示提示訊息 */
        <div className="text-center">尚未收藏任何毛孩</div>
      ) : (
        /* 有收藏內容：顯示動物卡片列表 */
        <div className="flex flex-wrap justify-center items-center pb-20 sm:pb-8">
          {/* 
            遍歷有效收藏清單，為每隻動物產生卡片
            
            props 說明：
            - key: 使用 id 或 animal_id 作為 React key
            - animal: 動物資料物件
            - isCollected: 固定為 true（因為這是收藏頁面）
            - from: 標識來源為收藏頁面，影響卡片行為
          */}
          {validCollects.map((animal) => (
            <AnimalCard
              key={animal.id || animal.animal_id}
              animal={animal}
              isCollected={true}
              from="collect"
            />
          ))}
        </div>
      )}
    </div>
  );
}
