/**
 * 使用者認證狀態管理 Store
 * 
 * 使用 Zustand 進行狀態管理，結合 IndexedDB 進行資料持久化
 * 提供登入、登出、狀態初始化等功能
 * 
 * 主要功能：
 * 1. 管理使用者登入狀態
 * 2. 儲存使用者資訊到本地儲存
 * 3. 應用程式啟動時恢復使用者狀態
 * 4. 提供載入狀態管理
 */

import { create } from "zustand";
import { openDB } from "idb";

// IndexedDB 資料庫配置常數
const DB_NAME = "auth-db";           // 資料庫名稱
const STORE_NAME = "auth";           // 儲存空間名稱  
const USER_KEY = "user";             // 使用者資料的鍵值

/**
 * 從 IndexedDB 取得使用者資料
 * 
 * 功能說明：
 * - 開啟或建立 IndexedDB 資料庫
 * - 如果是第一次使用，會自動建立必要的儲存空間
 * - 取得儲存的使用者資料
 * 
 * @returns {Promise<Object|undefined>} 使用者資料物件或 undefined
 */
async function getUserFromIDB() {
  // 開啟資料庫，版本號為 1
  const db = await openDB(DB_NAME, 1, {
    // 資料庫升級回調：第一次建立或版本更新時執行
    upgrade(db) {
      // 建立名為 "auth" 的物件儲存空間
      db.createObjectStore(STORE_NAME);
    },
  });
  // 從儲存空間中取得使用者資料
  return await db.get(STORE_NAME, USER_KEY);
}

/**
 * 將使用者資料儲存到 IndexedDB
 * 
 * 功能說明：
 * - 將使用者資料持久化儲存到瀏覽器本地
 * - 確保使用者重新整理頁面後仍保持登入狀態
 * 
 * @param {Object} user - 要儲存的使用者資料物件
 * @returns {Promise<void>}
 */
async function setUserToIDB(user) {
  // 開啟已存在的資料庫
  const db = await openDB(DB_NAME, 1);
  // 將使用者資料寫入儲存空間
  await db.put(STORE_NAME, user, USER_KEY);
}

/**
 * 從 IndexedDB 移除使用者資料
 * 
 * 功能說明：
 * - 清除本地儲存的使用者資料
 * - 用於使用者登出時清理快取
 * 
 * @returns {Promise<void>}
 */
async function removeUserFromIDB() {
  // 開啟已存在的資料庫
  const db = await openDB(DB_NAME, 1);
  // 刪除指定鍵值的資料
  await db.delete(STORE_NAME, USER_KEY);
}

/**
 * 認證狀態 Zustand Store
 * 
 * 狀態結構：
 * - isLoggedIn: 使用者是否已登入
 * - user: 使用者資料物件
 * - isLoading: 是否正在載入中（用於避免初始化期間的閃爍）
 * 
 * 方法：
 * - init: 初始化認證狀態
 * - login: 使用者登入
 * - logout: 使用者登出
 */
const useAuthStore = create((set) => ({
  // === 狀態定義 ===
  
  /** 使用者是否已登入 */
  isLoggedIn: false,
  
  /** 使用者資料物件（包含 uid、email、displayName 等） */
  user: null,
  
  /** 載入狀態，用於防止初始化期間的狀態閃爍 */
  isLoading: true,

  // === 方法定義 ===
  
  /**
   * 初始化認證狀態
   * 
   * 應用程式啟動時呼叫，從 IndexedDB 恢復使用者狀態
   * 設定載入狀態，避免在檢查過程中顯示錯誤的狀態
   */
  init: async () => {
    // 設定載入狀態為 true
    set({ isLoading: true });
    
    // 從本地儲存取得使用者資料
    const user = await getUserFromIDB();
    
    // 更新狀態：
    // - 如果有使用者資料，設定為已登入
    // - 設定使用者資料（有資料則設定，無資料則為 null）
    // - 結束載入狀態
    set({ 
      isLoggedIn: !!user,           // 轉換為布林值
      user: user || null,           // 確保為 null 而非 undefined
      isLoading: false 
    });
  },

  /**
   * 使用者登入
   * 
   * 當使用者成功通過 Firebase 認證後呼叫
   * 將使用者資料儲存到本地並更新狀態
   * 
   * @param {Object} user - Firebase 使用者物件
   */
  login: async (user) => {
    // 將使用者資料儲存到 IndexedDB
    await setUserToIDB(user);
    
    // 更新 Store 狀態為已登入
    set({ isLoggedIn: true, user });
  },

  /**
   * 使用者登出
   * 
   * 清除本地儲存的使用者資料並重置狀態
   * 通常在使用者點擊登出按鈕時呼叫
   */
  logout: async () => {
    // 從 IndexedDB 移除使用者資料
    await removeUserFromIDB();
    
    // 重置 Store 狀態為未登入
    set({ isLoggedIn: false, user: null });
  },
}));

export default useAuthStore;