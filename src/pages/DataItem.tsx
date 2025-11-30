import React from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useFetchAnimals } from "../hooks/useFetchAnimals";
import { useFavorite } from "../hooks/useFavorite";
import useToastStore from "../stores/useToastStore";
import useAuthStore from "../stores/useAuthStore";
import type { Animal } from "../types";

const keyMap: Record<string, string> = {
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

export default function DataItem() {
  const params = useParams();
  const id = params.id as string | undefined;
  const location = useLocation();
  const navigate = useNavigate();

  const { animals, loading, error } = useFetchAnimals();
  const { showWarning, showSuccess, showError } = useToastStore();
  const { isLoggedIn } = useAuthStore();

  const animal = React.useMemo(() => animals.find((a: Animal) => String(a.animal_id) === id), [animals, id]);

  const { isCollected, toggleFavorite } = useFavorite(animal as Animal | undefined);

  if (loading) return <span className="loading loading-ring loading-lg"></span>;
  if (error) return <div className="text-center mt-10">資料載入失敗</div>;
  if (!animal) return <div className="text-center mt-10">找不到毛孩資料</div>;

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(animal.animal_place || "")}`;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-base-100 shadow-lg rounded-lg sm:p-6 pb-20">
      <div className="mb-4">
        {Object.entries(animal).map(([key, value]) => (
          <div key={key} className="text-sm border-b py-1 flex">
            <span className="font-bold w-40">{(keyMap as any)[key] || key}：</span>
            <span className="flex-1 break-all">
              {key === "album_file" ? (
                <div className="relative w-auto h-full inline-block">
                  <img
                    src={String(value)}
                    alt="動物圖片"
                    className="w-full h-full"
                    loading="lazy"
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      img.onerror = null;
                      img.src = "/default.webp";
                    }}
                  />
                </div>
              ) : (
                String(value)
              )}
            </span>
          </div>
        ))}
      </div>

      <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="btn w-full mb-4">
        Google Map 導航
      </a>

      <button
        className={`btn w-full mb-4 ${isCollected ? "btn-error" : "btn-warning"}`}
        onClick={async () => {
          if (!isLoggedIn) {
            showWarning("請先登入才能收藏毛孩！");
            return;
          }
          try {
            const wasCollected = isCollected;
            const result = await toggleFavorite();
            if (result === false) {
              showError("請先登入才能收藏");
            } else {
              showSuccess(wasCollected ? "已取消收藏" : "已收藏");
            }
          } catch (error) {
            console.error("收藏操作失敗:", error);
            showError("操作失敗，請稍後再試");
          }
        }}
      >
        {isCollected ? "取消收藏" : "收藏這隻毛孩"}
      </button>

      <button
        className="btn btn-outline w-full"
        onClick={() => {
          if ((location.state as any)?.from === "collect") {
            navigate("/collect");
          } else if ((location.state as any)?.from === "/") {
            navigate("/");
          } else {
            navigate("/data");
          }
        }}
      >
        回到上一頁
      </button>
    </div>
  );
}
