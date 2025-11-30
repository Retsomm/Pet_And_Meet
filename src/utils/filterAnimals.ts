import type { Animal, Filters } from "../types";

export const filterAnimals = (animals: Animal[], filters: Filters) => {
  if (!Array.isArray(animals) || animals.length === 0) return [];

  const sexMap: Record<string, string> = {
    公: "M",
    母: "F",
    未知: "N",
  };

  const normalize = (s: any) => String(s || "").replace(/\s+/g, "").toLowerCase();
  const colorKeywords: Record<string, string[]> = {
    黑色: ["黑", "黑色"],
    白色: ["白", "白色"],
    棕色: ["棕", "棕色", "茶"],
    灰色: ["灰", "灰色"],
    虎斑: ["虎", "虎斑", "斑"],
    三色: ["三色"],
    花色: ["花", "花色"],
    其他: ["其他"],
  };

  const result = animals.filter((animal) => {
    const { area, type, sex, color, bodytype, variety } = filters || {};
    const areaMatch = !area || animal.animal_place?.includes(area);

    const kind = animal.animal_kind || "";
    const typeMatch =
      !type ||
      (type === "貓" && kind.includes("貓")) ||
      (type === "狗" && kind.includes("狗")) ||
      (type === "其他" && !kind.includes("貓") && !kind.includes("狗"));

    const sexMatch = !sex || animal.animal_sex === sexMap[sex as string];

    const selected = normalize(color);
    const animalColor = normalize(animal.animal_colour);
    let colorMatch = true;
    if (selected) {
      const keywords = (colorKeywords as any)[color] || [color];
      colorMatch = keywords.some((kw: string) => animalColor.includes(normalize(kw)));
    }

    const bodyTypeMatch = !bodytype || normalize(animal.animal_bodytype || "").includes(normalize(bodytype));

    const varietyMatch = !variety || normalize(animal.animal_Variety || "").includes(normalize(variety));

    return areaMatch && typeMatch && sexMatch && colorMatch && bodyTypeMatch && varietyMatch;
  });

  return result;
};

export default filterAnimals;
