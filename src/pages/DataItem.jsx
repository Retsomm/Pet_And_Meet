import React from "react";
import { useLocation, useParams, useNavigate } from "react-router";
import { useFetchAnimals } from "../hooks/useFetchAnimals";
import { useFavorite } from "../hooks/useFavorite";
import useToastStore from "../stores/useToastStore";
import useAuthStore from "../stores/useAuthStore";
/**
 * 動物資料欄位對應中文名稱的對照表
 * 用於將 API 回傳的英文欄位名稱轉換為使用者友善的中文顯示名稱
 * 這是一個 key-value 物件，key 為 API 欄位名，value 為中文顯示名稱
 */
const keyMap = {
  animal_id: "動物流水編號",
  animal_subid: "動物管理編號",
  animal_area_pkid: "動物所屬地區",
  animal_shelter_pkid: "動物所屬收容所",
  animal_place: "動物實際所在地",
  animal_kind: "動物種類",
  animal_Variety: "動物品種",
  animal_sex: "動物性別",
  animal_bodytype: "動物體型",
  animal_colour: "動物毛色",
  animal_age: "動物年齡",
  animal_sterilization: "是否絕育",
  animal_bacterin: "是否施打疫苗",
  animal_foundplace: "動物尋獲地",
  animal_title: "動物標題",
  animal_status: "動物狀態",
  animal_remark: "備註",
  animal_caption: "其他說明",
  animal_opendate: "開放認養時間",
  animal_closeddate: "結案時間",
  animal_update: "資料更新時間",
  animal_createtime: "資料建立時間",
  shelter_name: "收容所名稱",
  album_file: "圖片",
  album_update: "圖片資料更新時間",
  cDate: "領養公告日期",
  shelter_address: "收容所地址",
  shelter_tel: "收容所電話",
};

/**
 * DataItem 元件 - 動物詳細資料頁面
 *
 * 功能說明：
 * 1. 顯示單一動物的完整資料（透過 URL 參數中的 animal_id 取得）
 * 2. 提供收藏/取消收藏功能
 * 3. 提供 Google Maps 導航連結
 * 4. 處理圖片載入失敗的備用圖片顯示
 * 5. 智慧返回上一頁功能（根據來源頁面決定返回路徑）
 *
 * @returns {JSX.Element} 動物詳細資料頁面元件
 */
