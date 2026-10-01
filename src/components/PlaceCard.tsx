import { Place } from "@/types/place";
import RestaurantCard from "./RestaurantCard";

interface PlaceCardProps {
  place: Place;
  onPress: () => void;
}

export default function PlaceCard({ place, onPress }: PlaceCardProps) {
  return <RestaurantCard restaurant={place} onPress={onPress} />;
}
