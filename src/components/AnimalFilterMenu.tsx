import React from "react";
import type { Filters } from "../types";

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

const TYPES = ["全部", "貓", "狗", "其他"];
const SEXES = ["全部", "公", "母", "未知"];
const COLORS = ["全部", "黑色", "白色", "棕色", "灰色", "虎斑", "三色", "花色", "其他"];
const BODY_TYPES = ["全部", "小型", "中型", "大型", "未知"];
const VARIETIES = ["全部", "混種", "短毛", "長毛", "其他"];

type FilterButtonGroupProps = {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
};

const FilterButtonGroup: React.FC<FilterButtonGroupProps> = ({ label, options, value, onChange, className = "" }) => (
  <div className={`mb-6 ${className}`}>
    <div className="mb-2 font-bold">{label}</div>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          className={`btn btn-outline btn-sm ${value === option || (value === "" && option === "全部") ? "btn-primary" : ""}`}
          onClick={() => onChange(option === "全部" ? "" : option)}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

type Props = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onConfirm: () => void;
  onReset: () => void;
  onClose: (e?: any) => void;
  varieties?: string[];
};

const AnimalFilterMenu: React.FC<Props> = ({ filters, setFilters, onConfirm, onReset, onClose, varieties }) => (
  <div className="fixed w-screen h-screen top-0 left-0 z-50 p-8 bg-base-100 overflow-y-auto">
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-2xl font-bold">篩選條件</h2>
      <button className="text-2xl" onClick={(e) => onClose?.(e)}>×</button>
    </div>

    <FilterButtonGroup label="地區" options={AREAS} value={filters.area || ""} onChange={(area) => setFilters((f) => ({ ...f, area }))} />
    <FilterButtonGroup label="種類" options={TYPES} value={filters.type || ""} onChange={(type) => setFilters((f) => ({ ...f, type }))} className="flex-nowrap" />
    <FilterButtonGroup label="性別" options={SEXES} value={filters.sex || ""} onChange={(sex) => setFilters((f) => ({ ...f, sex }))} className="flex-nowrap" />
    <FilterButtonGroup label="體型" options={BODY_TYPES} value={filters.bodytype || ""} onChange={(bodytype) => setFilters((f) => ({ ...f, bodytype }))} className="flex-nowrap" />
    <FilterButtonGroup label="品種" options={varieties && Array.isArray(varieties) && varieties.length > 0 ? varieties : VARIETIES} value={filters.variety || ""} onChange={(variety) => setFilters((f) => ({ ...f, variety }))} className="flex-nowrap" />
    <FilterButtonGroup label="毛色" options={COLORS} value={filters.color || ""} onChange={(color) => setFilters((f) => ({ ...f, color }))} className="flex-nowrap" />

    <div className="flex gap-4 mt-12">
      <button className="btn btn-outline flex-1" onClick={(e) => onReset?.()}>重置</button>
      <button className="btn btn-outline flex-1" onClick={(e) => onConfirm?.()}>確認</button>
    </div>
  </div>
);

export default React.memo(AnimalFilterMenu);
