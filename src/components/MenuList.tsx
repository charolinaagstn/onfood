import { Menu } from "@/types/place";
import { useState } from "react";
import { Image, Text, View } from "react-native";

interface MenuListProps {
  menus: Menu[];
}

function MenuItemRow({ menu }: { menu: Menu }) {
  const imageUrl = menu.image || menu.image_url;
  const [imageError, setImageError] = useState(false);

  return (
    <View className="flex-row items-center justify-between p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
      {imageUrl && !imageError && (
        <View className="h-16 w-16 rounded-lg overflow-hidden bg-neutral-200 mr-3 border border-neutral-300">
          <Image
            source={{ uri: imageUrl }}
            className="h-full w-full"
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        </View>
      )}

      <View className="flex-1 mr-3">
        <Text className="text-sm font-JakartaBold text-neutral-800 mb-0.5">
          {menu.name}
        </Text>
        <Text className="text-xs font-JakartaRegular text-neutral-500">
          {menu.description}
        </Text>
      </View>

      <View className="bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
        <Text className="text-xs font-JakartaBold text-blue-700">
          Rp {menu.price.toLocaleString("id-ID")}
        </Text>
      </View>
    </View>
  );
}

export default function MenuList({ menus }: MenuListProps) {
  if (!menus || menus.length === 0) {
    return (
      <View className="py-4 items-center">
        <Text className="text-sm font-JakartaRegular text-neutral-400">
          Belum ada menu yang terdaftar.
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-2.5">
      {menus.map((menu) => (
        <MenuItemRow key={menu.id} menu={menu} />
      ))}
    </View>
  );
}
