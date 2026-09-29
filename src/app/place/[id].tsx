import MenuList from "@/components/MenuList";
import PlaceMap from "@/components/PlaceMap";
import ReviewList from "@/components/ReviewList";
import { calculateDistance, getCurrentUserLocation } from "@/lib/location";
import { getMenusByPlaceId } from "@/lib/database/menus";
import { getPlaceById } from "@/lib/database/places";
import { getReviewsByPlaceId } from "@/lib/database/reviews";
import { openExternalNavigation } from "@/lib/navigation";
import { Menu, Place, Review } from "@/types/place";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants";

export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [place, setPlace] = useState<Place | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCoords, setUserCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      const placeId = parseInt(id, 10);
      if (isNaN(placeId)) return;

      try {
        setLoading(true);
        // Load place, menus, and reviews from SQLite database
        const [fetchedPlace, fetchedMenus, fetchedReviews] = await Promise.all([
          getPlaceById(placeId),
          getMenusByPlaceId(placeId),
          getReviewsByPlaceId(placeId),
        ]);

        setPlace(fetchedPlace);
        setMenus(fetchedMenus);
        setReviews(fetchedReviews);

        // Fetch user current coordinates for distance calculation
        try {
          const userLoc = await getCurrentUserLocation();
          setUserCoords({
            latitude: userLoc.latitude,
            longitude: userLoc.longitude,
          });
        } catch {
          // GPS unavailable; ignore silently
        }
      } catch (err) {
        console.error("Error loading place details from SQLite:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const distanceKm =
    place && userCoords
      ? calculateDistance(
          userCoords.latitude,
          userCoords.longitude,
          place.latitude,
          place.longitude,
        )
      : undefined;

  const handleOpenNavigation = () => {
    if (!place) return;
    openExternalNavigation({
      latitude: place.latitude,
      longitude: place.longitude,
      name: place.name,
      userLatitude: userCoords?.latitude,
      userLongitude: userCoords?.longitude,
    });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-50 items-center justify-center">
        <ActivityIndicator size="large" color="#0286ff" />
        <Text className="mt-3 text-xs font-JakartaMedium text-neutral-500">
          Memuat detail dari SQLite...
        </Text>
      </SafeAreaView>
    );
  }

  if (!place) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-50 items-center justify-center p-6">
        <Text className="text-4xl mb-3">❌</Text>
        <Text className="text-lg font-JakartaBold text-neutral-800 mb-2">
          Tempat Kuliner Tidak Ditemukan
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-blue-600 px-6 py-3 rounded-xl"
        >
          <Text className="text-sm font-JakartaBold text-white">
            Kembali ke Beranda
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-50" edges={["top"]}>
      {/* Top Navigation Bar */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-neutral-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-10 w-10 rounded-full bg-neutral-100 items-center justify-center border border-neutral-200"
        >
          <Image
            source={icons.backArrow}
            className="h-5 w-5 tint-neutral-800"
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text className="text-base font-JakartaBold text-neutral-800">
          Detail Kuliner
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Restaurant Header Banner */}
        <View className="bg-white p-5 border-b border-neutral-100">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-2xl font-JakartaExtraBold text-neutral-800 flex-1 mr-3">
              {place.name}
            </Text>
            <View className="flex-row items-center bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              <Text className="text-sm text-amber-500 mr-1">⭐</Text>
              <Text className="text-sm font-JakartaBold text-amber-700">
                {place.rating}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mb-3">
            <Text className="text-xs font-JakartaBold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 mr-2">
              {place.category}
            </Text>
            {distanceKm !== undefined && (
              <Text className="text-xs font-JakartaMedium text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-md">
                📏 {distanceKm} km dari lokasi Anda
              </Text>
            )}
          </View>

          <Text className="text-xs font-JakartaRegular text-neutral-600 leading-relaxed">
            📍 {place.address}
          </Text>
        </View>

        {/* Mini Map View */}
        <View className="px-4 mt-4">
          <Text className="text-sm font-JakartaBold text-neutral-800 mb-2">
            Peta Lokasi Tempat
          </Text>
          <View className="h-44 w-full rounded-2xl overflow-hidden border border-neutral-200 shadow-sm">
            <PlaceMap
              userLatitude={userCoords?.latitude ?? null}
              userLongitude={userCoords?.longitude ?? null}
              places={[place]}
              selectedPlaceId={place.id}
            />
          </View>
        </View>

        {/* Menu Section */}
        <View className="px-4 mt-5">
          <View className="flex-row items-center justify-between mb-2.5">
            <Text className="text-base font-JakartaBold text-neutral-800">
              Daftar Menu ({menus.length})
            </Text>
            <Text className="text-xs font-JakartaMedium text-neutral-400">
              Disimpan di SQLite
            </Text>
          </View>
          <MenuList menus={menus} />
        </View>

        {/* Reviews Section */}
        <View className="px-4 mt-5">
          <View className="flex-row items-center justify-between mb-2.5">
            <Text className="text-base font-JakartaBold text-neutral-800">
              Ulasan Pengunjung ({reviews.length})
            </Text>
            <Text className="text-xs font-JakartaMedium text-neutral-400">
              Disimpan di SQLite
            </Text>
          </View>
          <ReviewList reviews={reviews} />
        </View>
      </ScrollView>

      {/* Floating Navigation Button */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-200 shadow-lg">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleOpenNavigation}
          className="flex-row items-center justify-center bg-blue-600 py-3.5 px-6 rounded-2xl shadow-md"
        >
          <Text className="text-lg mr-2">🧭</Text>
          <Text className="text-base font-JakartaBold text-white">
            Buka Navigasi (Google Maps)
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
