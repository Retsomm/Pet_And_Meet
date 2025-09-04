/**
 * 動物資料瀏覽頁面
 *
 * 此頁面提供完整的動物資料瀏覽功能，包括：
 * 1. 動物資料的載入與顯示
 * 2. 多維度篩選功能（地區、種類、性別）
 * 3. 分頁導航
 * 4. 收藏狀態顯示
 * 5. 響應式設計支援
 *
 * 資料流程：
 * API資料 → 篩選處理 → 分頁切割 → 畫面渲染
 */

import React, { useState, useMemo } from "react";
import { useFetchAnimals } from "../hooks/useFetchAnimals";
import { filterAnimals } from "../utils/filterAnimals";
import AnimalCard from "../components/AnimalCard";
import { useUserCollects } from "../hooks/useUserCollects";
import AnimalFilterMenu from "../components/AnimalFilterMenu";
import AnimalSkeleton from "../components/AnimalSkeleton";
import { usePagination } from "../hooks/usePagination";

/**
 * 動物資料載入骨架組件
 *
 * 功能說明：
 * - 在資料載入期間顯示骨架動畫，提升使用者體驗
 * - 使用 Array.from() 產生指定數量的骨架元件
 * - 保持與實際內容相同的佈局結構
 *
 * @param {Object} props - 元件屬性
 * @param {number} props.count - 顯示的骨架數量，預設為9個
 * @returns {JSX.Element} 骨架載入動畫容器
 */
const AnimalSkeletons = ({ count = 9 }) => (
  <div className="flex flex-wrap justify-center items-center gap-3 m-3 px-4">
    {/* 使用 Array.from() 建立指定長度的陣列，並為每個元素產生骨架元件 */}
    {Array.from({ length: count }).map((_, idx) => (
      <AnimalSkeleton key={idx} />
    ))}
  </div>
);

/**
 * 分頁按鈕組件
 *
 * 功能說明：
 * - 渲染單個分頁按鈕
 * - 根據是否為當前頁面顯示不同樣式
 * - 使用 React.memo 優化渲染效能，避免不必要的重新渲染
 *
 * @param {Object} props - 元件屬性
 * @param {number} props.pageNum - 頁碼數字
 * @param {boolean} props.isActive - 是否為當前頁面
 * @param {Function} props.onClick - 點擊事件處理函數
 * @returns {JSX.Element} 分頁按鈕元件
 */
const PageButton = React.memo(({ pageNum, isActive, onClick }) => (
  <button
    className={`btn btn-sm ${
      isActive ? "btn-primary" : "btn-outline" // 當前頁面使用主要樣式，其他頁面使用外框樣式
    }`}
    onClick={() => onClick(pageNum)} // 點擊時傳遞頁碼到父元件
  >
    {pageNum}
  </button>
));

/**
 * 動物資料頁面主元件
 *
 * 功能概述：
 * - 整合多個 Hook 來管理動物資料、使用者收藏、篩選和分頁
 * - 提供響應式的資料瀏覽介面
 * - 支援即時篩選和分頁導航
 * - 處理載入狀態和錯誤狀態
 *
 * 狀態管理：
 * - showFilter: 控制篩選選單的顯示/隱藏
 * - filters: 儲存目前的篩選條件
 * - currentPage: 目前所在的頁碼
 *
 * @returns {JSX.Element} 動物資料頁面元件
 */
