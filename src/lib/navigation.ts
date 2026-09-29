import { Alert, Linking, Platform } from "react-native";

export async function openExternalNavigation({
  latitude,
  longitude,
  name,
  userLatitude,
  userLongitude,
}: {
  latitude: number;
  longitude: number;
  name: string;
  userLatitude?: number | null;
  userLongitude?: number | null;
}): Promise<void> {
  const encodedName = encodeURIComponent(name);

  let url = "";
  if (userLatitude && userLongitude) {
    url = `https://www.google.com/maps/dir/?api=1&origin=${userLatitude},${userLongitude}&destination=${latitude},${longitude}&destination_place_id=${encodedName}`;
  } else {
    url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&destination_place_id=${encodedName}`;
  }

  const geoUrl =
    Platform.OS === "android"
      ? `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodedName})`
      : `http://maps.apple.com/?daddr=${latitude},${longitude}`;

  try {
    const canOpenWeb = await Linking.canOpenURL(url);
    if (canOpenWeb) {
      await Linking.openURL(url);
    } else {
      await Linking.openURL(geoUrl);
    }
  } catch (error) {
    console.warn("Gagal membuka URL navigasi utama, mencoba fallback:", error);
    try {
      await Linking.openURL(geoUrl);
    } catch {
      Alert.alert(
        "Gagal Membuka Navigasi",
        "Tidak dapat membuka aplikasi navigasi di perangkat ini. Pastikan Google Maps terinstal.",
      );
    }
  }
}
