import { images } from "@/constants";
import { ActivityIndicator, Image, Text, View } from "react-native";

const EmptyRecentRidesList = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <View className="flex flex-col items-center justify-center">
      {!isLoading ? (
        <>
          <Image
            source={images.noResult}
            className="w-40 h-40"
            alt="No recent rides found"
            resizeMode="contain"
          />

          <Text className="text-sm">No recent rides found</Text>
        </>
      ) : (
        <ActivityIndicator size="small" color="#000" />
      )}
    </View>
  );
};

export default EmptyRecentRidesList;
