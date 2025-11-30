import React from "react";
import { useFavorite } from "../hooks/useFavorite";
import  useAuthStore  from "../stores/useAuthStore";
import  useToastStore  from "../stores/useToastStore";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import type { Animal } from "../types";

type Props = {
  animal: Animal;
  from?: string;
  isCollected?: boolean;
};

const AnimalCard: React.FC<Props> = ({ animal, from = "data", isCollected: propsIsCollected }) => {
  const { isCollected: collectedState, toggleFavorite } = useFavorite(animal);
  // 支援從父層傳入的 isCollected prop；建立 local state 以便於在切換或重設篩選時保持 UI 一致
  const [collected, setCollected] = React.useState<boolean>(
    typeof (propsIsCollected as any) !== "undefined" ? (propsIsCollected as boolean) : collectedState
  );

  // 更新 local collected 當父層 prop 或後端 snapshot 改變時
  React.useEffect(() => {
    if (typeof (propsIsCollected as any) !== "undefined") {
      setCollected(propsIsCollected as boolean);
    } else {
      setCollected(collectedState);
    }
  }, [propsIsCollected, collectedState]);
  const { isLoggedIn } = useAuthStore();
  const { showSuccess, showError } = useToastStore();
  const navigate = useNavigate();

  const sexDisplay: Record<string, string> = {
    M: "公",
    F: "母",
    N: "未知",
  };

  const bodySize: Record<string, string> = {
    SMALL: "小型",
    MEDIUM: "中型",
    BIG: "大型",
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget as HTMLImageElement;
    img.onerror = null;
    img.src = "/default.webp";
  };

  // 處理 shelter_date 可能為空或無效的情況，避免 formatDistanceToNow 拋出 "Invalid time value"
  const shelterDate = animal?.shelter_date ? new Date(animal.shelter_date) : null;
  const shelterDateText =
    shelterDate instanceof Date && !isNaN(shelterDate.getTime())
      ? `${formatDistanceToNow(shelterDate)} 前上架`
      : "上架時間未知";

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      showError("請先登入");
      return;
    }

    const next = !collected;
    // optimistic UI
    setCollected(next);

    const ok = await toggleFavorite();
    if (!ok) {
      // revert on failure
      setCollected(!next);
      showError("操作失敗，請稍後再試");
      return;
    }

    showSuccess(next ? "已加入收藏" : "已取消收藏");
  };

  const handleDetailClick = () => {
    navigate(`/animal/${animal.animal_id}`, { state: { from } });
  };

  return (
    <div className="card bg-base-100 w-96 shadow-xl gap-3 m-3 relative min-h-60">
      <div className="flex min-h-60 w-96">
        <figure className="w-1/2 flex-shrink-0 aspect-square">
          <img
            src={animal.album_file}
            alt={animal.animal_Variety}
            className="w-full h-full"
            loading="lazy"
            onError={handleImageError}
          />
        </figure>

        <div className="card-body w-1/2 p-4 overflow-hidden">
          <h2 className="card-title truncate">{animal.animal_Variety}</h2>

          <p className="truncate">地區：{String(animal.animal_place || "").slice(0, 3)}</p>
          <p>性別：{sexDisplay[animal.animal_sex]}</p>
          <p>顏色：{animal.animal_colour}</p>
          <p>體型：{bodySize[animal.animal_bodytype]}</p>

          <div className="card-actions justify-end mt-2 flex-nowrap">
            <button
              className="btn btn-ghost btn-sm"
              disabled={!isLoggedIn}
              onClick={handleToggle}
              aria-label={collected ? "已收藏" : "收藏"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={collected ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            </button>

            <button className="btn btn-primary btn-sm" onClick={handleDetailClick}>
              詳細資料
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AnimalCard);
