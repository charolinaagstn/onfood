import { Place } from "@/types/place";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface RestaurantCardProps {
  restaurant: Place;
  onPress: () => void;
}

export default function RestaurantCard({ restaurant, onPress }: RestaurantCardProps) {
  const imageUrl = restaurant.image || restaurant.image_url;
  const [imageError, setImageError] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="mb-3.5 flex-row rounded-2xl bg-white p-3.5 shadow-sm shadow-neutral-200 border border-neutral-100 items-center"
    >
      <View className="h-20 w-20 rounded-xl bg-blue-50 items-center justify-center mr-3.5 overflow-hidden border border-blue-100">
        {imageUrl && !imageError ? (
          <Image
            source={{ uri: imageUrl }}
            className="h-full w-full"
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <Text className="text-3xl">🍴</Text>
        )}
      </View>

      <View className="flex-1 justify-center">
        <View className="flex-row items-center justify-between mb-1">
          <Text
            className="text-base font-JakartaBold text-neutral-800 flex-1 mr-2"
            numberOfLines={1}
          >
            {restaurant.name}
          </Text>
          <View className="flex-row items-center bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <Text className="text-xs text-amber-500 mr-1">⭐</Text>
            <Text className="text-xs font-JakartaBold text-amber-700">
              {restaurant.rating}
            </Text>
          </View>
        </View>

        <Text className="text-xs font-JakartaMedium text-blue-600 mb-1">
          {restaurant.category}
        </Text>

        <Text
          className="text-xs font-JakartaRegular text-neutral-500 mb-1.5"
          numberOfLines={1}
        >
          📍 {restaurant.address}
        </Text>

        {restaurant.distance !== undefined && (
          <View className="flex-row items-center">
            <Text className="text-xs font-JakartaSemiBold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md">
              📏 {restaurant.distance} km dari posisi Anda
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
