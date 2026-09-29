import { icons } from "@/constants";
import { googleOAuth } from "@/lib/auth";
import { useOAuth } from "@clerk/expo";
import { router } from "expo-router";
import { useCallback } from "react";
import { Alert, Image, Text, View } from "react-native";
import CustomButton from "./CustomButton";

const OAuth = () => {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const handleGoogleSignIn = useCallback(async () => {
    try {
      const result = await googleOAuth(startOAuthFlow);

      if (result.code === "session_exists" || result.code === "success") {
        router.replace("/(root)/(tabs)/home");
        return;
      }

      Alert.alert("Google Sign In Failed", result.message);
    } catch (error) {
      console.error("OAuth error", error);
      Alert.alert("Google Sign In Failed", "Please try again.");
    }
  }, [startOAuthFlow]);

  return (
    <View>
      <View
        className="mt-4 flex flex-row items-center justify-center
        gap-x-3
        "
      >
        <View className="h-[1px] flex-1 bg-general-100" />
        <Text className="text-lg">Or</Text>
        <View className="h-[1px] flex-1 bg-general-100" />
      </View>

      <CustomButton
        title="Log In With Google"
        className="mt-5 w-full shadow-none"
        IconLeft={() => (
          <Image
            source={icons.google}
            resizeMode="contain"
            className="mx-2 h-5 w-5"
          />
        )}
        bgVariant="outline"
        textVariant="primary"
        onPress={handleGoogleSignIn}
      />
    </View>
  );
};

export default OAuth;
