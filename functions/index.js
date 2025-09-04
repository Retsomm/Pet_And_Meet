/**
 * Firebase Cloud Functions - 動物收養 API 服務
 * 
 * 此檔案提供動物收養資料的 API 服務，主要功能包括：
 * 1. 從政府開放資料平台取得動物資料
 * 2. 實作快取機制減少外部 API 請求
 * 3. 資料過濾與處理
 * 4. CORS 跨域請求處理
 * 5. 錯誤處理與容錯機制
 * 
 * API 架構：
 * - 使用 Firebase Cloud Functions 作為 serverless 運算平台
 * - 整合政府開放資料 API
 * - 提供 RESTful API 介面給前端應用
 */

import { https } from "firebase-functions";
import fetch from "node-fetch";
import cors from "cors";

/**
 * CORS 中介軟體初始化
 * 
 * 設定說明：
 * - origin: true - 允許所有來源的跨域請求
 * - 支援前端開發環境和正式環境的不同網域
 * - 處理瀏覽器的預檢請求（OPTIONS）
 */
const corsHandler = cors({ origin: true });

/**
 * 政府開放資料 API 端點
 * 資料來源：農業部動物保護資訊網
 * 提供全台動物收容所的待領養動物資料
 */
const API_URL = "https://data.moa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL";

// === 快取機制相關變數 ===

/** 快取的動物資料 */
let cachedData = null;

/** 快取建立時間戳記 */
let cachedTime = 0;

/** 
 * 快取有效時間：6 小時（毫秒）
 * 
 * 考量因素：
 * - 動物收養資料更新頻率不高
 * - 減少對政府 API 的請求頻率
 * - 平衡資料即時性與效能
 */
const CACHE_DURATION = 1000 * 60 * 60 * 6;

/**
 * 主要 API 處理函數
 * 
 * 使用 Firebase Cloud Functions 的 HTTPS 觸發器
 * 處理所有進入的 HTTP 請求並根據路徑分發到不同的處理邏輯
 * 
 * 支援的端點：
 * - GET / : API 資訊與說明文件
 * - GET /animals : 取得所有動物資料
 * - OPTIONS * : CORS 預檢請求處理
 * 
 * @param {Object} req - Express 請求物件
 * @param {Object} res - Express 回應物件
 */
export const api = https.onRequest((req, res) => {
  // 使用 CORS 中介軟體包裝所有邏輯，確保跨域請求正常運作
  corsHandler(req, res, async () => {
    try {
      /**
       * CORS 預檢請求處理
       * 
       * 瀏覽器在發送跨域請求前會先發送 OPTIONS 請求
       * 需要回應 204 狀態碼告知瀏覽器允許後續的實際請求
       */
      if (req.method === 'OPTIONS') {
        return res.status(204).send('');
      }

      /**
       * API 根路徑處理
       * 
       * 提供 API 的基本資訊和可用端點說明
       * 方便開發者了解 API 的使用方式
       */
      if (req.path === "/" || req.path === "") {
        return res.json({
          message: "動物領養 API",
          version: "1.0.0",
          endpoints: [
            {
              path: "/animals",
              method: "GET",
              description: "取得所有動物資料"
            }
          ]
        });
      }

      /**
       * 動物資料端點處理
       * 
       * 核心功能：
       * 1. 檢查快取是否有效
       * 2. 如快取無效，從政府 API 取得最新資料
       * 3. 過濾無圖片的資料
       * 4. 更新快取並回傳資料
       */
      if (req.path === "/animals") {
        const now = Date.now();

        /**
         * 快取有效性檢查
         * 
         * 如果滿足以下條件，直接回傳快取資料：
         * 1. 快取資料存在
         * 2. 快取時間尚未超過有效期限
         */
        if (cachedData && now - cachedTime < CACHE_DURATION) {
          return res.json(cachedData);
        }

        /**
         * 請求超時控制
         * 
         * 設定 10 秒超時機制：
         * - 避免政府 API 回應過慢影響使用者體驗
         * - 使用 AbortController 提供優雅的請求取消
         */
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        try {
          /**
           * 向政府開放資料 API 發送請求
           * 
           * 特點：
           * - 支援請求中止機制
           * - 完整的錯誤處理
           * - 自動清理 timeout
           */
          const response = await fetch(API_URL, { signal: controller.signal });
          clearTimeout(timeout);

          // 檢查 HTTP 回應狀態
          if (!response.ok) throw new Error("Failed to fetch animal data");

          // 解析 JSON 資料
          const data = await response.json();
          
          /**
           * 資料過濾處理
           * 
           * 過濾條件：只保留有圖片的動物資料
           * 原因：
           * - 沒有圖片的動物資料對使用者體驗不佳
           * - 減少前端需要處理的無效資料
           * - 提升載入效能
           */
          const filteredData = data.filter(item => !!item.album_file);

          // 更新快取
          cachedData = filteredData;
          cachedTime = now;

          /**
           * 設定瀏覽器快取標頭
           * 
           * Cache-Control: public, max-age=3600
           * - public: 允許代理伺服器快取
           * - max-age=3600: 瀏覽器快取 1 小時
           */
          res.set("Cache-Control", "public, max-age=3600");
          return res.json(filteredData);
          
        } catch (fetchErr) {
          // 清理 timeout 防止記憶體洩漏
          clearTimeout(timeout);
          console.error('Fetch failed:', fetchErr);
          
          /**
           * 容錯機制：使用舊快取
           * 
           * 當政府 API 無法存取時：
           * 1. 如果有舊的快取資料，回傳舊資料
           * 2. 確保服務的可用性
           * 3. 避免完全無法提供服務
           */
          if (cachedData) {
            return res.json(cachedData);
          }
          // 如果連舊快取都沒有，則拋出錯誤
          throw fetchErr;
        }
      } else {
        /**
         * 404 錯誤處理
         * 回應未知的路徑請求
         */
        return res.status(404).json({ error: "Not found" });
      }
    } catch (err) {
      /**
       * 全域錯誤處理
       * 
       * 功能：
       * 1. 記錄錯誤資訊供除錯使用
       * 2. 回傳使用者友善的錯誤訊息
       * 3. 避免洩漏敏感的系統資訊
       */
      console.error('API Error:', err);
      return res.status(500).json({
        error: "Internal server error",
        message: err.message
      });
    }
  });
});