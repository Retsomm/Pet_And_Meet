/**
 * 主題切換狀態管理 Store
 * 
 * 使用 Zustand 管理應用程式的主題狀態
 * 支援在兩種主題間切換：valentine（粉色主題）和 sunset（橘色主題）
 * 
 * 主要功能：
 * 1. 儲存目前選中的主題
 * 2. 提供主題切換功能
 * 3. 整合 DaisyUI 主題系統
 */

import { create } from "zustand";

/**
 * 主題管理 Zustand Store
 * 
 * 狀態結構：
 * - currentTheme: 目前啟用的主題名稱
 * 
 * 方法：
 * - toggleTheme: 在兩個主題間切換
 */
const useThemeStore = create((set) => ({
  // === 狀態定義 ===
  
  /**
   * 目前啟用的主題
   * 預設為 "valentine" 主題（粉色調）
   * 
   * 可用主題：
   * - "valentine": 粉色主題，適合溫馨的動物收養主題
   * - "sunset": 橘色主題，提供另一種視覺選擇
   */
  currentTheme: "valentine",

  // === 方法定義 ===
  
  /**
   * 切換主題
   * 
   * 功能說明：
   * - 在 "valentine" 和 "sunset" 兩個主題間切換
   * - 使用三元運算子進行簡潔的條件判斷
   * - 更新狀態時使用函數式更新，確保狀態的不可變性
   * 
   * 使用方式：
   * const { toggleTheme } = useThemeStore();
   * toggleTheme(); // 切換到另一個主題
   */
  toggleTheme: () =>
    set((state) => ({
      currentTheme: state.currentTheme === "valentine" ? "sunset" : "valentine",
    })),
}));

export default useThemeStore;