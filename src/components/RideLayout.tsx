import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useRef } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Map from "@/components/Map";
import { icons } from "@/constants";

const DEFAULT_SNAP_POINTS = ["50%", "85%"];

const RideLayout = ({
  children,
  title,
  snapPoints,
  bottomSheetIndex,
  scrollable = true,
}: {
  children: React.ReactNode;
  title: string;
  snapPoints?: string[];
  bottomSheetIndex?: number;
  scrollable?: boolean;
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const sheetSnapPoints = snapPoints ?? DEFAULT_SNAP_POINTS;
  const initialIndex =
    bottomSheetIndex ?? Math.min(1, sheetSnapPoints.length - 1);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-white">
        <View className="flex-1 flex-col bg-blue-500">
          <View
            className="absolute z-10 flex flex-row items-center justify-start px-5"
            style={{ top: insets.top + 16 }}
          >
            <TouchableOpacity onPress={() => router.back()}>
              <View className="w-10 h-10 bg-white rounded-full items-center justify-center">
                <Image
                  source={icons.backArrow}
                  resizeMode="contain"
                  className="w-6 h-6"
                />
              </View>
            </TouchableOpacity>
            <Text className="text-xl font-JakartaSemiBold ml-5">
              {title || "Go Back"}
            </Text>
          </View>
          <Map />
        </View>

        <BottomSheet
          keyboardBehavior="extend"
          ref={bottomSheetRef}
          snapPoints={sheetSnapPoints}
          index={initialIndex}
          animateOnMount={false}
          enablePanDownToClose={false}
        >
          {scrollable ? (
            <BottomSheetScrollView
              contentContainerStyle={{
                padding: 20,
                paddingBottom: 28 + insets.bottom,
              }}
              showsVerticalScrollIndicator={false}
            >
              {children}
            </BottomSheetScrollView>
          ) : (
            <BottomSheetView style={{ flex: 1 }}>{children}</BottomSheetView>
          )}
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};
export default RideLayout;
