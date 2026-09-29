import { icons } from "@/constants";
import { useFetch } from "@/lib/fetch";
import { getCurrentUserLocation } from "@/lib/location";
import {
  calculateDriverTimes,
  calculateRegion,
  generateMarkersFromData,
} from "@/lib/map";
import { useDriverStore, useLocationStore } from "@/store";
import { Driver, MarkerData } from "@/types/type";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, {
  LatLng,
  Marker,
  Polyline,
  PROVIDER_DEFAULT,
} from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const OSRM_BASE_URL =
  process.env.EXPO_PUBLIC_OSRM_BASE_URL ?? "https://router.project-osrm.org";

type OsrmRouteResponse = {
  code: string;
  routes?: {
    geometry?: {
      coordinates?: [number, number][];
    };
  }[];
  message?: string;
};

const Map = () => {
  const { data: drivers, loading, error } = useFetch<Driver[]>("/(api)/driver");

  const {
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
    setUserLocation,
  } = useLocationStore();

  const { selectedDriver, setDrivers } = useDriverStore();
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [routeCoordinates, setRouteCoordinates] = useState<LatLng[]>([]);
  const mapRef = useRef<MapView>(null);
  const insets = useSafeAreaInsets();
  const hasDestinationCoordinates =
    destinationLatitude !== null &&
    destinationLongitude !== null &&
    Number.isFinite(destinationLatitude) &&
    Number.isFinite(destinationLongitude);

  const region = useMemo(
    () =>
      calculateRegion({
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
      }),
    [userLatitude, userLongitude, destinationLatitude, destinationLongitude],
  );

  useEffect(() => {
    if (!Array.isArray(drivers)) return;

    const newMarkers = generateMarkersFromData({
      data: drivers,
      userLatitude: userLatitude ?? region.latitude,
      userLongitude: userLongitude ?? region.longitude,
    });

    setMarkers(newMarkers);
    setDrivers(newMarkers);
  }, [
    drivers,
    region.latitude,
    region.longitude,
    setDrivers,
    userLatitude,
    userLongitude,
  ]);

  const handleRecenterToUser = async () => {
    try {
      const location = await getCurrentUserLocation();
      setUserLocation(location);
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
          : "Kami belum bisa membaca lokasi Anda. Pastikan GPS aktif lalu coba lagi.",
      );
    }
  };

  useEffect(() => {
    if (
      markers.length > 0 &&
      userLatitude !== null &&
      userLongitude !== null &&
      hasDestinationCoordinates
    ) {
      calculateDriverTimes({
        markers,
        userLongitude,
        userLatitude,
        destinationLatitude,
        destinationLongitude,
      }).then((drivers) => {
        setDrivers(drivers);
      });
    }
  }, [
    markers,
    setDrivers,
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
    hasDestinationCoordinates,
  ]);

  useEffect(() => {
    mapRef.current?.animateToRegion(region, 500);
  }, [region]);

  useEffect(() => {
    if (
      userLatitude === null ||
      userLongitude === null ||
      !hasDestinationCoordinates
    ) {
      setRouteCoordinates([]);
      return;
    }

    const abortController = new AbortController();

    const loadRoute = async () => {
      try {
        const coordinates = `${userLongitude},${userLatitude};${destinationLongitude},${destinationLatitude}`;
        const url = `${OSRM_BASE_URL}/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;
        const response = await fetch(url, { signal: abortController.signal });

        if (!response.ok) {
          throw new Error(`OSRM request failed with status ${response.status}`);
        }

        const data = (await response.json()) as OsrmRouteResponse;
        const geometry = data.routes?.[0]?.geometry?.coordinates;

        if (data.code !== "Ok" || !geometry?.length) {
          throw new Error(data.message ?? "OSRM route is not available.");
        }

        setRouteCoordinates(
          geometry.map(([longitude, latitude]) => ({
            latitude,
            longitude,
          })),
        );
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;

        console.warn("Unable to load OSRM route:", error);
        setRouteCoordinates([]);
      }
    };

    loadRoute();

    return () => {
      abortController.abort();
    };
  }, [
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
    hasDestinationCoordinates,
  ]);

  if (loading)
    return (
      <View className="flex justify-between items-center w-full">
        <ActivityIndicator size="small" color="#000" />
      </View>
    );

  if (error)
    return (
      <View className="flex justify-between items-center w-full">
        <Text>Error: {error}</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={region}
        tintColor="black"
        mapType="standard"
        showsPointsOfInterests={false}
        showsUserLocation={true}
        showsMyLocationButton={false}
        userInterfaceStyle="light"
        minZoomLevel={7}
        maxZoomLevel={20}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            image={
              Number(selectedDriver) === Number(marker.id)
                ? icons.selectedMarker
                : icons.marker
            }
          />
        ))}

        {hasDestinationCoordinates && (
          <Marker
            key="destination"
            coordinate={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            title="Destination"
            image={icons.pin}
          />
        )}

        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            lineCap="round"
            lineJoin="round"
            geodesic
            strokeColor="#0286ff"
            strokeWidth={4}
          />
        )}
      </MapView>

      <TouchableOpacity
        accessibilityLabel="Pusatkan ke lokasi saya"
        activeOpacity={0.75}
        className="absolute right-5 h-11 w-11 items-center justify-center rounded-full bg-white shadow-md shadow-neutral-400"
        onPress={handleRecenterToUser}
        style={{ top: insets.top + 72 }}
      >
        <Image source={icons.target} className="h-5 w-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
});

export default Map;
