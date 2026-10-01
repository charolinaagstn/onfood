import MenuItemCard from "@/components/MenuItemCard";
import RestaurantMap from "@/components/RestaurantMap";
import ReviewList from "@/components/ReviewList";
import { icons } from "@/constants";
import { getMenusByPlaceId } from "@/lib/database/menus";
import { getPlaceById } from "@/lib/database/places";
import { getReviewsByPlaceId } from "@/lib/database/reviews";
import { calculateDistance, getCurrentUserLocation } from "@/lib/location";
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

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [restaurant, setRestaurant] = useState<Place | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroImageError, setHeroImageError] = useState(false);
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
        const [fetchedPlace, fetchedMenus, fetchedReviews] = await Promise.all([
          getPlaceById(placeId),
          getMenusByPlaceId(placeId),
          getReviewsByPlaceId(placeId),
        ]);

        setRestaurant(fetchedPlace);
        setMenus(fetchedMenus);
        setReviews(fetchedReviews);

        try {
          const userLoc = await getCurrentUserLocation();
          setUserCoords({
            latitude: userLoc.latitude,
            longitude: userLoc.longitude,
          });
        } catch {
          // GPS unavailable
        }
      } catch (err) {
        console.error("Error loading restaurant profile from SQLite:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const distanceKm =
    restaurant && userCoords
      ? calculateDistance(
          userCoords.latitude,
          userCoords.longitude,
          restaurant.latitude,
          restaurant.longitude,
        )
      : undefined;

  const handleOpenNavigation = () => {
    if (!restaurant) return;
    openExternalNavigation({
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
      name: restaurant.name,
      userLatitude: userCoords?.latitude,
      userLongitude: userCoords?.longitude,
    });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-50 items-center justify-center">
        <ActivityIndicator size="large" color="#0286ff" />
        <Text className="mt-3 text-xs font-JakartaMedium text-neutral-500">
          Memuat profil kuliner dari SQLite...
        </Text>
      </SafeAreaView>
    );
  }

  if (!restaurant) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-50 items-center justify-center p-6">
        <Text className="text-4xl mb-3">❌</Text>
        <Text className="text-lg font-JakartaBold text-neutral-800 mb-2">
          Profil Tempat Kuliner Tidak Ditemukan
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

  const imageUrl = restaurant.image || restaurant.image_url;

  return (
    <SafeAreaView className="flex-1 bg-neutral-50" edges={["top"]}>
      {/* Top Header Bar */}
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
          Profil Kuliner
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* 1. Hero / Featured Image */}
        <View className="h-64 w-full bg-neutral-900 relative">
          {imageUrl && !heroImageError ? (
            <Image
              source={{ uri: imageUrl }}
              className="h-full w-full opacity-90"
              resizeMode="cover"
              onError={() => setHeroImageError(true)}
            />
          ) : (
            <View className="h-full w-full items-center justify-center bg-blue-600">
              <Text className="text-6xl">🍲</Text>
            </View>
          )}

          {/* Rating Badge Overlay */}
          <View className="absolute bottom-4 right-4 flex-row items-center bg-white/95 px-3.5 py-1.5 rounded-full shadow-lg border border-white">
            <Text className="text-sm text-amber-500 mr-1.5">⭐</Text>
            <Text className="text-sm font-JakartaExtraBold text-amber-800">
              {restaurant.rating}
            </Text>
            <Text className="text-xs font-JakartaMedium text-neutral-400 ml-1">
              ({reviews.length} ulasan)
            </Text>
          </View>
        </View>

        {/* 2. Restaurant Identity & Information */}
        <View className="bg-white px-5 pt-5 pb-6 border-b border-neutral-100">
          <Text className="text-2xl font-JakartaExtraBold text-neutral-800 mb-2">
            {restaurant.name}
          </Text>

          <View className="flex-row items-center mb-3.5 flex-wrap gap-2">
            <View className="rounded-lg bg-blue-50 px-3 py-1 border border-blue-100">
              <Text className="text-xs font-JakartaBold text-blue-600">
                {restaurant.category}
              </Text>
            </View>
            {distanceKm !== undefined && (
              <View className="rounded-lg bg-neutral-100 px-3 py-1 border border-neutral-200">
                <Text className="text-xs font-JakartaMedium text-neutral-700">
                  📏 {distanceKm} km dari posisi Anda
                </Text>
              </View>
            )}
          </View>

          {restaurant.description && (
            <View className="mb-4 rounded-2xl bg-neutral-50 p-4 border border-neutral-200/60">
              <Text className="text-xs font-JakartaBold text-neutral-700 mb-1">
                Tentang Tempat Ini
              </Text>
              <Text className="text-xs font-JakartaRegular text-neutral-600 leading-relaxed">
                {restaurant.description}
              </Text>
            </View>
          )}

          <View className="flex-row items-start">
            <Text className="text-sm mr-2">📍</Text>
            <Text className="text-xs font-JakartaMedium text-neutral-600 leading-relaxed flex-1">
              {restaurant.address}
            </Text>
          </View>
        </View>

        {/* 3. Menu Section */}
        <View className="px-4 mt-6">
          <View className="flex-row items-center justify-between mb-3">
            <View>
              <Text className="text-lg font-JakartaBold text-neutral-800">
                Daftar Menu Khas
              </Text>
              <Text className="text-xs font-JakartaRegular text-neutral-500">
                Pilihan hidangan populer di {restaurant.name}
              </Text>
            </View>
            <View className="rounded-md bg-neutral-100 px-2 py-1">
              <Text className="text-[11px] font-JakartaBold text-neutral-500">
                {menus.length} Menu
              </Text>
            </View>
          </View>

          {menus.length > 0 ? (
            menus.map((menu) => <MenuItemCard key={menu.id} menu={menu} />)
          ) : (
            <View className="py-6 items-center bg-white rounded-2xl p-4 border border-neutral-200">
              <Text className="text-sm font-JakartaRegular text-neutral-400">
                Belum ada daftar menu terdaftar.
              </Text>
            </View>
          )}
        </View>

        {/* 4. Reviews Section */}
        <View className="px-4 mt-6">
          <View className="flex-row items-center justify-between mb-3">
            <View>
              <Text className="text-lg font-JakartaBold text-neutral-800">
                Ulasan Pengunjung
              </Text>
              <Text className="text-xs font-JakartaRegular text-neutral-500">
                Pengalaman dari pelanggan yang pernah berkunjung
              </Text>
            </View>
          </View>
          <ReviewList reviews={reviews} />
        </View>

        {/* 5. Location Preview & Optional Route Button */}
        <View className="px-4 mt-6 mb-4">
          <View className="flex-row items-center justify-between mb-2.5">
            <Text className="text-lg font-JakartaBold text-neutral-800">
              Lokasi & Petunjuk Arah
            </Text>
          </View>

          <View className="h-48 w-full rounded-2xl overflow-hidden border border-neutral-200 shadow-sm mb-3">
            <RestaurantMap
              userLatitude={userCoords?.latitude ?? null}
              userLongitude={userCoords?.longitude ?? null}
              restaurants={[restaurant]}
              selectedRestaurantId={restaurant.id}
            />
          </View>

          {/* Secondary Action: External Route Intent */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleOpenNavigation}
            className="flex-row items-center justify-center bg-white py-3 px-5 rounded-2xl border border-neutral-300 shadow-sm"
          >
            <Text className="text-base mr-2">🧭</Text>
            <Text className="text-xs font-JakartaBold text-neutral-800">
              Petunjuk Arah (Buka Google Maps)
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
