import { Tabs } from "expo-router";
import type { ReactNode } from "react";
import {
  AccessibilityState,
  GestureResponderEvent,
  Image,
  ImageSourcePropType,
  Platform,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";

import { icons } from "@/constants";

const TAB_BAR_HEIGHT = 78;
const RIPPLE_RADIUS = 28;

const TabIcon = ({
  source,
  focused,
}: {
  source: ImageSourcePropType;
  focused: boolean;
}) => (
  <View className={`flex flex-row justify-center items-center rounded-full`}>
    <View
      className={`rounded-full w-12 h-12 items-center justify-center ${focused ? "bg-general-400" : ""}`}
    >
      <Image
        source={source}
        tintColor="white"
        resizeMode="contain"
        className="w-7 h-7"
      />
    </View>
  </View>
);

type TabBarButtonProps = {
  onPress?: ((e: GestureResponderEvent) => void) | null;
  onLongPress?: ((e: GestureResponderEvent) => void) | null;
  accessibilityState?: AccessibilityState;
  accessibilityLabel?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

const TabBarButton = ({
  onPress,
  onLongPress,
  accessibilityState,
  accessibilityLabel,
  testID,
  style: styleProp,
  children,
}: TabBarButtonProps) => (
  <Pressable
    onPress={onPress ?? undefined}
    onLongPress={onLongPress ?? undefined}
    accessibilityRole="button"
    accessibilityState={accessibilityState}
    accessibilityLabel={accessibilityLabel}
    testID={testID}
    android_ripple={{
      color: "rgba(255,255,255,0.15)",
      borderless: true,
      radius: RIPPLE_RADIUS,
    }}
    style={({ pressed }) => [
      styleProp,
      {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      },
      Platform.OS === "ios" && pressed ? { opacity: 0.6 } : null,
    ]}
  >
    {children}
  </Pressable>
);

export default function Layout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarShowLabel: false,
        tabBarButton: (props) => (
          <TabBarButton
            onPress={props.onPress}
            onLongPress={props.onLongPress}
            accessibilityState={props.accessibilityState}
            accessibilityLabel={props.accessibilityLabel}
            testID={props.testID}
            style={props.style}
          >
            {props.children}
          </TabBarButton>
        ),
        tabBarItemStyle: {
          paddingVertical: 0,
          alignItems: "center",
          justifyContent: "center",
        },
        tabBarStyle: {
          backgroundColor: "#333333",
          borderRadius: 50,
          overflow: "hidden",
          marginHorizontal: 20,
          marginBottom: 20,
          height: TAB_BAR_HEIGHT,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          position: "absolute",
          paddingTop: 0,
          paddingBottom: 0,
          borderTopWidth: 0,

          ...Platform.select({
            android: { elevation: 0 },
            ios: { shadowOpacity: 0 },
          }),
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.home} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="rides"
        options={{
          title: "Rides",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.list} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.chat} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.profile} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
