/**
 * 動物資料篩選工具函數
 * 
 * 根據指定的篩選條件（地區、動物種類、性別）過濾動物陣列
 * 使用函數式程式設計，不會修改原始陣列，而是回傳新的篩選結果
 * 
 * @param {Array} animals - 原始動物資料陣列，每個元素應包含動物的完整資訊
 * @param {Object} filters - 篩選條件物件
 * @param {string} filters.area - 地區篩選條件（部分符合即可）
 * @param {string} filters.type - 動物種類篩選條件（貓、狗、其他）
 * @param {string} filters.sex - 性別篩選條件（公、母、未知）
 * @returns {Array} 篩選後的動物陣列
 */
export const filterAnimals = (animals, filters) => {
  // 防禦性程式設計：檢查輸入資料的有效性
  // 如果 animals 不是陣列或為空陣列，直接回傳空陣列
  if (!Array.isArray(animals) || animals.length === 0) return [];

  /**
   * 性別代碼對照表
   * 將使用者友善的中文性別名稱對應到 API 使用的英文代碼
   * 這樣的對照表設計可以：
   * 1. 隔離前端顯示邏輯與後端資料格式
   * 2. 方便日後修改對照關係
   * 3. 提高程式碼可讀性
   */
  const sexMap = {
    公: "M",     // 雄性
    母: "F",     // 雌性
    未知: "N",   // 未知性別
  };

  /**
   * 使用 Array.filter() 方法進行資料篩選
   * filter() 會遍歷陣列中的每個元素，只保留通過測試函數的元素
   * 回傳新陣列，不會修改原始陣列
   */
  const result = animals.filter((animal) => {
    // 解構賦值取得篩選條件，提高程式碼可讀性
      const { area, type, sex, color, bodytype, variety } = filters;

    /**
     * 地區篩選邏輯
     * 
     * 邏輯說明：
     * 1. 如果沒有設定地區篩選條件（!area），則通過篩選
     * 2. 如果有設定條件，檢查動物的實際所在地是否包含篩選關鍵字
     * 3. 使用 optional chaining（?.）避免 null/undefined 錯誤
     * 4. 使用 includes() 進行部分比對，增加搜尋靈活性
     */
    const areaMatch = !area || animal.animal_place?.includes(area);

    /**
     * 動物種類篩選邏輯
     * 
     * 多條件邏輯處理：
     * 1. 取得動物種類資料，提供空字串作為備用值
     * 2. 使用短路求值（||）處理多種篩選情況：
     *    - 沒有設定種類篩選：!type (通過)
     *    - 篩選貓咪：type === "貓" && kind.includes("貓")
     *    - 篩選狗狗：type === "狗" && kind.includes("狗") 
     *    - 篩選其他：type === "其他" && 既不是貓也不是狗
     * 3. 使用 includes() 處理可能包含多種動物類型的情況
     */
    const kind = animal.animal_kind || "";
    const typeMatch =
      !type ||
      (type === "貓" && kind.includes("貓")) ||
      (type === "狗" && kind.includes("狗")) ||
      (type === "其他" && !kind.includes("貓") && !kind.includes("狗"));

    /**
     * 性別篩選邏輯
     * 
     * 對照表應用：
     * 1. 如果沒有設定性別篩選條件，則通過篩選
     * 2. 如果有設定條件，使用 sexMap 將中文轉換為 API 代碼進行比對
     * 3. 這種設計讓前端可以使用使用者友善的中文，後端使用統一的英文代碼
     */
    const sexMatch = !sex || animal.animal_sex === sexMap[sex];

    /**
     * 毛色篩選（改進版）
     * - 支援部分詞語匹配與常見變體，例如 "黑色" 可匹配 "黑","黑白相間" 等
     * - 使用關鍵字映射提高匹配率
     */
    const normalize = (s) => (String(s || "").replace(/\s+/g, "").toLowerCase());
    const colorKeywords = {
      黑色: ["黑", "黑色"],
      白色: ["白", "白色"],
      棕色: ["棕", "棕色", "茶"],
      灰色: ["灰", "灰色"],
      虎斑: ["虎", "虎斑", "斑"],
      三色: ["三色"],
      花色: ["花", "花色"],
      其他: ["其他"],
    };
    const selected = normalize(color);
    const animalColor = normalize(animal.animal_colour);
    let colorMatch = true;
    if (selected) {
      const keywords = colorKeywords[color] || [color];
      colorMatch = keywords.some((kw) => animalColor.includes(normalize(kw)));
    }

    // 體型比對（簡單 includes）
    const bodyTypeMatch = !bodytype || (normalize(animal.animal_bodytype || "").includes(normalize(bodytype)));

    // 品種比對（簡單 includes）
    const varietyMatch = !variety || (normalize(animal.animal_Variety || "").includes(normalize(variety)));

    /**
     * 綜合篩選結果
     * 只有當所有篩選條件都通過時，該動物才會被保留在結果中
     * 使用 && 運算子確保所有條件都必須滿足
     */
    return areaMatch && typeMatch && sexMatch && colorMatch && bodyTypeMatch && varietyMatch;
  });
  
  // 回傳篩選後的結果陣列
  return result;
};

/**
 * 優化建議和注意事項：
 * 
 * 1. 性別對照表可以抽取到檔案外部或設定檔中，方便多處共用
 * 2. 考慮加入更多篩選條件（如年齡範圍、絕育狀態等）
 * 3. 可以加入模糊搜尋功能，提高搜尋準確度
 * 4. 考慮加入排序功能，讓篩選結果更有序
 * 5. 對於大量資料，可以考慮加入防抖動（debounce）機制
 */