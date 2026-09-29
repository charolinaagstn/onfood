import { fetchAPI } from "@/lib/fetch";
import type {
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentStatusResponse,
} from "@/types/payment";

/**
 * Creates a Midtrans Snap transaction via backend API route
 */
export async function createPayment(
  payload: CreatePaymentRequest,
): Promise<CreatePaymentResponse> {
  const result = await fetchAPI("/(api)/payment/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return result as CreatePaymentResponse;
}

/**
 * Fetches transaction status for given orderId
 */
export async function getPaymentStatus(
  orderId: string,
): Promise<PaymentStatusResponse> {
  const result = await fetchAPI(`/(api)/payment/status/${orderId}`, {
    method: "GET",
  });

  return result as PaymentStatusResponse;
}
