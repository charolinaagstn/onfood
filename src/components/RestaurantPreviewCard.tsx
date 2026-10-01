import { Place } from "@/types/place";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface RestaurantPreviewCardProps {
  restaurant: Place;
  onViewDetails: (restaurant: Place) => void;
  onClose: () => void;
}

export default function RestaurantPreviewCard({
  restaurant,
  onViewDetails,
  onClose,
}: RestaurantPreviewCardProps) {
  const imageUrl = restaurant.image || restaurant.image_url;
  const [imageError, setImageError] = useState(false);

  return (
    <View className="absolute bottom-4 left-4 right-4 rounded-3xl bg-white p-4 shadow-xl shadow-black/20 border border-neutral-100">
      <View className="flex-row items-start">
        {/* Restaurant Image */}
        <View className="h-24 w-24 rounded-2xl bg-neutral-100 overflow-hidden mr-3.5 border border-neutral-200 justify-center items-center">
          {imageUrl && !imageError ? (
            <Image
              source={{ uri: imageUrl }}
              className="h-full w-full"
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <Text className="text-4xl">🍴</Text>
          )}
        </View>

        {/* Content */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text
              className="text-base font-JakartaExtraBold text-neutral-800 flex-1 mr-2"
              numberOfLines={1}
            >
              {restaurant.name}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="h-6 w-6 rounded-full bg-neutral-100 items-center justify-center"
            >
              <Text className="text-xs font-JakartaBold text-neutral-500">✕</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center mt-1 mb-1.5 gap-1.5 flex-wrap">
            <View className="rounded-md bg-blue-50 px-2 py-0.5 border border-blue-100">
              <Text className="text-[11px] font-JakartaBold text-blue-600">
                {restaurant.category}
              </Text>
            </View>

            <View className="flex-row items-center rounded-md bg-amber-50 px-2 py-0.5 border border-amber-200">
              <Text className="text-[11px] text-amber-500 mr-1">⭐</Text>
              <Text className="text-[11px] font-JakartaBold text-amber-700">
                {restaurant.rating}
              </Text>
            </View>
          </View>

          <Text
            className="text-xs font-JakartaRegular text-neutral-500 mb-2"
            numberOfLines={1}
          >
            📍 {restaurant.address}
          </Text>

          {restaurant.distance !== undefined && (
            <Text className="text-[11px] font-JakartaMedium text-neutral-600 mb-2">
              📏 Jarak: {restaurant.distance} km dari posisi Anda
            </Text>
          )}

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => onViewDetails(restaurant)}
            className="rounded-xl bg-blue-600 py-2.5 px-4 items-center justify-center shadow-sm"
          >
            <Text className="text-xs font-JakartaBold text-white">
              Lihat Detail Tempat
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
