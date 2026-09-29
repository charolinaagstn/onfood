import { useState } from "react";

import {
  createPayment,
  getPaymentStatus,
} from "@/lib/payment/services/payment.services";
import type {
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentStatusResponse,
} from "@/types/payment";

export function usePayment() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createTransaction = async (
    payload: CreatePaymentRequest,
  ): Promise<CreatePaymentResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await createPayment(payload);
      return result;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan saat memproses pembayaran";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async (
    orderId: string,
  ): Promise<PaymentStatusResponse | null> => {
    try {
      return await getPaymentStatus(orderId);
    } catch (err) {
      console.error("Error checking payment status:", err);
      return null;
    }
  };

  return {
    loading,
    error,
    createTransaction,
    checkStatus,
  };
}
