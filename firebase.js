/**
 * Firebase 配置與初始化
 * 
 * 此檔案負責：
 * 1. 初始化 Firebase 應用程式
 * 2. 設定 Firebase 認證服務
 * 3. 設定 Firebase 即時資料庫
 * 4. 配置第三方登入提供者（Google、Facebook）
 */

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

/**
 * Firebase 專案配置物件
 * 從環境變數中讀取敏感資訊，確保安全性
 * 
 * 環境變數說明：
 * - VITE_FIREBASE_API_KEY: Firebase API 金鑰
 * - VITE_FIREBASE_AUTH_DOMAIN: 認證網域
 * - VITE_FIREBASE_PROJECT_ID: 專案 ID
 * - VITE_FIREBASE_STORAGE_BUCKET: 儲存桶名稱
 * - VITE_FIREBASE_MESSAGING_SENDER_ID: 訊息發送者 ID
 * - VITE_FIREBASE_APP_ID: 應用程式 ID
 * - VITE_FIREBASE_MEASUREMENT_ID: Google Analytics 測量 ID
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// 初始化 Firebase 應用程式實例
const app = initializeApp(firebaseConfig);

/**
 * Firebase 認證服務實例
 * 提供使用者登入、登出、狀態監聽等功能
 */
export const auth = getAuth(app);

/**
 * Google 登入提供者實例
 * 用於設定 Google OAuth 登入流程
 * 支援使用者透過 Google 帳號快速登入
 */
export const googleProvider = new GoogleAuthProvider();

/**
 * Facebook 登入提供者實例
 * 用於設定 Facebook OAuth 登入流程
 * 支援使用者透過 Facebook 帳號快速登入
 */
export const facebookProvider = new FacebookAuthProvider();

/**
 * Firebase 即時資料庫實例
 * 提供即時資料同步功能，用於：
 * - 儲存使用者收藏清單
 * - 即時更新資料狀態
 * - 跨裝置同步使用者資料
 */
export const db = getDatabase(app);