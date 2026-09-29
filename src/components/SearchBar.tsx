import { icons } from "@/constants";
import { Image, TextInput, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Cari kuliner, pempek, bakso, cafe...",
}: SearchBarProps) {
  return (
    <View className="flex-row items-center rounded-2xl bg-neutral-100 px-3.5 py-2.5 border border-neutral-200">
      <Image
        source={icons.search}
        className="h-5 w-5 mr-2.5 tint-neutral-500"
        resizeMode="contain"
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        className="flex-1 font-JakartaMedium text-sm text-neutral-800 p-0"
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText("")}
          className="h-6 w-6 rounded-full bg-neutral-300 items-center justify-center ml-2"
        >
          <Image
            source={icons.close}
            className="h-3 w-3 tint-white"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
