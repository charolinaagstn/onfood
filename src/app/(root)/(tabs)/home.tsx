import EmptyRecentRidesList from "@/components/home/EmptyRecentRidesList";
import PlacesTextInput from "@/components/home/PlacesTextInput";
import RideCard from "@/components/home/RideCard";
import Map from "@/components/Map";
import { icons } from "@/constants";
import { useFetch } from "@/lib/fetch";
import { getCurrentUserLocation } from "@/lib/location";
import { useLocationStore } from "@/store";
import { Ride } from "@/types/type";
import { useAuth, useUser } from "@clerk/expo";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const { setUserLocation, setDestinationLocation } = useLocationStore();

  const { user } = useUser();
  const { signOut } = useAuth();
  const { data: recentRides, loading } = useFetch<Ride[]>(
    `/(api)/ride/${user?.id}`,
  );

  const handleSignOut = () => {
    signOut();

    router.replace("/(auth)/sign-in");
  };

  const handleDestinationPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation(location);

    router.push("/(root)/find-ride");
  };

  useEffect(() => {
    const requestLocation = async () => {
      try {
        const location = await getCurrentUserLocation();
        setUserLocation(location);
      } catch (error) {
        Alert.alert(
          "Lokasi Tidak Terdeteksi",
          error instanceof Error
            ? error.message
            : "Kami belum bisa membaca lokasi Anda. Pastikan GPS aktif lalu coba lagi.",
        );
      }
    };

    requestLocation();
  }, [setUserLocation]);

  return (
    <SafeAreaView className="bg-general-500">
      <FlatList
        data={recentRides?.slice(0, 5)}
        renderItem={({ item }) => <RideCard ride={item} />}
        className="px-5"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={() => <EmptyRecentRidesList isLoading={loading} />}
        ListHeaderComponent={() => (
          <>
            <View className="flex flex-row items-center justify-between my-5">
              <Text className="text-xl font-JakartaExtraBold">
                Welcome{", "}
                {user?.firstName ||
                  user?.emailAddresses[0].emailAddress.split("@")[0]}{" "}
                👋
              </Text>
              <TouchableOpacity
                onPress={handleSignOut}
                className="justify-center items-center size-10 rounded-full bg-white"
              >
                <Image source={icons.out} className="size-4" />
              </TouchableOpacity>
            </View>

            <PlacesTextInput
              icon={icons.search}
              containerStyle="bg-white shadow-md shadow-neutral-300"
              handlePress={handleDestinationPress}
            />

            <>
              <Text className="text-xl font-JakartaBold mt-5 mb-3">
                Your current location
              </Text>
              <View className="flex flex-row items-center bg-transparent h-[300px]">
                <Map />
              </View>
            </>

            <Text className="text-xl font-JakartaBold mt-5 mb-3">
              Recent Rides
            </Text>
          </>
        )}
      />
    </SafeAreaView>
  );
};

export default Home;
