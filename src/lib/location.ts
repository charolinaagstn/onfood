import * as Location from "expo-location";
import { Platform } from "react-native";

export type CurrentUserLocation = {
  latitude: number;
  longitude: number;
  address: string;
};

const formatAddress = (
  address: Location.LocationGeocodedAddress | undefined,
  coords: { latitude: number; longitude: number },
) => {
  if (!address) {
    return `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`;
  }

  const parts = [
    address.name,
    address.street,
    address.district,
    address.city,
    address.region,
  ].filter(Boolean);

  return parts.length > 0
    ? parts.join(", ")
    : `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`;
};

export async function getCurrentUserLocation(): Promise<CurrentUserLocation> {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    throw new Error("Izin lokasi ditolak. Aktifkan izin lokasi untuk melihat titik jemput Anda.");
  }

  if (Platform.OS === "android") {
    try {
      await Location.enableNetworkProviderAsync();
    } catch {
      // User can skip Android high-accuracy prompt; GPS may still return a location.
    }
  }

  let location: Location.LocationObject | null = null;

  try {
    location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
  } catch {
    location = await Location.getLastKnownPositionAsync();
  }

  if (!location) {
    throw new Error(
      "Lokasi belum tersedia. Pastikan GPS emulator aktif dan lokasi sudah diset.",
    );
  }

  const coords = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };

  let reverseGeocoded: Location.LocationGeocodedAddress[] = [];

  try {
    reverseGeocoded = await Location.reverseGeocodeAsync(coords);
  } catch {
    reverseGeocoded = [];
  }

  return {
    ...coords,
    address: formatAddress(reverseGeocoded[0], coords),
  };
}

/**
 * Calculates distance in kilometers between two geographic coordinates using Haversine formula.
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Rounded to 1 decimal place
}

