/**
 * Toast 通知訊息管理 Store
 * 
 * 使用 Zustand 結合 react-hot-toast 提供統一的通知訊息管理
 * 支援多種類型的通知：成功、錯誤、資訊、警告、載入中
 * 
 * 主要功能：
 * 1. 統一的通知訊息樣式設定
 * 2. 多種通知類型支援
 * 3. 可自訂的通知選項
 * 4. 通知管理（關閉特定或全部通知）
 */

import { create } from "zustand";
import toast from "react-hot-toast";

/**
 * Toast 通知管理 Zustand Store
 * 
 * 此 Store 主要提供方法而非狀態，因為通知的狀態由 react-hot-toast 內部管理
 * 所有方法都使用統一的樣式配置，確保應用程式的視覺一致性
 */
const useToastStore = create(() => ({
  // === 通知顯示方法 ===

  /**
   * 顯示成功訊息
   * 
   * 用於操作成功時的反饋，如：登入成功、儲存成功、刪除成功等
   * 
   * @param {string} message - 要顯示的成功訊息
   * @param {Object} options - 額外的 toast 選項（可選）
   * @param {number} options.duration - 顯示時間（毫秒）
   * @param {string} options.position - 顯示位置
   * @param {Object} options.style - 自訂樣式
   */
  showSuccess: (message, options = {}) => {
    toast.success(message, {
      duration: 2000,                // 顯示 2 秒
      position: "top-center",        // 螢幕上方中央
      style: {
        background: "#10b981",       // 綠色背景（Tailwind green-500）
        color: "#fff",               // 白色文字
        borderRadius: "8px",         // 圓角
        fontSize: "14px",            // 字體大小
        fontWeight: "500",           // 字體粗細（medium）
      },
      iconTheme: {
        primary: "#fff",             // 圖示主色（白色）
        secondary: "#10b981",        // 圖示次色（綠色）
      },
      ...options,                    // 允許覆寫預設選項
    });
  },

  /**
   * 顯示錯誤訊息
   * 
   * 用於操作失敗時的反饋，如：登入失敗、網路錯誤、驗證失敗等
   * 
   * @param {string} message - 要顯示的錯誤訊息
   * @param {Object} options - 額外的 toast 選項（可選）
   */
  showError: (message, options = {}) => {
    toast.error(message, {
      duration: 2000,                // 顯示 2 秒
      position: "top-center",        // 螢幕上方中央
      style: {
        background: "#ef4444",       // 紅色背景（Tailwind red-500）
        color: "#fff",               // 白色文字
        borderRadius: "8px",         // 圓角
        fontSize: "14px",            // 字體大小
        fontWeight: "500",           // 字體粗細
      },
      iconTheme: {
        primary: "#fff",             // 圖示主色（白色）
        secondary: "#ef4444",        // 圖示次色（紅色）
      },
      ...options,                    // 允許覆寫預設選項
    });
  },

  /**
   * 顯示資訊訊息
   * 
   * 用於一般資訊提示，如：操作提示、狀態更新、一般通知等
   * 
   * @param {string} message - 要顯示的資訊內容
   * @param {Object} options - 額外的 toast 選項（可選）
   */
  showInfo: (message, options = {}) => {
    toast(message, {
      duration: 2000,                // 顯示 2 秒
      position: "top-center",        // 螢幕上方中央
      style: {
        background: "#3b82f6",       // 藍色背景（Tailwind blue-500）
        color: "#fff",               // 白色文字
        borderRadius: "8px",         // 圓角
        fontSize: "14px",            // 字體大小
        fontWeight: "500",           // 字體粗細
      },
      icon: "ℹ️",                   // 資訊圖示
      ...options,                    // 允許覆寫預設選項
    });
  },

  /**
   * 顯示警告訊息
   * 
   * 用於需要使用者注意的情況，如：權限不足、操作風險、重要提醒等
   * 
   * @param {string} message - 要顯示的警告內容
   * @param {Object} options - 額外的 toast 選項（可選）
   */
  showWarning: (message, options = {}) => {
    toast(message, {
      duration: 2000,                // 顯示 2 秒
      position: "top-center",        // 螢幕上方中央
      style: {
        background: "#f59e0b",       // 橘色背景（Tailwind amber-500）
        color: "#fff",               // 白色文字
        borderRadius: "8px",         // 圓角
        fontSize: "14px",            // 字體大小
        fontWeight: "500",           // 字體粗細
      },
      icon: "⚠️",                   // 警告圖示
      ...options,                    // 允許覆寫預設選項
    });
  },

  /**
   * 顯示載入中訊息
   * 
   * 用於長時間操作的進度提示，如：資料載入、檔案上傳、API 請求等
   * 與其他類型不同，此方法會回傳 toast ID，方便後續手動關閉
   * 
   * @param {string} message - 載入提示文字，預設為 "載入中..."
   * @param {Object} options - 額外的 toast 選項（可選）
   * @returns {string} toast ID，可用於手動關閉此通知
   */
  showLoading: (message = "載入中...", options = {}) => {
    return toast.loading(message, {
      position: "top-center",        // 螢幕上方中央
      style: {
        background: "#6b7280",       // 灰色背景（Tailwind gray-500）
        color: "#fff",               // 白色文字
        borderRadius: "8px",         // 圓角
        fontSize: "14px",            // 字體大小
        fontWeight: "500",           // 字體粗細
      },
      ...options,                    // 允許覆寫預設選項
    });
  },

  // === 通知管理方法 ===

  /**
   * 關閉特定的 toast 通知
   * 
   * 主要用於手動關閉載入中的通知，當操作完成時呼叫
   * 
   * @param {string} toastId - 要關閉的 toast ID（由 showLoading 回傳）
   * 
   * 使用範例：
   * const loadingId = showLoading("上傳中...");
   * // 操作完成後
   * dismiss(loadingId);
   */
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },

  /**
   * 關閉所有 toast 通知
   * 
   * 用於需要清除所有通知的場景，如：頁面切換、重置狀態等
   * 
   * 使用範例：
   * dismissAll(); // 清除所有顯示中的通知
   */
  dismissAll: () => {
    toast.dismiss();
  },
}));

export default useToastStore;
