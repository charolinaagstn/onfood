import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { fetchAPI } from "@/lib/fetch";
import { useSignUp } from "@clerk/expo";
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

export default function SignUpScreen() {
  const { signUp } = useSignUp();

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const onSignUpPress = async () => {
    if (!signUp) return;

    try {
      const { error } = await signUp.password({
        emailAddress: form.email,
        password: form.password,
      });

      if (error) {
        console.log(JSON.stringify(error, null, 2));
        Alert.alert(
          "Error",
          error?.longMessage || error?.message || "Failed to create account",
        );
        return;
      }

      await signUp.verifications.sendEmailCode();

      setVerification({
        ...verification,
        state: "pending",
      });
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));

      Alert.alert(
        "Error",
        err?.errors?.[0]?.longMessage ||
          err?.message ||
          "Failed to create account",
      );
    }
  };

  const onPressVerify = async () => {
    if (!signUp) return;

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
      await signUp.verifications.verifyEmailCode({
        code: verification.code,
      });

      if (signUp.status === "complete") {
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            clerkId: signUp.createdUserId,
          }),
        });

        await signUp.finalize({
          navigate: () => router.replace("/(root)/(tabs)/home"),
        });

        setVerification({
          ...verification,
          state: "success",
        });
      } else {
        setVerification({
          ...verification,
          error: "Verification failed. Please try again.",
          state: "failed",
        });

        Alert.alert(
          "Verification Failed",
          "Verification failed. Please try again.",
        );
      }
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));

      const errorMessage =
        err?.errors?.[0]?.longMessage || err?.message || "Verification failed";

      setVerification({
        ...verification,
        error: errorMessage,
        state: "failed",
      });

      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative h-[250px] w-full">
          <Image source={images.signUpCar} className="z-0 h-[250px] w-full" />
          <Text className="absolute bottom-5 left-5 font-JakartaSemiBold text-2xl text-black">
            Create Your Account
          </Text>
        </View>

        <View className="p-5">
          <InputField
            label="Name"
            placeholder="Enter your name"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />
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
            title="Sign Up"
            onPress={onSignUpPress}
            className="mt-6"
          />

          {/* OAuth */}
          <OAuth />

          <View className="mt-10 items-center">
            <Link
              href="/sign-in"
              className="text-center text-lg text-general-200"
            >
              Already have an account?{" "}
              <Text className="text-primary-500">Log In</Text>
            </Link>
          </View>
        </View>

        {/* Verification Modal */}
        <ReactNativeModal
          isVisible={
            verification.state === "pending" || verification.state === "failed"
          }
          avoidKeyboard
          onModalHide={() => {
            if (verification.state === "success") setShowSuccessModal(true);
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
                  title="Verify Email"
                  onPress={onPressVerify}
                  className="mt-5 bg-success-500"
                />
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </ReactNativeModal>

        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />

            <Text className="text-3xl font-JakartaBold text-center">
              Verified
            </Text>

            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
              You have successfully verified your account
            </Text>

            <CustomButton
              title="Browse home"
              onPress={() => {
                setShowSuccessModal(false);
                router.replace("/(root)/(tabs)/home");
              }}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
}
