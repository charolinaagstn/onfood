import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { useSignIn } from "@clerk/expo";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { ReactNativeModal } from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  const { signIn } = useSignIn();

  const [form, setForm] = useState({ email: "", password: "" });

  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const onSignInPress = async () => {
    if (!signIn) return;

    try {
      const { error } = await signIn.password({
        emailAddress: form.email,
        password: form.password,
      });

      if (error) {
        console.log(JSON.stringify(error, null, 2));
        Alert.alert(
          "Error",
          error?.longMessage || error?.message || "Failed to sign in",
        );
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: () => router.replace("/(root)/(tabs)/home"),
        });
      } else if (signIn.status === "needs_client_trust") {
        // Kirim email verification code untuk MFA
        const emailCodeFactor = signIn.supportedSecondFactors?.find(
          (factor) => factor.strategy === "email_code",
        );

        if (emailCodeFactor) {
          await signIn.mfa.sendEmailCode();
        }

        setVerification({ ...verification, state: "pending" });
      } else {
        console.log("Sign-in status:", signIn.status);
        Alert.alert("Error", "Sign-in could not be completed. Please try again.");
      }
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));
      Alert.alert(
        "Error",
        err?.errors?.[0]?.longMessage || err?.message || "Failed to sign in",
      );
    }
  };

  const onPressVerify = async () => {
    if (!signIn) return;

    if (!verification.code.trim()) {
      const errorMessage = "Masukkan kode verifikasi terlebih dahulu.";
      setVerification({
        ...verification,
        error: errorMessage,
        state: "failed",
      });
      Alert.alert("Kode Verifikasi Kosong", errorMessage);
      return;
    }

    try {
      await signIn.mfa.verifyEmailCode({ code: verification.code });

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: () => router.replace("/(root)/(tabs)/home"),
        });
      } else {
        setVerification({
          ...verification,
          error: "Verification failed. Please try again.",
          state: "failed",
        });
        Alert.alert("Verification Failed", "Verification failed. Please try again.");
      }
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));

      const errorMessage =
        err?.errors?.[0]?.longMessage || err?.message || "Verification failed";

      setVerification({ ...verification, error: errorMessage, state: "failed" });
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative h-[250px] w-full">
          <Image source={images.signUpCar} className="z-0 h-[250px] w-full" />
          <Text className="absolute bottom-5 left-5 font-JakartaSemiBold text-2xl text-black">
            Welcome 👋
          </Text>
        </View>

        <View className="p-5">
          <InputField
            label="Email"
            placeholder="Enter your email"
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Password"
            placeholder="Enter your password"
            icon={icons.lock}
            value={form.password}
            secureTextEntry={true}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          <CustomButton
            title="Sign In"
            onPress={onSignInPress}
            className="mt-6"
          />

          {/* OAuth */}
          <OAuth />

          <View className="mt-10 items-center">
            <Link
              href="/sign-up"
              className="text-center text-lg text-general-200"
            >
              Don't have an account?{" "}
              <Text className="text-primary-500">Sign Up</Text>
            </Link>
          </View>
        </View>

        {/* MFA Verification Modal */}
        <ReactNativeModal
          isVisible={
            verification.state === "pending" || verification.state === "failed"
          }
          avoidKeyboard
          onModalHide={() => {
            if (verification.state === "success") {
              router.replace("/(root)/(tabs)/home");
            }
          }}
        >
          <SafeAreaView edges={["top", "bottom"]}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                <Text className="text-2xl font-JakartaExtraBold mb-2">
                  Verification
                </Text>
                <Text className="font-Jakarta mb-5">
                  We've sent a verification code to {form.email}
                </Text>

                <InputField
                  label="Code"
                  icon={icons.lock}
                  placeholder="12345"
                  value={verification.code}
                  keyboardType="numeric"
                  onChangeText={(code) =>
                    setVerification({
                      ...verification,
                      code,
                      error: "",
                      state: "pending",
                    })
                  }
                />

                {verification.error && (
                  <Text className="text-red-500 text-sm mt-1">
                    {verification.error}
                  </Text>
                )}

                <CustomButton
                  title="Verify & Sign In"
                  onPress={onPressVerify}
                  className="mt-5 bg-success-500"
                />
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
}
