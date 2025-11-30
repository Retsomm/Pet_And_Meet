/**
 * 動物卡片元件
 *
 * 此元件負責顯示單隻動物的基本資訊，提供互動功能包括：
 * 1. 動物基本資訊展示（圖片、品種、地區、性別、顏色、體型）
 * 2. 收藏功能（加入/移除收藏）
 * 3. 詳細資料查看導航
 * 4. 圖片載入錯誤處理
 * 5. 使用者體驗優化（loading lazy、響應式設計）
 *
 * 使用情境：
 * - 動物資料列表頁面
 * - 使用者收藏頁面
 * - 搜尋結果頁面
 */

import React from "react";
import { useNavigate } from "react-router";
import { useFavorite } from "../hooks/useFavorite";
import useToastStore from "../stores/useToastStore";

/**
 * 性別代碼對照表
 * 將 API 回傳的英文代碼轉換為使用者友善的中文顯示
 *
 * 對照關係：
 * - M: Male（雄性） → 公
 * - F: Female（雌性） → 母
 * - N: Unknown（未知） → 未知
 */
const sexDisplay = {
  M: "公",
  F: "母",
  N: "未知",
};

/**
 * 體型代碼對照表
 * 將 API 回傳的英文體型代碼轉換為中文顯示
 *
 * 對照關係：
 * - SMALL: 小型動物
 * - MEDIUM: 中型動物
 * - BIG: 大型動物
 */
const bodySize = {
  SMALL: "小型",
  MEDIUM: "中型",
  BIG: "大型",
};

/**
 * 動物卡片主元件
 *
 * 功能特點：
 * - 使用 React.memo 進行效能優化，避免不必要的重新渲染
 * - 整合多個 Hook 來管理收藏狀態、路由導航、通知訊息
 * - 提供圖片載入錯誤處理機制
 * - 響應式設計，適應不同螢幕尺寸
 *
 * @param {Object} props - 元件屬性
 * @param {Object} props.animal - 動物資料物件
 * @param {string} props.animal.animal_id - 動物唯一識別碼
 * @param {string} props.animal.album_file - 動物圖片 URL
 * @param {string} props.animal.animal_Variety - 動物品種
 * @param {string} props.animal.animal_place - 動物所在地區
 * @param {string} props.animal.animal_sex - 動物性別代碼（M/F/N）
 * @param {string} props.animal.animal_colour - 動物顏色
 * @param {string} props.animal.animal_bodytype - 動物體型代碼
 * @param {string} props.from - 來源頁面標識，預設為 "data"
 * @returns {JSX.Element} 動物卡片元件
 */
