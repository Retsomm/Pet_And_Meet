/**
 * 自定義分頁 Hook
 * 用於處理分頁邏輯，包括頁面項目生成、省略號處理和頁面導航
 * 
 * @param {Object} options - 分頁配置選項
 * @param {number} options.page - 當前頁碼，默認為 1
 * @param {number} options.pageSize - 每頁顯示的項目數量，默認為 20
 * @param {number} options.total - 總項目數量
 * @param {boolean} options.withEllipsis - 是否啟用省略號功能
 * @param {Function} options.onChange - 頁面變更時的回調函數
 * @returns {Object} 返回分頁相關的狀態和方法
 */
export const usePagination = ({
    page =1,
    pageSize=20,
    total,
    withEllipsis,
    onChange,
})=> {
    // 計算總頁數，使用 Math.ceil 確保不完整的頁面也被計算在內
    const totalPage = Math.ceil(total / pageSize);
    
    // 生成所有頁面項目的基本結構
    // 創建一個包含所有頁碼的陣列，每個頁碼都包含其狀態和點擊處理函數
    const items = [...Array(totalPage).keys()]
        .map((key) => key + 1) // 將索引轉換為頁碼（從 1 開始）
        .map((item)=>({
            type:'page', // 項目類型：普通頁面
            isCurrent:page === item, // 是否為當前頁面
            page: item, // 頁碼
            onClick:()=>onChange(item), // 點擊時觸發頁面變更
        }));
    // 標記需要顯示的頁面和需要省略的頁面
    // 保留第一頁、最後一頁、當前頁及其前後相鄰頁面，其他頁面標記為省略號
    const markedItems = items
        .map((item)=> {
            if (
                item.page === totalPage  // 最後一頁
                || item.page ===1        // 第一頁
                || item.page === page    // 當前頁
                || item.page === page + 1 // 當前頁的下一頁
                || item.page === page - 1 // 當前頁的上一頁
            ) {
                return item; // 保持原樣，不需要省略
            }
            // 其他頁面根據位置標記為開始或結束省略號
            return {
                ...item,
                type: item.page > page ? 'end-ellipsis' : 'start-ellipsis',
                
            };
        });
        // 移除連續的省略號，確保相同類型的省略號不會重複出現
        // 這樣可以避免出現多個連續的 "..." 符號
        const ellipsisItems = markedItems
            .filter((item, index)=> {
                // 如果當前項目是開始省略號，且下一個項目也是開始省略號，則過濾掉當前項目
                if (item.type === 'start-ellipsis' && markedItems[index + 1].type === 'start-ellipsis') {
                    return false;
                }
                // 如果當前項目是結束省略號，且上一個項目也是結束省略號，則過濾掉當前項目
                if (item.type === 'end-ellipsis' && markedItems[index - 1].type === 'end-ellipsis') {
                    return false;
                }
                return true; // 保留其他項目
            });
        /**
         * 處理下一頁點擊事件
         * 如果當前頁不是最後一頁，則移動到下一頁；否則保持在最後一頁
         */
        const handleClickNext = ()=> {
            const nextCurrent = page + 1 > totalPage ? totalPage : page + 1;
            onChange(nextCurrent);  
        };
        
        /**
         * 處理上一頁點擊事件
         * 如果當前頁不是第一頁，則移動到上一頁；否則保持在第一頁
         */
        const handleClickPrev = ()=> {
            const prevCurrent = page - 1 <1 ? 1: page - 1;
            onChange(prevCurrent);
        };
        /**
         * 返回分頁相關的狀態和方法
         * @returns {Object} 包含以下屬性：
         * - items: 根據 withEllipsis 參數決定返回完整頁面列表或帶省略號的頁面列表
         * - totalPage: 總頁數
         * - handleClickNext: 下一頁處理函數
         * - handleClickPrev: 上一頁處理函數
         */
        return {
            items: withEllipsis ? ellipsisItems : items,
            totalPage,
            handleClickNext,
            handleClickPrev,
        }; 

};

// 默認導出 usePagination hook
export default {usePagination};