import Payment from "@/components/Payment";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { fetchAPI } from "@/lib/fetch";
import { getCurrentUserLocation } from "@/lib/location";
import { formatCurrency, formatTime } from "@/lib/utils";
import { useDriverStore, useLocationStore } from "@/store";
import { useUser } from "@clerk/expo";
import { useEffect } from "react";
import { Alert, Image, Text, View } from "react-native";

const BOOK_RIDE_SNAP_POINTS = ["58%", "82%"];

const BookRide = () => {
  const { user } = useUser();
  const {
    userAddress,
    destinationAddress,
    setUserLocation,
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();
  const { drivers, selectedDriver } = useDriverStore();

  const driverDetails =
    drivers?.find((driver) => Number(driver.id) === selectedDriver) ||
    drivers?.[0];
  const driverId = driverDetails?.id ? Number(driverDetails.id) : undefined;

  const parsedPrice = Number(driverDetails?.price ?? 0);
  const rideAmount =
    !isNaN(parsedPrice) && parsedPrice > 0 ? Math.round(parsedPrice) : 45000;

  const customerName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "Pengguna Gowez";

  const customerEmail =
    user?.primaryEmailAddress?.emailAddress || "user@gowez.com";

  const handlePaymentSuccess = async (orderId: string) => {
    console.log("[BookRide] Payment success, ready to create ride:", orderId);

    await fetchAPI("/(api)/ride/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        origin_address: userAddress,
        destination_address: destinationAddress,
        origin_latitude: userLatitude,
        origin_longitude: userLongitude,
        destination_latitude: destinationLatitude,
        destination_longitude: destinationLongitude,
        ride_time: driverDetails?.time ?? 15,
        fare_price: rideAmount,
        payment_status: "paid",
        driver_id: driverId,
        user_id: user?.id,
      }),
    });
  };

  useEffect(() => {
    if (userAddress) return;

    let isMounted = true;

    const loadCurrentLocation = async () => {
      try {
        const location = await getCurrentUserLocation();
        if (isMounted) setUserLocation(location);
      } catch (error) {
        if (!isMounted) return;

        Alert.alert(
          "Lokasi Penjemputan Kosong",
          error instanceof Error
            ? error.message
            : "Kami belum bisa membaca lokasi Anda. Aktifkan GPS atau pilih lokasi penjemputan secara manual.",
        );
      }
    };

    loadCurrentLocation();

    return () => {
      isMounted = false;
    };
  }, [setUserLocation, userAddress]);

  return (
    <RideLayout
      title="Book Ride"
      snapPoints={BOOK_RIDE_SNAP_POINTS}
      bottomSheetIndex={0}
    >
      <>
        <Text className="text-xl font-JakartaSemiBold mb-2">
          Ride Information
        </Text>

        <View className="flex flex-col w-full items-center justify-center mt-4">
          <Image
            source={{ uri: driverDetails?.profile_image_url }}
            className="w-24 h-24 rounded-full"
          />

          <View className="flex flex-row items-center justify-center mt-3 space-x-2">
            <Text className="text-lg font-JakartaSemiBold">
              {driverDetails?.title}
            </Text>

            <View className="flex flex-row items-center space-x-0.5">
              <Image
                source={icons.star}
                className="w-5 h-5"
                resizeMode="contain"
              />
              <Text className="text-lg font-JakartaRegular">
                {driverDetails?.rating ?? "4.8"}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex flex-col w-full items-start justify-center py-2 px-5 rounded-3xl bg-general-600 mt-4">
          <View className="flex flex-row items-center justify-between w-full border-b border-white py-3">
            <Text className="text-lg font-JakartaRegular">Ride Price</Text>
            <Text className="text-lg font-JakartaSemiBold text-[#0CC25F]">
              {formatCurrency(rideAmount)}
            </Text>
          </View>

          <View className="flex flex-row items-center justify-between w-full border-b border-white py-3">
            <Text className="text-lg font-JakartaRegular">Pickup Time</Text>
            <Text className="text-lg font-JakartaRegular">
              {formatTime(driverDetails?.time ?? 15)}
            </Text>
          </View>

          <View className="flex flex-row items-center justify-between w-full py-3">
            <Text className="text-lg font-JakartaRegular">Car Seats</Text>
            <Text className="text-lg font-JakartaRegular">
              {driverDetails?.car_seats ?? 4}
            </Text>
          </View>
        </View>

        <View className="flex w-full flex-col items-start justify-center mt-4 gap-y-3">
          <View className="min-h-[76px] w-full flex-row items-start rounded-2xl bg-neutral-100 px-4 py-4">
            <Image source={icons.to} className="mt-1 h-6 w-6" />
            <View className="ml-3 flex-1">
              <Text className="text-xs font-JakartaMedium text-general-800">
                Pickup
              </Text>
              <Text
                className="mt-1 text-base leading-5 font-JakartaSemiBold text-neutral-800"
                numberOfLines={3}
              >
                {userAddress || "Lokasi Penjemputan"}
              </Text>
            </View>
          </View>

          <View className="min-h-[76px] w-full flex-row items-start rounded-2xl bg-neutral-100 px-4 py-4">
            <Image source={icons.point} className="mt-1 h-6 w-6" />
            <View className="ml-3 flex-1">
              <Text className="text-xs font-JakartaMedium text-general-800">
                Destination
              </Text>
              <Text
                className="mt-1 text-base leading-5 font-JakartaSemiBold text-neutral-800"
                numberOfLines={3}
              >
                {destinationAddress || "Lokasi Tujuan"}
              </Text>
            </View>
          </View>
        </View>

        <Payment
          amount={rideAmount}
          customerName={customerName}
          customerEmail={customerEmail}
          driverId={driverId}
          rideTime={driverDetails?.time}
          buttonClassName="mt-6 mb-3"
          onSuccess={handlePaymentSuccess}
        />
      </>
    </RideLayout>
  );
};

export default BookRide;
