import React from "react";

/**
 * 台灣地區選項常數陣列
 * 包含台灣所有縣市的完整清單，用於地區篩選功能
 * 第一個選項 "全部" 代表不進行地區篩選
 */
const AREAS = [
  "全部",
  "新北市",
  "臺北市",
  "桃園市",
  "新竹市",
  "苗栗縣",
  "臺中市",
  "南投縣",
  "彰化縣",
  "雲林縣",
  "嘉義市",
  "嘉義縣",
  "臺南市",
  "屏東縣",
  "基隆市",
  "宜蘭縣",
  "花蓮縣",
  "臺東縣",
  "澎湖縣",
  "金門縣",
  "連江縣",
];

/**
 * 動物種類選項常數陣列
 * 定義可篩選的動物類型
 * "全部" - 不進行種類篩選
 * "貓" - 篩選貓咪
 * "狗" - 篩選狗狗
 * "其他" - 篩選除了貓狗以外的其他動物
 */
const TYPES = ["全部", "貓", "狗", "其他"];

/**
 * 動物性別選項常數陣列
 * 定義可篩選的性別類型
 * "全部" - 不進行性別篩選
 * "公" - 雄性動物
 * "母" - 雌性動物
 * "未知" - 性別不明的動物
 */
const SEXES = ["全部", "公", "母", "未知"];

/**
 * 可重複使用的篩選按鈕群組元件
 *
 * 功能說明：
 * - 產生一組篩選按鈕，每個按鈕代表一個選項
 * - 支援高亮顯示目前選中的選項
 * - 處理 "全部" 選項與空值的對應關係
 *
 * @param {Object} props - 元件屬性
 * @param {string} props.label - 篩選類別的顯示標籤（如：地區、種類、性別）
 * @param {Array<string>} props.options - 可選擇的選項陣列
 * @param {string} props.value - 目前選中的值
 * @param {Function} props.onChange - 當選項改變時觸發的回調函數
 * @param {string} props.className - 額外的 CSS 類名，預設為空字串
 * @returns {JSX.Element} 篩選按鈕群組元件
 */
const FilterButtonGroup = ({
  label,
  options,
  value,
  onChange,
  className = "",
}) => (
  <div className={`mb-6 ${className}`}>
    {/* 篩選類別標籤 */}
    <div className="mb-2 font-bold">{label}</div>
    {/* 按鈕群組容器，使用 flex 佈局並允許換行 */}
    <div className="flex flex-wrap gap-2">
      {/* 
        遍歷選項陣列，為每個選項產生對應的按鈕
        使用 map() 方法將陣列元素轉換為 JSX 元素
      */}
      {options.map((option) => (
        <button
          key={option} // React key，用於優化重新渲染效能
          className={`btn btn-outline btn-sm ${
            // 條件式樣式：判斷是否為目前選中的選項
            // 當 value 等於 option，或 value 為空且 option 為 "全部" 時，套用主要樣式
            value === option || (value === "" && option === "全部")
              ? "btn-primary"
              : ""
          }`}
          onClick={() =>
            // 點擊處理：如果點擊 "全部"，傳遞空字串；否則傳遞選項本身
            // 這樣的設計讓 "全部" 對應到無篩選狀態
            onChange(option === "全部" ? "" : option)
          }
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

/**
 * 動物篩選選單主元件
 *
 * 功能說明：
 * - 提供全螢幕的篩選介面，讓使用者設定動物搜尋條件
 * - 支援地區、種類、性別三種篩選維度
 * - 提供重置和確認功能
 * - 響應式設計，支援不同螢幕尺寸
 *
 * @param {Object} props - 元件屬性
 * @param {Object} props.filters - 目前的篩選條件物件
 * @param {string} props.filters.area - 地區篩選條件
 * @param {string} props.filters.type - 種類篩選條件
 * @param {string} props.filters.sex - 性別篩選條件
 * @param {Function} props.setFilters - 更新篩選條件的函數
 * @param {Function} props.onConfirm - 確認篩選時觸發的回調函數
 * @param {Function} props.onReset - 重置篩選時觸發的回調函數
 * @param {Function} props.onClose - 關閉選單時觸發的回調函數
 * @returns {JSX.Element} 動物篩選選單元件
 */
const AnimalFilterMenu = ({
  filters,
  setFilters,
  onConfirm,
  onReset,
  onClose,
}) => (
  // 全螢幕覆蓋層，使用 fixed 定位占滿整個視窗
  <div className="fixed w-screen h-screen top-0 left-0 z-50 p-8 bg-base-100 overflow-y-auto">
    {/* 標題列：包含選單標題和關閉按鈕 */}
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-2xl font-bold">篩選條件</h2>
      {/* 關閉按鈕：點擊 × 符號關閉選單 */}
      <button className="text-2xl" onClick={onClose}>
        ×
      </button>
    </div>

    {/* 
      地區篩選區塊
      使用 FilterButtonGroup 元件顯示所有地區選項
      onChange 使用函數式更新，保持其他篩選條件不變，只更新 area
    */}
    <FilterButtonGroup
      label="地區"
      options={AREAS}
      value={filters.area}
      onChange={(area) => setFilters((f) => ({ ...f, area }))}
    />

    {/* 
      種類篩選區塊
      使用 flex-nowrap 防止按鈕換行，保持在同一列
    */}
    <FilterButtonGroup
      label="種類"
      options={TYPES}
      value={filters.type}
      onChange={(type) => setFilters((f) => ({ ...f, type }))}
      className="flex-nowrap"
    />

    {/* 
      性別篩選區塊
      同樣使用 flex-nowrap 保持按鈕在同一列
    */}
    <FilterButtonGroup
      label="性別"
      options={SEXES}
      value={filters.sex}
      onChange={(sex) => setFilters((f) => ({ ...f, sex }))}
      className="flex-nowrap"
    />

    {/* 
      操作按鈕區塊
      包含重置和確認兩個按鈕，使用 flex 佈局平均分配寬度
    */}
    <div className="flex gap-4 mt-12">
      {/* 重置按鈕：清除所有篩選條件 */}
      <button className="btn btn-outline flex-1" onClick={onReset}>
        重置
      </button>
      {/* 確認按鈕：套用目前的篩選條件 */}
      <button className="btn btn-outline flex-1" onClick={onConfirm}>
        確認
      </button>
    </div>
  </div>
);

/**
 * 使用 React.memo 包裝元件，避免不必要的重新渲染
 * 當 props 沒有變化時，不會重新渲染元件，提升效能
 */
export default React.memo(AnimalFilterMenu);
