import PlaceCard from "@/components/PlaceCard";
import PlaceMap from "@/components/PlaceMap";
import SearchBar from "@/components/SearchBar";
import { calculateDistance, getCurrentUserLocation } from "@/lib/location";
import { getPlaces } from "@/lib/database/places";
import { Place, PlaceFilter } from "@/types/place";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<PlaceFilter>("all");
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);

  const [locationError, setLocationError] = useState<string | null>(null);

  // 1. Fetch user location
  const fetchLocation = useCallback(async () => {
    try {
      const location = await getCurrentUserLocation();
      setUserLocation(location);
      setLocationError(null);
    } catch (err) {
      console.warn("Location permission or GPS error:", err);
      setLocationError(
        err instanceof Error
          ? err.message
          : "Izin lokasi belum diberikan. Menampilkan kuliner sekitar Palembang.",
      );
    }
  }, []);

  // 2. Fetch places from SQLite database
  const loadPlacesFromDb = useCallback(async () => {
    try {
      const dbPlaces = await getPlaces();
      setPlaces(dbPlaces);
    } catch (error) {
      console.error("Error loading places from SQLite:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLocation();
    loadPlacesFromDb();
  }, [fetchLocation, loadPlacesFromDb]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLocation();
    loadPlacesFromDb();
  }, [fetchLocation, loadPlacesFromDb]);

  // Compute distances & apply filter / search
  const processedPlaces = useMemo(() => {
    let list = places.map((place) => {
      let distance: number | undefined;
      if (userLocation) {
        distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          place.latitude,
          place.longitude,
        );
      }
      return { ...place, distance };
    });

    // Search query filter
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.address.toLowerCase().includes(q),
      );
    }

    // Sort/Filter pills
    if (activeFilter === "nearby" && userLocation) {
      list.sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
    } else if (activeFilter === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [places, userLocation, searchQuery, activeFilter]);

  const handleSelectPlace = (place: Place) => {
    setSelectedPlaceId(place.id);
    router.push(`/place/${place.id}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50" edges={["top"]}>
      {/* Header */}
      <View className="px-4 pt-2 pb-3 bg-white border-b border-neutral-100 shadow-sm">
        <View className="flex-row items-center justify-between mb-2">
          <View>
            <Text className="text-2xl font-JakartaExtraBold text-blue-600">
              KulinerDekat
            </Text>
            <Text className="text-xs font-JakartaMedium text-neutral-500">
              Temukan Kuliner Terdekat di Palembang
            </Text>
          </View>
          <View className="h-9 w-9 rounded-full bg-blue-100 items-center justify-center">
            <Text className="text-base">🍲</Text>
          </View>
        </View>

        {/* Search bar */}
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

        {/* Filter Pills */}
        <View className="flex-row gap-2 mt-3">
          <TouchableOpacity
            onPress={() => setActiveFilter("all")}
            className={`px-3.5 py-1.5 rounded-full border ${
              activeFilter === "all"
                ? "bg-blue-600 border-blue-600"
                : "bg-white border-neutral-300"
            }`}
          >
            <Text
              className={`text-xs font-JakartaBold ${
                activeFilter === "all" ? "text-white" : "text-neutral-700"
              }`}
            >
              Semua
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveFilter("nearby")}
            className={`px-3.5 py-1.5 rounded-full border ${
              activeFilter === "nearby"
                ? "bg-blue-600 border-blue-600"
                : "bg-white border-neutral-300"
            }`}
          >
            <Text
              className={`text-xs font-JakartaBold ${
                activeFilter === "nearby" ? "text-white" : "text-neutral-700"
              }`}
            >
              📍 Terdekat
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveFilter("rating")}
            className={`px-3.5 py-1.5 rounded-full border ${
              activeFilter === "rating"
                ? "bg-blue-600 border-blue-600"
                : "bg-white border-neutral-300"
            }`}
          >
            <Text
              className={`text-xs font-JakartaBold ${
                activeFilter === "rating" ? "text-white" : "text-neutral-700"
              }`}
            >
              ⭐ Rating Tertinggi
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Location warning banner if permission denied */}
      {locationError && (
        <View className="bg-amber-50 px-4 py-2 flex-row items-center border-b border-amber-200">
          <Text className="text-xs text-amber-800 flex-1 font-JakartaMedium">
            ⚠️ {locationError}
          </Text>
        </View>
      )}

      {/* Main Content: Map + List */}
      <View className="flex-1">
        {/* Map View (top portion) */}
        <View className="h-56 w-full relative">
          <PlaceMap
            userLatitude={userLocation?.latitude ?? null}
            userLongitude={userLocation?.longitude ?? null}
            places={processedPlaces}
            selectedPlaceId={selectedPlaceId}
            onSelectPlace={(place) => handleSelectPlace(place)}
            onUserLocationUpdate={(loc) => setUserLocation(loc)}
          />
        </View>

        {/* Restaurant List Section */}
        <View className="flex-1 bg-neutral-50 px-4 pt-3">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base font-JakartaBold text-neutral-800">
              Rekomendasi Kuliner ({processedPlaces.length})
            </Text>
            {userLocation && (
              <Text
                className="text-xs font-JakartaMedium text-blue-600 flex-1 text-right ml-2"
                numberOfLines={1}
              >
                📍 {userLocation.address}
              </Text>
            )}
          </View>

          {loading ? (
            <View className="flex-1 items-center justify-center py-10">
              <ActivityIndicator size="large" color="#0286ff" />
              <Text className="mt-2 text-xs font-JakartaMedium text-neutral-500">
                Memuat data kuliner dari SQLite...
              </Text>
            </View>
          ) : (
            <FlatList
              data={processedPlaces}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <PlaceCard
                  place={item}
                  onPress={() => handleSelectPlace(item)}
                />
              )}
              contentContainerStyle={{ paddingBottom: 24 }}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["#0286ff"]}
                />
              }
              ListEmptyComponent={
                <View className="items-center justify-center py-10 bg-white rounded-2xl p-6 border border-neutral-200 mt-2">
                  <Text className="text-4xl mb-2">🔍</Text>
                  <Text className="text-base font-JakartaBold text-neutral-700 mb-1">
                    Kuliner Tidak Ditemukan
                  </Text>
                  <Text className="text-xs font-JakartaRegular text-neutral-500 text-center">
                    Coba ubah kata kunci pencarian atau pilih filter "Semua".
                  </Text>
                </View>
              }
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
