import { Menu } from "@/types/place";
import { Text, View } from "react-native";

interface MenuListProps {
  menus: Menu[];
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
        <View
          key={menu.id}
          className="flex-row items-center justify-between p-3.5 rounded-xl bg-neutral-50 border border-neutral-200"
        >
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
      ))}
    </View>
  );
}
