import React from "react";

type Props = {
  currentPage: number;
  totalPage: number;
  onPageChange?: (page: number) => void;
  onPrev?: () => void;
  onNext?: () => void;
  items?: any[]; // optional, kept for compatibility with existing Data.jsx usage
};

const Pagination: React.FC<Props> = ({ currentPage, totalPage, onPageChange, onPrev, onNext, items }) => {
  const pages = Array.from({ length: Math.max(0, totalPage) }).map((_, i) => i + 1);

  const handlePrev = () => {
    if (onPrev) return onPrev();
    if (onPageChange) return onPageChange(Math.max(1, currentPage - 1));
  };

  const handleNext = () => {
    if (onNext) return onNext();
    if (onPageChange) return onPageChange(Math.min(totalPage, currentPage + 1));
  };

  // 如果上層傳入 items（來自 usePagination, 含省略號標記），使用該陣列渲染
  const renderFromItems = (itemsArr: any[]) => (
    <div className="flex items-center justify-center gap-2 mb-24 mt-4 sm:my-8 ">
      <button className="btn btn-sm" onClick={handlePrev} disabled={currentPage <= 1}>
        上一頁
      </button>

      {itemsArr.map((it, idx) => {
        if (it.type === "start-ellipsis" || it.type === "end-ellipsis") {
          return (
            <span key={idx} className="px-2 text-sm text-muted">
              ...
            </span>
          );
        }
        // page item
        return (
          <button
            key={idx}
            className={`btn btn-sm ${it.isCurrent ? "btn-primary" : ""}`}
            onClick={() => onPageChange?.(it.page)}
          >
            {it.page}
          </button>
        );
      })}

      <button className="btn btn-sm" onClick={handleNext} disabled={currentPage >= totalPage}>
        下一頁
      </button>
    </div>
  );

  return items && items.length > 0 ? (
    renderFromItems(items)
  ) : (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button className="btn btn-sm" onClick={handlePrev} disabled={currentPage <= 1}>
        上一頁
      </button>

      {pages.map((p) => (
        <button key={p} className={`btn btn-sm ${p === currentPage ? "btn-primary" : ""}`} onClick={() => onPageChange?.(p)}>
          {p}
        </button>
      ))}

      <button className="btn btn-sm" onClick={handleNext} disabled={currentPage >= totalPage}>
        下一頁
      </button>
    </div>
  );
};

export default Pagination;