const AnimalCard = React.memo(({ animal, from = "data" }) => {
  // === Hook 調用區域 ===

  /**
   * 收藏功能 Hook
   * 提供收藏狀態查詢、收藏切換功能、登入狀態檢查
   */
  const { isCollected, toggleFavorite, isLoggedIn } = useFavorite(animal);

  /** 路由導航 Hook，用於頁面跳轉 */
  const navigate = useNavigate();

  /** Toast 通知 Hook，用於顯示操作結果訊息 */
  const { showSuccess, showError } = useToastStore();

  // === 事件處理函數區域 ===

  /**
   * 圖片載入失敗處理函數
   *
   * 當動物圖片載入失敗時：
   * 1. 移除 onerror 事件監聽器（防止無限循環）
   * 2. 設定預設圖片作為備用顯示
   *
   * @param {Event} e - 圖片載入錯誤事件
   */
  const handleImageError = (e) => {
    e.target.onerror = null; // 防止無限錯誤循環
    e.target.src = "/default.webp"; // 設定預設圖片
  };

  /**
   * 詳細資料按鈕點擊處理函數
   *
   * 功能：
   * - 導航到動物詳細資料頁面
   * - 傳遞來源頁面資訊，方便返回導航
   * - 使用動物 ID 作為路由參數
   */
  const handleDetailClick = () => {
    navigate(`/animal/${animal.animal_id}`, {
      state: { from }, // 傳遞來源頁面資訊
    });
  };

  // === JSX 渲染區域 ===

  return (
    // 動物卡片主容器：使用 DaisyUI 的 card 樣式，固定寬度與陰影效果
    <div className="card bg-base-100 w-96 shadow-xl gap-3 m-3 relative min-h-60">
      {/* 動物卡片主要內容區塊：使用 flex 佈局分為圖片和資訊兩個區域 */}
      <div className="flex min-h-60 w-96">
        {/* === 動物圖片區塊 === */}
        <figure className="w-1/2 flex-shrink-0 aspect-square">
          <img
            src={animal.album_file} // 動物圖片 URL
            alt={animal.animal_Variety} // 使用品種作為替代文字
            className="w-full h-full" // 填滿容器
            loading="lazy" // 延遲載入優化效能
            onError={handleImageError} // 圖片載入錯誤處理
          />
        </figure>

        {/* === 動物資訊區塊 === */}
        <div className="card-body w-1/2 p-4 overflow-hidden">
          {/* 動物品種標題 */}
          <h2 className="card-title truncate">{animal.animal_Variety}</h2>

          {/* 動物基本資訊清單 */}
          {/* 地區資訊：使用 slice(0, 3) 只顯示前三個字元，節省空間 */}
          <p className="truncate">地區：{animal.animal_place?.slice(0, 3)}</p>

          {/* 性別資訊：使用對照表轉換為中文顯示 */}
          <p>性別：{sexDisplay[animal.animal_sex]}</p>

          {/* 顏色資訊 */}
          <p>顏色：{animal.animal_colour}</p>

          {/* 體型資訊：使用對照表轉換為中文顯示 */}
          <p>體型：{bodySize[animal.animal_bodytype]}</p>

          {/* === 操作按鈕區塊 === */}
          <div className="card-actions justify-end mt-2 flex-nowrap">
            {/* 收藏按鈕 */}
            <button
              className="btn btn-ghost btn-sm"
              disabled={!isLoggedIn} // 未登入時禁用按鈕
              onClick={async () => {
                // 登入狀態檢查
                if (!isLoggedIn) {
                  showError("請先登入才能收藏");
                  return;
                }

                try {
                  /**
                   * 收藏狀態切換邏輯
                   *
                   * 注意：需要在執行 toggleFavorite 前記錄當前狀態
                   * 因為 toggleFavorite 執行後 isCollected 會立即改變
                   */
                  const wasCollected = isCollected;
                  const result = await toggleFavorite();

                  // 處理切換結果
                  if (result === false) {
                    showError("請先登入才能收藏");
                  } else {
                    // 根據操作前的狀態顯示對應的成功訊息
                    showSuccess(wasCollected ? "已取消收藏" : "已收藏");
                  }
                } catch (error) {
                  // 錯誤處理：記錄錯誤並顯示使用者友善的訊息
                  console.error("收藏操作失敗:", error);
                  showError("操作失敗，請稍後再試");
                }
              }}
              aria-label={isCollected ? "已收藏" : "收藏"} // 無障礙標籤
            >
              {/* 
                愛心圖示 SVG
                - 根據收藏狀態切換填充樣式
                - 已收藏：填充愛心
                - 未收藏：空心愛心
              */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={isCollected ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            </button>

            {/* 詳細資料按鈕 */}
            <button
              className="btn btn-primary btn-sm"
              onClick={handleDetailClick}
            >
              詳細資料
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

/**
 * 使用 React.memo 包裝元件進行效能優化
 *
 * 優化效果：
 * - 當 props 沒有改變時，避免重新渲染元件
 * - 在大量動物卡片的列表中特別有效
 * - 減少不必要的 DOM 操作和計算
 *
 * memo 比較邏輯：
 * - 淺層比較 props 物件的每個屬性
 * - animal 物件和 from 字串都會被比較
 * - 只有當這些值真正改變時才會重新渲染
 */
export default React.memo(AnimalCard);
