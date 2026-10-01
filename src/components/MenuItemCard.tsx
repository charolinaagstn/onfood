import { Menu } from "@/types/place";
import { useState } from "react";
import { Image, Text, View } from "react-native";

interface MenuItemCardProps {
  menu: Menu;
}

export default function MenuItemCard({ menu }: MenuItemCardProps) {
  const imageUrl = menu.image || menu.image_url;
  const [imageError, setImageError] = useState(false);

  return (
    <View className="mb-3 flex-row items-center rounded-2xl bg-white p-3.5 border border-neutral-100 shadow-sm shadow-neutral-200">
      <View className="h-20 w-20 rounded-xl bg-neutral-100 overflow-hidden mr-3.5 border border-neutral-200 justify-center items-center">
        {imageUrl && !imageError ? (
          <Image
            source={{ uri: imageUrl }}
            className="h-full w-full"
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <Text className="text-3xl">🍲</Text>
        )}
      </View>

      <View className="flex-1 justify-center mr-2">
        <Text className="text-sm font-JakartaBold text-neutral-800 mb-1" numberOfLines={1}>
          {menu.name}
        </Text>
        <Text className="text-xs font-JakartaRegular text-neutral-500 mb-2 leading-tight" numberOfLines={2}>
          {menu.description}
        </Text>
        <View className="self-start rounded-lg bg-blue-50 px-2.5 py-1 border border-blue-100">
          <Text className="text-xs font-JakartaBold text-blue-600">
            Rp {menu.price.toLocaleString("id-ID")}
          </Text>
        </View>
      </View>
    </View>
  );
}