const Data = () => {
  // === Hook 調用區域 ===

  /**
   * 取得動物資料
   * 包含資料陣列、載入狀態、錯誤狀態
   */
  const { animals, loading, error } = useFetchAnimals();

  /**
   * 取得使用者收藏清單
   * 用於在動物卡片上顯示收藏狀態
   */
  const { collects = [] } = useUserCollects();

  // === 狀態定義區域 ===

  /** 控制篩選選單的顯示狀態 */
  const [showFilter, setShowFilter] = useState(false);

  /**
   * 篩選條件物件
   * area: 地區篩選
   * type: 動物種類篩選
   * sex: 性別篩選
   */
  const [filters, setFilters] = useState({ area: "", type: "", sex: "" });

  /** 目前頁碼，預設為第一頁 */
  const [currentPage, setCurrentPage] = useState(1);

  /** 每頁顯示的動物數量 */
  const itemsPerPage = 18;

  // === 資料處理區域 ===

  /**
   * 篩選後的動物資料
   *
   * 使用 useMemo 進行效能優化：
   * - 只有當 animals 或 filters 改變時才重新計算
   * - 避免每次渲染都執行篩選邏輯
   * - 確保回傳值為陣列，防止後續處理出錯
   */
  const filteredAnimals = useMemo(() => {
    const result = filterAnimals(animals, filters);
    return Array.isArray(result) ? result : [];
  }, [animals, filters]);

  /**
   * 分頁邏輯處理
   *
   * 使用自訂的 usePagination Hook：
   * - 計算總頁數
   * - 產生頁碼按鈕資料
   * - 處理省略號邏輯
   * - 提供上一頁/下一頁功能
   */
  const pagination = usePagination({
    page: currentPage, // 目前頁碼
    pageSize: itemsPerPage, // 每頁項目數
    total: filteredAnimals.length, // 總項目數
    withEllipsis: true, // 啟用省略號功能
    onChange: setCurrentPage, // 頁面改變回調
  });

  /**
   * 目前頁面顯示的動物資料
   *
   * 計算邏輯：
   * 1. 確保頁碼有效（防禦性程式設計）
   * 2. 計算起始和結束索引
   * 3. 使用 slice() 切割陣列取得目前頁面的資料
   * 4. 使用 useMemo 優化效能
   */
  const pageNum = pagination.page || currentPage || 1;
  const currentAnimals = useMemo(() => {
    const startIndex = (pageNum - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return Array.isArray(filteredAnimals)
      ? filteredAnimals.slice(startIndex, endIndex)
      : [];
  }, [filteredAnimals, pageNum, itemsPerPage]);

  // === 副作用處理區域 ===

  /**
   * 篩選條件改變時重設頁面到第一頁
   *
   * 原因：篩選後的資料可能不足以支撐原本的頁碼
   * 重設到第一頁確保使用者能看到篩選結果
   */
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  /**
   * 頁面改變時自動滾動到頂部
   *
   * 提升使用者體驗：
   * - 避免使用者需要手動滾動到頂部查看新內容
   * - 使用 smooth 行為提供平滑的滾動動畫
   */
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // === 事件處理函數區域 ===

  /**
   * 確認篩選條件處理函數
   *
   * 功能：
   * - 套用目前設定的篩選條件
   * - 關閉篩選選單
   * - 觸發資料重新篩選（透過 useEffect 監聽 filters 變化）
   */
  const handleFilter = () => {
    setShowFilter(false);
  };

  /**
   * 重設篩選條件處理函數
   *
   * 功能：
   * - 清除所有篩選條件，恢復到預設狀態
   * - 關閉篩選選單
   * - 顯示所有動物資料
   */
  const handleReset = () => {
    setFilters({ area: "", type: "", sex: "" });
    setShowFilter(false);
  };

  // === JSX 渲染區域 ===

  return (
    <div className="relative min-h-screen sm:pt-10">
      {/* === 篩選按鈕區域 === */}
      <div className="top-17 left-0 right-0 shadow-sm z-40 flex justify-center items-center sm:mt-6">
        <div className="flex justify-center items-center py-4 px-4 w-screen">
          {/* 
            篩選觸發按鈕
            - 點擊後顯示篩選選單
            - 使用搜尋圖示增加直覺性
          */}
          <button
            className="btn btn-outline bg-base-100"
            onClick={() => setShowFilter(true)}
          >
            🔍 篩選條件
          </button>
        </div>
      </div>

      {/* === 篩選條件選單 === */}
      {/* 條件式渲染：只有在 showFilter 為 true 時才顯示 */}
      {showFilter && (
        <AnimalFilterMenu
          filters={filters} // 目前的篩選條件
          setFilters={setFilters} // 更新篩選條件的函數
          onConfirm={handleFilter} // 確認篩選的處理函數
          onReset={handleReset} // 重設篩選的處理函數
          onClose={() => setShowFilter(false)} // 關閉選單的處理函數
        />
      )}

      {/* === 主要內容區域 === */}
      {/* 根據載入狀態顯示不同內容 */}
      {loading ? (
        /* 載入中狀態：顯示骨架動畫 */
        <AnimalSkeletons count={9} />
      ) : error ? (
        /* 錯誤狀態：顯示錯誤訊息 */
        <div className="text-center mt-10">資料載入失敗</div>
      ) : (
        /* 正常狀態：顯示動物資料和分頁 */
        <>
          {/* === 動物卡片列表區域 === */}
          <div className="flex flex-wrap justify-center items-center px-4">
            {/* 
              遍歷目前頁面的動物資料，為每隻動物產生卡片
              使用 map() 方法將資料陣列轉換為 JSX 元素陣列
            */}
            {currentAnimals.map((animal) => {
              /**
               * 檢查動物收藏狀態
               *
               * 邏輯：
               * 1. 確保 collects 是陣列
               * 2. 使用 some() 方法檢查是否有任一收藏項目的 animal_id 符合
               * 3. 將結果傳遞給 AnimalCard 元件顯示收藏狀態
               */
              const isCollected =
                Array.isArray(collects) &&
                collects.some((item) => item.animal_id === animal.animal_id);

              return (
                <AnimalCard
                  key={animal.animal_id} // React key，使用唯一的 animal_id
                  animal={animal} // 動物資料物件
                  isCollected={isCollected} // 收藏狀態
                  from="data" // 來源標識，用於區分不同頁面的行為
                />
              );
            })}
          </div>

          {/* === 分頁導航區域 === */}
          {/* 條件式渲染：只有在總頁數大於1時才顯示分頁 */}
          {pagination.totalPage > 1 && (
            <div className="flex justify-center items-center gap-2 my-8">
              {/* 上一頁按鈕 */}
              <button
                className="btn btn-outline btn-sm"
                disabled={pagination.page === 1} // 第一頁時禁用
                onClick={pagination.handleClickPrev}
              >
                上一頁
              </button>

              {/* 頁碼按鈕和省略號區域 */}
              {/* 
                遍歷分頁項目陣列，根據項目類型渲染不同內容
                項目類型包括：page（頁碼）、start-ellipsis（開始省略號）、end-ellipsis（結束省略號）
              */}
              {pagination.items.map((item, idx) => {
                if (item.type === "page") {
                  // 渲染頁碼按鈕
                  return (
                    <PageButton
                      key={item.page} // 使用頁碼作為 key
                      pageNum={item.page} // 頁碼數字
                      isActive={item.isCurrent} // 是否為當前頁面
                      onClick={setCurrentPage} // 點擊處理函數
                    />
                  );
                } else if (
                  item.type === "start-ellipsis" ||
                  item.type === "end-ellipsis"
                ) {
                  // 渲染省略號
                  return (
                    <span key={"ellipsis-" + idx} className="px-2">
                      ...
                    </span>
                  );
                }
                // 未知類型項目不渲染任何內容
                return null;
              })}

              {/* 下一頁按鈕 */}
              <button
                className="btn btn-outline btn-sm"
                disabled={pagination.page === pagination.totalPage} // 最後一頁時禁用
                onClick={pagination.handleClickNext}
              >
                下一頁
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Data;
