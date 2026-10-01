export interface Place {
  id: number;
  external_place_id?: string | null;
  name: string;
  description?: string | null;
  address: string;
  latitude: number;
  longitude: number;
  category: string;
  rating: number;
  image?: string | null;
  image_url?: string | null;
  created_at: string;
  distance?: number;
}

export interface Menu {
  id: number;
  place_id: number;
  restaurant_id?: number;
  name: string;
  description: string;
  price: number;
  image?: string | null;
  image_url?: string | null;
}

export interface Review {
  id: number;
  place_id: number;
  restaurant_id?: number;
  user_name: string;
  reviewer_name?: string;
  rating: number;
  comment: string;
  created_at: string;
}

export type PlaceFilter = "all" | "nearby" | "rating";
