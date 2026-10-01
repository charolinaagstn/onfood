import { Place } from "@/types/place";
import RestaurantMap from "./RestaurantMap";

interface PlaceMapProps {
  userLatitude: number | null;
  userLongitude: number | null;
  places: Place[];
  selectedPlaceId?: number | null;
  onSelectPlace?: (place: Place) => void;
  onUserLocationUpdate?: (location: { latitude: number; longitude: number; address: string }) => void;
}

export default function PlaceMap({
  userLatitude,
  userLongitude,
  places,
  selectedPlaceId,
  onSelectPlace,
  onUserLocationUpdate,
}: PlaceMapProps) {
  return (
    <RestaurantMap
      userLatitude={userLatitude}
      userLongitude={userLongitude}
      restaurants={places}
      selectedRestaurantId={selectedPlaceId}
      onViewDetails={onSelectPlace}
      onUserLocationUpdate={onUserLocationUpdate}
    />
  );
}