export default function DataItem() {
  // 從 URL 路徑參數取得動物 ID (例如：/data/:id 中的 :id)
  const { id } = useParams();

  // 取得路由狀態，用於判斷使用者從哪個頁面導航至此
  // location.state.from 可能的值：'collect', '/', '/data' 等
  const location = useLocation();

  // React Router 的導航函數，用於程式化導航
  const navigate = useNavigate();

  // 使用自定義 Hook 取得動物資料陣列、載入狀態、錯誤狀態
  const { animals, loading, error } = useFetchAnimals();
  const { showWarning, showSuccess, showError } = useToastStore();
  const { isLoggedIn } = useAuthStore();
  /**
   * 使用 useMemo 優化效能，避免在每次 render 時都重新搜尋動物資料
   *
   * 資料處理流程：
   * 1. 在 animals 陣列中搜尋符合 URL 參數 id 的動物
   * 2. 使用 String() 確保型別一致性（API 可能回傳數字或字串型別的 animal_id）
   * 3. 只有當 animals 或 id 改變時才重新計算
   */
  const animal = React.useMemo(
    () => animals.find((a) => String(a.animal_id) === id),
    [animals, id]
  );

  // 使用自定義 Hook 管理該動物的收藏狀態和切換功能
  const { isCollected, toggleFavorite } = useFavorite(animal);

  // 載入中狀態：顯示載入動畫
  if (loading) return <span className="loading loading-ring loading-lg"></span>;

  // 錯誤狀態：顯示載入失敗訊息
  if (error) return <div className="text-center mt-10">資料載入失敗</div>;

  // 找不到動物資料：當 URL 中的 id 在資料庫中不存在時顯示
  if (!animal) return <div className="text-center mt-10">找不到毛孩資料</div>;

  /**
   * 生成 Google Maps 搜尋 URL
   *
   * 處理流程：
   * 1. 取得動物的實際所在地 (animal_place)
   * 2. 使用 encodeURIComponent 進行 URL 編碼，處理中文字元和特殊符號
   * 3. 若無地址資料則傳入空字串，Google Maps 會顯示使用者目前位置
   */
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    animal.animal_place || ""
  )}`;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-base-100 shadow-lg rounded-lg p-6">
      <div className="mb-4">
        {/* 
          動物資料顯示區塊
          
          資料處理技巧：
          1. Object.entries(animal) - 將動物物件轉換為 [key, value] 二維陣列
          2. 這樣可以動態遍歷物件的所有屬性，不需要手動列出每個欄位
          3. 特別處理 album_file 欄位以顯示圖片，其他欄位顯示文字
        */}
        {Object.entries(animal).map(([key, value]) => (
          <div key={key} className="text-sm border-b py-1 flex">
            <span className="font-bold w-40">
              {/* 
                欄位名稱顯示邏輯：
                1. 優先使用 keyMap 中的中文對照名稱
                2. 若 keyMap 中沒有對應的鍵，則直接顯示原始 key
                3. 使用 || 運算子提供備用值
              */}
              {keyMap[key] || key}：
            </span>
            <span className="flex-1 break-all">
              {/* 
                條件渲染：圖片 vs 文字內容
                
                特殊處理 album_file 欄位：
                - 如果是圖片欄位，渲染 <img> 元素
                - 其他欄位則轉換為字串顯示
              */}
              {key === "album_file" ? (
                <div className="relative w-auto h-full inline-block">
                  <img
                    src={value}
                    alt="動物圖片"
                    className="w-full h-full"
                    loading="lazy"
                    onError={(e) => {
                      // 圖片載入失敗處理
                      // 1. 設定 onerror = null 避免無限循環
                      // 2. 切換到備用圖片 default.webp
                      e.target.onerror = null;
                      e.target.src = "/default.webp";
                    }}
                  />
                </div>
              ) : (
                // 將非圖片資料轉換為字串顯示
                // String(value) 確保 null、undefined、數字等都能正常顯示
                String(value)
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Google Maps 導航按鈕 */}
      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn w-full mb-4"
      >
        Google Map 導航
      </a>

      {/* 
        收藏切換按鈕
        
        功能特點：
        1. 動態按鈕樣式：根據收藏狀態改變顏色 (btn-error vs btn-warning)
        2. 動態按鈕文字：根據收藏狀態顯示不同文字
        3. 非同步操作處理：使用 async/await 處理 Firebase 操作
        4. 錯誤處理：捕捉並顯示登入狀態或其他錯誤
      */}
      <button
        className={`btn w-full mb-4 ${
          isCollected ? "btn-error" : "btn-warning"
        }`}
        onClick={async () => {
          // 檢查使用者是否已登入
          if (!isLoggedIn) {
            showWarning("請先登入才能收藏毛孩！");
            return;
          }

          try {
            // 記錄當前收藏狀態（執行 toggleFavorite 前）
            const wasCollected = isCollected;
            // 呼叫收藏切換功能（來自 useFavorite Hook）
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
      >
        {/* 根據收藏狀態顯示不同的按鈕文字 */}
        {isCollected ? "取消收藏" : "收藏這隻毛孩"}
      </button>

      {/* 
        智慧返回按鈕
        
        導航邏輯：
        1. 檢查 location.state.from 了解使用者來源頁面
        2. 根據來源頁面導航到對應的路由
        3. 提供備用路由 (/data) 處理未知來源
        
        這種設計讓使用者有一致的導航體驗，
        不會因為直接輸入 URL 或重新整理而失去上下文
      */}
      <button
        className="btn btn-outline w-full"
        onClick={() => {
          if (location.state?.from === "collect") {
            // 來自收藏頁面，返回收藏頁面
            navigate("/collect");
          } else if (location.state?.from === "/") {
            // 來自首頁，返回首頁
            navigate("/");
          } else {
            // 預設返回資料列表頁面
            navigate("/data");
          }
        }}
      >
        回到上一頁
      </button>
    </div>
  );
}
