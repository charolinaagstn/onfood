import { icons } from "@/constants";
import { getCurrentUserLocation } from "@/lib/location";
import { Place } from "@/types/place";
import { useEffect, useMemo, useRef } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface PlaceMapProps {
  userLatitude: number | null;
  userLongitude: number | null;
  places: Place[];
  selectedPlaceId?: number | null;
  onSelectPlace?: (place: Place) => void;
  onUserLocationUpdate?: (location: { latitude: number; longitude: number; address: string }) => void;
}

const PALEMBANG_DEFAULT = {
  latitude: -2.9761,
  longitude: 104.7754,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function PlaceMap({
  userLatitude,
  userLongitude,
  places,
  selectedPlaceId,
  onSelectPlace,
  onUserLocationUpdate,
}: PlaceMapProps) {
  const mapRef = useRef<MapView>(null);
  const insets = useSafeAreaInsets();

  const region = useMemo(() => {
    if (userLatitude && userLongitude) {
      return {
        latitude: userLatitude,
        longitude: userLongitude,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      };
    }
    return PALEMBANG_DEFAULT;
  }, [userLatitude, userLongitude]);

  useEffect(() => {
    mapRef.current?.animateToRegion(region, 500);
  }, [region]);

  const handleRecenterToUser = async () => {
    try {
      const location = await getCurrentUserLocation();
      if (onUserLocationUpdate) {
        onUserLocationUpdate(location);
      }
      mapRef.current?.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        500,
      );
    } catch (error) {
      Alert.alert(
        "Lokasi Tidak Terdeteksi",
        error instanceof Error
          ? error.message
          : "Izin lokasi belum diberikan. Lokasi default Palembang digunakan.",
      );
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={false}
        userInterfaceStyle="light"
        minZoomLevel={5}
        maxZoomLevel={20}
      >
        {places.map((place) => {
          const isSelected = selectedPlaceId === place.id;
          return (
            <Marker
              key={place.id}
              coordinate={{
                latitude: place.latitude,
                longitude: place.longitude,
              }}
              title={place.name}
              description={`${place.category} • ⭐ ${place.rating}`}
              onPress={() => onSelectPlace?.(place)}
            >
              <View
                style={[
                  styles.markerContainer,
                  isSelected && styles.selectedMarkerContainer,
                ]}
              >
                <Text style={styles.markerEmoji}>🍴</Text>
              </View>
            </Marker>
          );
        })}
      </MapView>

      <TouchableOpacity
        accessibilityLabel="Pusatkan ke lokasi saya"
        activeOpacity={0.8}
        className="absolute right-4 h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg shadow-neutral-400 border border-neutral-200"
        onPress={handleRecenterToUser}
        style={{ top: insets.top + 12 }}
      >
        <Image source={icons.target} className="h-6 w-6" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  markerContainer: {
    backgroundColor: "#ffffff",
    padding: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#0286ff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  selectedMarkerContainer: {
    backgroundColor: "#ff9500",
    borderColor: "#ffffff",
    transform: [{ scale: 1.25 }],
  },
  markerEmoji: {
    fontSize: 16,
  },
});
