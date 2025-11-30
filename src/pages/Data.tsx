import React, { useState } from "react";
import { useFetchAnimals } from "../hooks/useFetchAnimals";
import { filterAnimals } from "../utils/filterAnimals";
import AnimalCard from "../components/AnimalCard";
import { useUserCollects } from "../hooks/useUserCollects";
import AnimalFilterMenu from "../components/AnimalFilterMenu";
import AnimalSkeleton from "../components/AnimalSkeleton";
import { usePagination } from "../hooks/usePagination";
import Pagination from "../components/Pagination";
import type { Filters, Animal } from "../types";

const AnimalSkeletons: React.FC<{ count?: number }> = ({ count = 9 }) => (
  <div className="flex flex-wrap justify-center items-center gap-3 m-3 px-4">
    {Array.from({ length: count }).map((_, idx) => (
      <AnimalSkeleton key={idx} />
    ))}
  </div>
);

const Data: React.FC = () => {
  const { animals, loading, error } = useFetchAnimals();
  const { collects = [] } = useUserCollects();

  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<Filters>({ area: "", type: "", sex: "", color: "", bodytype: "", variety: "" });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 18;

  const filteredAnimals = (() => {
    const result = filterAnimals(animals, filters);
    return Array.isArray(result) ? result : [];
  })();

  const varieties = (() => {
    if (!Array.isArray(animals) || animals.length === 0) return [];
    const set = new Set<string>();
    animals.forEach((a: Animal) => {
      const v = a.animal_Variety;
      if (!v) return;
      v.split(new RegExp("[/,、]"))
        .map((tok) => String(tok || "").trim())
        .forEach((t) => t && set.add(t));
    });
    const arr = Array.from(set).sort();
    return ["全部", ...arr];
  })();

  const pagination = usePagination({
    page: currentPage,
    pageSize: itemsPerPage,
    total: filteredAnimals.length,
    withEllipsis: true,
    onChange: setCurrentPage,
  });

  const pageNum = currentPage || 1;
  const currentAnimals = (() => {
    const startIndex = (pageNum - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return Array.isArray(filteredAnimals) ? filteredAnimals.slice(startIndex, endIndex) : [];
  })();

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const handleFilter = () => setShowFilter(false);
  const handleReset = () => setFilters({ area: "", type: "", sex: "", color: "", bodytype: "", variety: "" });

  return (
    <div className="relative min-h-screen sm:pt-10">
      <div className="top-17 left-0 right-0 shadow-sm z-40 flex justify-center items-center sm:mt-6">
        <div className="flex justify-center items-center py-4 px-4 w-screen">
          <button className="btn btn-outline bg-base-100" onClick={() => setShowFilter(true)}>
            🔍 篩選條件
          </button>
        </div>
      </div>

      {showFilter && (
        <AnimalFilterMenu
          filters={filters}
          setFilters={setFilters}
          onConfirm={handleFilter}
          onReset={handleReset}
          onClose={() => setShowFilter(false)}
          varieties={varieties}
        />
      )}

      {loading ? (
        <AnimalSkeletons count={9} />
      ) : error ? (
        <div className="text-center mt-10">資料載入失敗</div>
      ) : (
        <>
          <div className="flex flex-wrap justify-center items-center px-4">
            {currentAnimals.length === 0 ? (
              <div className="w-full text-center py-16">
                <p className="text-lg font-medium">找不到符合條件的毛孩</p>
                <p className="text-sm text-muted mt-2">請嘗試放寬篩選條件或重設篩選。</p>
                <div className="mt-4 flex justify-center">
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      handleReset();
                      setShowFilter(false);
                    }}
                  >
                    清除篩選
                  </button>
                </div>
              </div>
            ) : (
              currentAnimals.map((animal: Animal) => {
                const isCollected = Array.isArray(collects) && collects.some((item) => item.animal_id === animal.animal_id);
                return <AnimalCard key={String(animal.animal_id)} animal={animal} isCollected={isCollected} from="data" />;
              })
            )}
          </div>

          {pagination.totalPage > 1 && (
            <Pagination
              totalPage={pagination.totalPage}
              currentPage={currentPage}
              items={pagination.items}
              onPageChange={setCurrentPage}
              onPrev={pagination.handleClickPrev}
              onNext={pagination.handleClickNext}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Data;
