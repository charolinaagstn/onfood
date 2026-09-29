import CustomButton from "@/components/CustomButton";
import RideLayout from "@/components/RideLayout";
import PlacesTextInput from "@/components/home/PlacesTextInput";
import { icons } from "@/constants";
import { useLocationStore } from "@/store";
import { router } from "expo-router";
import { Text, View } from "react-native";

const FindRide = () => {
  const {
    userAddress,
    destinationAddress,
    setDestinationLocation,
    setUserLocation,
  } = useLocationStore();

  return (
    <RideLayout
      title="Ride"
      snapPoints={["58%", "78%"]}
      bottomSheetIndex={0}
      scrollable={false}
    >
      <View className="px-5 pt-1 pb-5">
        <View className="mb-4">
          <Text className="text-base font-JakartaSemiBold mb-2">From</Text>
          <PlacesTextInput
            icon={icons.target}
            initialLocation={userAddress!}
            containerStyle="bg-neutral-100"
            inputContainerStyle="rounded-2xl items-start py-3"
            inputStyle="leading-5"
            multilineInput
            autoGrowInput
            minInputHeight={48}
            maxInputHeight={112}
            textInputBackgroundColor="#f5f5f5"
            handlePress={(location) => setUserLocation(location)}
          />
        </View>

        <View className="mb-3">
          <Text className="text-base font-JakartaSemiBold mb-2">To</Text>
          <PlacesTextInput
            icon={icons.map}
            initialLocation={destinationAddress!}
            containerStyle="bg-neutral-100"
            inputContainerStyle="rounded-2xl items-start py-3"
            inputStyle="leading-5"
            multilineInput
            autoGrowInput
            minInputHeight={48}
            maxInputHeight={112}
            textInputBackgroundColor="transparent"
            handlePress={(location) => setDestinationLocation(location)}
          />
        </View>

        <CustomButton
          title="Find now"
          onPress={() => router.push("/(root)/confirm-ride")}
          className="mt-1"
        />
      </View>
    </RideLayout>
  );
};
export default FindRide;
