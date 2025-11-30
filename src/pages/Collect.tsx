import React, { useEffect, useRef } from "react";
import AnimalCard from "../components/AnimalCard";
import { useUserCollects } from "../hooks/useUserCollects";
import useAuthStore from "../stores/useAuthStore";
import { useFetchAnimals } from "../hooks/useFetchAnimals";
import { useSyncFavoritesWithAPI } from "../hooks/useSyncFavoritesWithAPI";
import type { Animal } from "../types";

export default function Collect() {
  const { isLoggedIn } = useAuthStore();
  const { collects, loading } = useUserCollects();
  const { animals, loading: animalsLoading, refetch } = useFetchAnimals();
  const hasRefetched = useRef(false);

  useEffect(() => {
    if (isLoggedIn && !hasRefetched.current) {
      hasRefetched.current = true;
      refetch();
    }
  }, [isLoggedIn, refetch]);

  useSyncFavoritesWithAPI(animals, animalsLoading);

  const validCollects = collects?.filter((c) => animals.some((a) => a.animal_id === c.animal_id)) || [];

  if (!isLoggedIn) {
    return (
      <div className="w-full mx-auto flex flex-col items-center mt-10 h-screen justify-center">
        <h2 className="text-2xl font-bold mb-4 text-center">我的收藏</h2>
        <div className="text-center">請先登入</div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto h-screen justify-center mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center sm:mt-5">我的收藏</h2>

      {loading || animalsLoading ? (
        <div className="flex justify-center items-center h-40">
          <span className="loading loading-infinity loading-xl"></span>
        </div>
      ) : validCollects.length === 0 ? (
        <div className="text-center">尚未收藏任何毛孩</div>
      ) : (
        <div className="flex flex-wrap justify-center items-center pb-20 sm:pb-8">
          {validCollects.map((animal: Animal & { id?: string }) => (
            <AnimalCard key={animal.id || String(animal.animal_id)} animal={animal} isCollected={true} from="collect" />
          ))}
        </div>
      )}
    </div>
  );
}
