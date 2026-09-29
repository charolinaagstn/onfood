import crypto from "crypto";
import midtransClient from "midtrans-client";

export const isMidtransProduction =
  process.env.MIDTRANS_IS_PRODUCTION === "true" ||
  process.env.NODE_ENV === "production";

const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
const clientKey = process.env.MIDTRANS_CLIENT_KEY || "";

/**
 * Midtrans Snap Client Instance
 */
export const snap = new midtransClient.Snap({
  isProduction: isMidtransProduction,
  serverKey,
  clientKey,
});

/**
 * Midtrans CoreApi Client Instance (for status check, cancel, refund, etc.)
 */
export const coreApi = new midtransClient.CoreApi({
  isProduction: isMidtransProduction,
  serverKey,
  clientKey,
});

/**
 * Helper to verify Midtrans SHA-512 Notification Signature
 * Formula: SHA512(order_id + status_code + gross_amount + ServerKey)
 */
export function verifyMidtransSignature({
  orderId,
  statusCode,
  grossAmount,
  signatureKey,
}: {
  orderId: string;
  statusCode: string;
  grossAmount: string;
  signatureKey: string;
}): boolean {
  if (!serverKey || !signatureKey) {
    return false;
  }

  const payload = `${orderId}${statusCode}${grossAmount}${serverKey}`;
  const computedHash = crypto
    .createHash("sha512")
    .update(payload)
    .digest("hex");

  return computedHash === signatureKey;
}
