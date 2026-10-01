import { icons } from "@/constants";
import { getCurrentUserLocation } from "@/lib/location";
import { Place } from "@/types/place";
import { useEffect, useMemo, useRef, useState } from "react";
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
import RestaurantPreviewCard from "./RestaurantPreviewCard";

interface RestaurantMapProps {
  userLatitude: number | null;
  userLongitude: number | null;
  restaurants: Place[];
  selectedRestaurantId?: number | null;
  onViewDetails?: (restaurant: Place) => void;
  onUserLocationUpdate?: (location: { latitude: number; longitude: number; address: string }) => void;
}

const PALEMBANG_DEFAULT = {
  latitude: -2.9761,
  longitude: 104.7754,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function RestaurantMap({
  userLatitude,
  userLongitude,
  restaurants,
  selectedRestaurantId,
  onViewDetails,
  onUserLocationUpdate,
}: RestaurantMapProps) {
  const mapRef = useRef<MapView>(null);
  const insets = useSafeAreaInsets();

  const [activeRestaurant, setActiveRestaurant] = useState<Place | null>(null);

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

  useEffect(() => {
    if (selectedRestaurantId) {
      const match = restaurants.find((r) => r.id === selectedRestaurantId);
      if (match) {
        setActiveRestaurant(match);
      }
    }
  }, [selectedRestaurantId, restaurants]);

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
        "Lokasi Belum Aktif",
        error instanceof Error
          ? error.message
          : "Izin lokasi belum diberikan. Menampilkan peta wilayah Palembang.",
      );
    }
  };

  const handleMarkerPress = (restaurant: Place) => {
    setActiveRestaurant(restaurant);
    mapRef.current?.animateToRegion(
      {
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      300,
    );
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
        onPress={() => setActiveRestaurant(null)}
      >
        {restaurants.map((restaurant) => {
          const isSelected = activeRestaurant?.id === restaurant.id;
          return (
            <Marker
              key={restaurant.id}
              coordinate={{
                latitude: restaurant.latitude,
                longitude: restaurant.longitude,
              }}
              title={restaurant.name}
              description={`${restaurant.category} • ⭐ ${restaurant.rating}`}
              onPress={() => handleMarkerPress(restaurant)}
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

      {/* Recenter Button */}
      <TouchableOpacity
        accessibilityLabel="Pusatkan ke lokasi saya"
        activeOpacity={0.8}
        className="absolute right-4 h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg shadow-black/10 border border-neutral-200"
        onPress={handleRecenterToUser}
        style={{ top: insets.top + 12 }}
      >
        <Image source={icons.target} className="h-5 w-5" resizeMode="contain" />
      </TouchableOpacity>

      {/* In-app Map Marker Preview Card */}
      {activeRestaurant && onViewDetails && (
        <RestaurantPreviewCard
          restaurant={activeRestaurant}
          onViewDetails={(resto) => onViewDetails(resto)}
          onClose={() => setActiveRestaurant(null)}
        />
      )}
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
