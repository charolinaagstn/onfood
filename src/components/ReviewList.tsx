import { Review } from "@/types/place";
import { Text, View } from "react-native";

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <View className="py-4 items-center">
        <Text className="text-sm font-JakartaRegular text-neutral-400">
          Belum ada ulasan untuk tempat ini.
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-2.5">
      {reviews.map((review) => (
        <View
          key={review.id}
          className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200"
        >
          <View className="flex-row items-center justify-between mb-1.5">
            <View className="flex-row items-center">
              <View className="h-7 w-7 rounded-full bg-blue-500 items-center justify-center mr-2">
                <Text className="text-xs font-JakartaBold text-white">
                  {review.user_name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text className="text-xs font-JakartaBold text-neutral-800">
                {review.user_name}
              </Text>
            </View>

            <View className="flex-row items-center bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              <Text className="text-xs text-amber-500 mr-1">⭐</Text>
              <Text className="text-xs font-JakartaBold text-amber-700">
                {review.rating}
              </Text>
            </View>
          </View>

          <Text className="text-xs font-JakartaRegular text-neutral-700 leading-relaxed mb-1">
            "{review.comment}"
          </Text>

          <Text className="text-[10px] font-JakartaRegular text-neutral-400">
            {review.created_at}
          </Text>
        </View>
      ))}
    </View>
  );
}
