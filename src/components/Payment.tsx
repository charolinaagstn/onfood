import { router } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView, WebViewNavigation } from "react-native-webview";

import CustomButton from "./CustomButton";

import { icons, images } from "@/constants";
import {
  createPayment,
  getPaymentStatus,
} from "@/lib/payment/services/payment.services";
import { formatCurrency } from "@/lib/utils";

interface PaymentProps {
  amount: number;
  customerName: string;
  customerEmail: string;
  driverId?: number;
  rideTime?: number;
  buttonClassName?: string;
  onSuccess?: (orderId: string) => void | Promise<void>;
  onError?: (errorMessage: string) => void;
}

const Payment = ({
  amount,
  customerName,
  customerEmail,
  driverId,
  rideTime,
  buttonClassName = "my-10",
  onSuccess,
  onError,
}: PaymentProps) => {
  const [paymentUrl, setPaymentUrl] = useState<string>("");
  const [currentOrderId, setCurrentOrderId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isWebViewLoading, setIsWebViewLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const completedOrderIdsRef = useRef<Set<string>>(new Set());

  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
    setPaymentUrl("");
  }, []);

  const handlePaymentCompleted = useCallback(
    async (orderId: string) => {
      if (completedOrderIdsRef.current.has(orderId)) return;

      completedOrderIdsRef.current.add(orderId);
      handleCloseModal();
      setIsLoading(true);

      try {
        await onSuccess?.(orderId);
        setPaymentSuccess(true);
      } catch (error) {
        completedOrderIdsRef.current.delete(orderId);
        console.warn("Unable to complete paid ride:", error);
        Alert.alert(
          "Pembayaran Berhasil, Pesanan Belum Tersimpan",
          "Pembayaran sudah terkonfirmasi, tetapi kami belum berhasil menyimpan data perjalanan. Silakan coba lagi atau hubungi bantuan.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [handleCloseModal, onSuccess],
  );

  function handleDismissPaymentModal() {
    handleCloseModal();

    if (currentOrderId) {
      void verifyOrderStatus(currentOrderId);
    }
  }

  async function verifyOrderStatus(orderId: string) {
    try {
      setIsLoading(true);
      const statusResponse = await getPaymentStatus(orderId);

      if (statusResponse.status === "PAID") {
        await handlePaymentCompleted(orderId);
      } else if (statusResponse.status === "PENDING") {
        Alert.alert(
          "Menunggu Pembayaran",
          "Transaksi belum terbayar atau masih diproses. Silakan selesaikan pembayaran terlebih dahulu.",
          [
            {
              text: "Tutup",
              style: "cancel",
            },
            {
              text: "Cek Status Lagi",
              onPress: () => {
                void verifyOrderStatus(orderId);
              },
            },
          ],
        );
      } else {
        Alert.alert(
          "Pembayaran Belum Berhasil",
          "Status pembayaran belum selesai atau dibatalkan. Silakan coba kembali.",
        );
      }
    } catch (error) {
      console.warn("Unable to verify payment status:", error);
      Alert.alert(
        "Status Pembayaran Belum Bisa Dicek",
        "Kami belum bisa memastikan status pembayaran Anda. Silakan cek koneksi internet, lalu coba lagi dari halaman pembayaran.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  const handleOpenPaymentSheet = async () => {
    console.log("[Payment] Memulai proses pembayaran dengan nominal:", amount);

    const safeAmount = Math.max(1000, Math.round(amount || 45000));

    setIsLoading(true);
    setIsWebViewLoading(true);

    try {
      const transaction = await createPayment({
        amount: safeAmount,
        customerName: customerName || "Pengguna Gowez",
        customerEmail: customerEmail || "user@gowez.com",
        driverId,
        rideTime,
      });

      if (!transaction || !transaction.redirectUrl) {
        throw new Error("URL Pembayaran Midtrans tidak valid.");
      }

      console.log("[Payment] Transaksi dibuat berhasil:", transaction.orderId);
      setCurrentOrderId(transaction.orderId);

      setPaymentUrl(transaction.redirectUrl);
      setIsModalVisible(true);
    } catch (err) {
      console.warn("[Payment Warning]:", err);
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Gagal membuat transaksi pembayaran. Silakan periksa koneksi internet Anda.";
      onError?.(errorMsg);
      Alert.alert("Gagal Memulai Pembayaran", errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    const { url } = navState;
    if (!url) return;

    // Deteksi URL redirect sukses
    if (
      url.includes("#finish") ||
      url.includes("transaction_status=settlement") ||
      url.includes("transaction_status=capture") ||
      url.includes("status_code=200")
    ) {
      if (currentOrderId) {
        void verifyOrderStatus(currentOrderId);
      }
      return;
    }

    // Deteksi URL status pending
    if (
      url.includes("#pending") ||
      url.includes("transaction_status=pending") ||
      url.includes("status_code=201")
    ) {
      handleCloseModal();
      Alert.alert(
        "Menunggu Pembayaran",
        "Pembayaran Anda belum selesai. Pesanan baru akan dibuat setelah status pembayaran terkonfirmasi berhasil.",
      );
      return;
    }

    // Deteksi URL status gagal / cancel
    if (
      url.includes("#error") ||
      url.includes("transaction_status=deny") ||
      url.includes("transaction_status=cancel") ||
      url.includes("transaction_status=expire") ||
      url.includes("status_code=202")
    ) {
      handleCloseModal();
      Alert.alert(
        "Pembayaran Gagal",
        "Transaksi gagal atau dibatalkan. Silakan pilih metode pembayaran lain.",
      );
    }
  };

  const handleShouldStartLoadWithRequest = (request: {
    url: string;
  }): boolean => {
    const { url } = request;

    // Tangani deep link aplikasi pembayaran lokal (GoPay, ShopeePay, Dana, dll)
    if (
      url.startsWith("gojek://") ||
      url.startsWith("shopeeid://") ||
      url.startsWith("dana://") ||
      url.startsWith("linkaja://") ||
      url.startsWith("bca://") ||
      url.startsWith("market://") ||
      url.startsWith("intent://")
    ) {
      Linking.canOpenURL(url)
        .then((supported) => {
          if (supported) {
            Linking.openURL(url);
          } else {
            Alert.alert(
              "Aplikasi Tidak Ditemukan",
              "Aplikasi pembayaran terkait tidak terpasang di perangkat Anda.",
            );
          }
        })
        .catch((err) => {
          console.warn("Deep link warning:", err);
          Alert.alert(
            "Aplikasi Pembayaran Tidak Bisa Dibuka",
            "Kami tidak bisa membuka aplikasi pembayaran terkait. Silakan pilih metode pembayaran lain.",
          );
        });
      return false;
    }

    return true;
  };

  return (
    <>
      <CustomButton
        title={
          isLoading
            ? "Memproses..."
            : `Bayar ${formatCurrency(amount || 45000)}`
        }
        className={buttonClassName}
        onPress={handleOpenPaymentSheet}
        disabled={isLoading}
      />

      {/* Modal Webview Fullscreen / Slide-Up */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleDismissPaymentModal}
      >
        <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
          {/* Header */}
          <View className="flex-row items-center justify-between border-b border-gray-200 px-5 py-4">
            <View>
              <Text className="text-lg font-JakartaBold text-neutral-800">
                Pembayaran Midtrans
              </Text>
              <Text className="text-xs font-JakartaMedium text-gray-500">
                Total Tagihan: {formatCurrency(amount || 45000)}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleDismissPaymentModal}
              className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
            >
              <Image
                source={icons.close}
                className="w-4 h-4"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Container WebView */}
          <View className="flex-1 relative">
            {paymentUrl ? (
              <WebView
                source={{ uri: paymentUrl }}
                javaScriptEnabled
                domStorageEnabled
                startInLoadingState
                originWhitelist={["*"]}
                onNavigationStateChange={handleNavigationStateChange}
                onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
                onLoadStart={() => setIsWebViewLoading(true)}
                onLoadEnd={() => setIsWebViewLoading(false)}
                onError={() => {
                  setIsWebViewLoading(false);
                  Alert.alert(
                    "Koneksi Gagal",
                    "Tidak dapat memuat halaman pembayaran Midtrans. Periksa koneksi internet Anda.",
                  );
                }}
                onHttpError={() => {
                  setIsWebViewLoading(false);
                  Alert.alert(
                    "Halaman Pembayaran Bermasalah",
                    "Midtrans belum bisa menampilkan halaman pembayaran. Silakan tutup halaman ini dan coba lagi.",
                  );
                }}
              />
            ) : (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#0286FF" />
                <Text className="text-sm font-JakartaMedium text-gray-500 mt-3">
                  Menyiapkan halaman pembayaran...
                </Text>
              </View>
            )}

            {isWebViewLoading && paymentUrl ? (
              <View className="absolute inset-0 bg-white/70 items-center justify-center">
                <ActivityIndicator size="large" color="#0286FF" />
              </View>
            ) : null}
          </View>
        </SafeAreaView>
      </Modal>

      {/* Modal Konfirmasi Pembayaran Sukses */}
      <Modal
        visible={paymentSuccess}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setPaymentSuccess(false);
          router.replace("/(root)/(tabs)/home");
        }}
      >
        <View className="flex-1 bg-black/50 items-center justify-center px-7">
          <View className="w-full bg-white rounded-3xl p-7 items-center justify-center">
            <Image
              source={images.check}
              className="w-28 h-28 my-4"
              resizeMode="contain"
            />

            <Text className="text-2xl font-JakartaBold text-center text-neutral-800">
              Perjalanan Dikonfirmasi!
            </Text>

            <Text className="text-md font-JakartaRegular text-gray-500 text-center mt-2">
              Pembayaran sebesar {formatCurrency(amount || 45000)} telah
              berhasil. Driver sedang menuju ke lokasi penjemputan Anda.
            </Text>

            <CustomButton
              title="Kembali ke Beranda"
              className="w-full mt-6"
              onPress={() => {
                setPaymentSuccess(false);
                router.replace("/(root)/(tabs)/home");
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Payment;
