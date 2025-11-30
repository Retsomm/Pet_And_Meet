export interface Animal {
  animal_id: string | number;
  animal_subid?: string;
  animal_area_pkid?: string;
  animal_shelter_pkid?: string;
  animal_place?: string;
  animal_kind?: string;
  animal_Variety?: string;
  animal_sex?: string;
  animal_bodytype?: string;
  animal_colour?: string;
  animal_age?: string;
  animal_sterilization?: string;
  animal_bacterin?: string;
  animal_foundplace?: string;
  animal_title?: string;
  animal_status?: string;
  animal_remark?: string;
  animal_caption?: string;
  animal_opendate?: string;
  animal_closeddate?: string;
  animal_update?: string;
  animal_createtime?: string;
  shelter_name?: string;
  album_file?: string;
  album_update?: string;
  cDate?: string;
  shelter_address?: string;
  shelter_tel?: string;
  // allow other dynamic keys from API
  [key: string]: any;
}

export interface UseFetchAnimalsResult {
  animals: Animal[];
  loading: boolean;
  error: any;
  refetch: () => void;
}

export interface UseUserCollectsResult {
  collects: (Animal & { id?: string })[] | null;
  loading: boolean;
}

export interface UseFavoriteResult {
  isCollected: boolean;
  toggleFavorite: () => Promise<any>;
  isLoggedIn: boolean;
}

export interface Filters {
  area?: string;
  type?: string;
  sex?: string;
  color?: string;
  bodytype?: string;
  variety?: string;
}

