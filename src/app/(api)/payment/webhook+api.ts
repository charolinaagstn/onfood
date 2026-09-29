import { neon } from "@neondatabase/serverless";
import { verifyMidtransSignature } from "@/lib/payment/midtrans";
import type {
  MidtransNotificationPayload,
  PaymentNormalizedStatus,
} from "@/types/payment";

export async function POST(request: Request): Promise<Response> {
  try {
    let notification: MidtransNotificationPayload;
    try {
      notification = (await request.json()) as MidtransNotificationPayload;
    } catch {
      return Response.json(
        { error: "INVALID_JSON", message: "Request body harus berupa format JSON valid" },
        { status: 400 },
      );
    }

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
    } = notification;

    if (!order_id || !status_code || !gross_amount || !signature_key) {
      return Response.json(
        {
          error: "MISSING_NOTIFICATION_FIELDS",
          message: "Data notifikasi webhook Midtrans tidak lengkap",
        },
        { status: 400 },
      );
    }

    // 1. Verifikasi Signature Key untuk memastikan keaslian request dari Midtrans
    const isValidSignature = verifyMidtransSignature({
      orderId: order_id,
      statusCode: status_code,
      grossAmount: gross_amount,
      signatureKey: signature_key,
    });

    if (!isValidSignature) {
      console.warn(`[Webhook Midtrans] Invalid signature key for Order: ${order_id}`);
      return Response.json(
        {
          error: "INVALID_SIGNATURE",
          message: "Signature key tidak valid, request ditolak",
        },
        { status: 401 },
      );
    }

    // 2. Tentukan Status Transaksi berdasarkan standar resmi Midtrans
    let normalizedStatus: PaymentNormalizedStatus = "PENDING";

    switch (transaction_status) {
      case "capture":
        if (fraud_status === "challenge") {
          normalizedStatus = "CHALLENGE";
        } else if (fraud_status === "accept") {
          normalizedStatus = "PAID";
        }
        break;

      case "settlement":
        normalizedStatus = "PAID";
        break;

      case "pending":
        normalizedStatus = "PENDING";
        break;

      case "deny":
        normalizedStatus = "FAILED";
        break;

      case "expire":
        normalizedStatus = "EXPIRED";
        break;

      case "cancel":
        normalizedStatus = "CANCELLED";
        break;

      case "failure":
        normalizedStatus = "FAILED";
        break;

      default:
        normalizedStatus = "PENDING";
        break;
    }

    console.log(
      `[Webhook Midtrans Processed] Order: ${order_id}, MidtransStatus: ${transaction_status}, Normalized: ${normalizedStatus}, PaymentType: ${payment_type}`,
    );

    // 3. Update Database (jika DATABASE_URL terkonfigurasi)
    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl) {
      try {
        const sql = neon(databaseUrl);
        // Update status pembayaran di database jika tabel rides / orders ada
        // Menggunakan try/catch agar kegagalan update parsial DB tidak membuat Midtrans me-retry webhook secara berulang
        await sql`
          UPDATE rides 
          SET payment_status = ${normalizedStatus.toLowerCase()}
          WHERE ride_id = ${order_id} OR payment_id = ${order_id}
        `.catch((err) => {
          // Catch jika tabel/kolom belum dibuat di DB staging/local
          console.warn("[Webhook DB Update Notice]:", err.message || err);
        });
      } catch (dbError) {
        console.error("[Webhook DB Connection Error]:", dbError);
      }
    }

    // 4. Return HTTP 200 OK ke Midtrans
    return Response.json(
      {
        status: "success",
        orderId: order_id,
        paymentStatus: normalizedStatus,
        message: "Notification webhook processed successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[Webhook Midtrans Error]:", error);

    return Response.json(
      {
        error: "WEBHOOK_INTERNAL_ERROR",
        message:
          error instanceof Error ? error.message : "Terjadi kesalahan internal pada webhook",
      },
      { status: 500 },
    );
  }
}
