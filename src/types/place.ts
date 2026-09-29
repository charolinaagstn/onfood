export interface Place {
  id: number;
  external_place_id?: string | null;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  category: string;
  rating: number;
  created_at: string;
  distance?: number; // Distance in kilometers from user location
  image_url?: string;
}

export interface Menu {
  id: number;
  place_id: number;
  name: string;
  description: string;
  price: number;
}

export interface Review {
  id: number;
  place_id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export type PlaceFilter = "all" | "nearby" | "rating";
