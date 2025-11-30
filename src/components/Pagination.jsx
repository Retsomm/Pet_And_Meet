import React from "react";

/**
 * Pagination component
 * Props:
 * - totalPage: number
 * - currentPage: number
 * - items: array (from usePagination, contains page/ellipsis items)
 * - onPageChange: function (page:number) => void
 * - onPrev: function => void
 * - onNext: function => void
 */
const PageButton = React.memo(({ pageNum, isActive, onClick }) => (
  <button
    className={`btn btn-sm ${isActive ? "btn-primary" : "btn-outline"}`}
    onClick={() => onClick(pageNum)}
  >
    {pageNum}
  </button>
));

export default function Pagination({
  totalPage,
  currentPage,
  items = [],
  onPageChange,
  onPrev,
  onNext,
}) {
  return (
    <>
      {/* Desktop & Tablet: full pagination (sm and up) */}
      <div className="hidden sm:flex justify-center items-center gap-2 my-8 pb-20 sm:pb-8">
        <button
          className="btn btn-outline btn-sm"
          disabled={currentPage === 1}
          onClick={onPrev}
        >
          上一頁
        </button>

        {items.map((item, idx) => {
          if (item.type === "page") {
            return (
              <PageButton
                key={item.page}
                pageNum={item.page}
                isActive={item.isCurrent}
                onClick={onPageChange}
              />
            );
          }
          if (item.type === "start-ellipsis" || item.type === "end-ellipsis") {
            return (
              <span key={`ellipsis-${idx}`} className="px-2">
                ...
              </span>
            );
          }
          return null;
        })}

        <button
          className="btn btn-outline btn-sm"
          disabled={currentPage === totalPage}
          onClick={onNext}
        >
          下一頁
        </button>
      </div>

      {/* Mobile: simplified pagination */}
      <div className="flex sm:hidden justify-center items-center gap-2 my-8 pb-20">
        <button
          className="btn btn-ghost btn-sm"
          aria-label="上一頁"
          disabled={currentPage === 1}
          onClick={onPrev}
        >
          ◀
        </button>

        <button
          className={`btn btn-sm ${currentPage === 1 ? "btn-primary" : "btn-outline"}`}
          onClick={() => onPageChange(1)}
        >
          1
        </button>

        {totalPage > 2 && (
          <button
            className={`btn btn-sm ${currentPage !== 1 && currentPage !== totalPage ? "btn-primary" : "btn-outline"}`}
            onClick={() => onPageChange(currentPage)}
          >
            {currentPage}
          </button>
        )}

        {totalPage > 1 && (
          <button
            className={`btn btn-sm ${currentPage === totalPage ? "btn-primary" : "btn-outline"}`}
            onClick={() => onPageChange(totalPage)}
          >
            {totalPage}
          </button>
        )}

        <button
          className="btn btn-ghost btn-sm"
          aria-label="下一頁"
          disabled={currentPage === totalPage}
          onClick={onNext}
        >
          ▶
        </button>
      </div>
    </>
  );
}
