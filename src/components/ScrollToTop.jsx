import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * ScrollToTop 組件
 * 監聽路由變化，每次切換頁面時自動滾動到頂部
 */
function ScrollToTop() {
  const location = useLocation();
// 當 location.pathname 改變時，執行滾動到頂部的效果
// scrollTo(x, y) 中的 x 和 y 分別代表水平和垂直方向的滾動位置
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

export default ScrollToTop;
