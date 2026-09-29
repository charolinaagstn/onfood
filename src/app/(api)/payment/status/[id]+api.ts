import { coreApi } from "@/lib/payment/midtrans";
import type {
  MidtransStatusResponse,
  PaymentNormalizedStatus,
  PaymentStatusResponse,
} from "@/types/payment";

export async function GET(
  request: Request,
  context: { params: Record<string, string> },
): Promise<Response> {
  const orderId = context.params.id;

  if (!orderId) {
    return Response.json(
      { error: "MISSING_ORDER_ID", message: "Order ID parameter is required" },
      { status: 400 },
    );
  }

  try {
    // 1. Ambil status langsung dari Midtrans Core API
    let midtransStatus: MidtransStatusResponse | null = null;
    try {
      midtransStatus = (await coreApi.transaction.status(orderId)) as MidtransStatusResponse;
    } catch (midtransErr: any) {
      // 404 jika orderId belum dibayar / belum tercatat di sistem transaksi Midtrans
      if (midtransErr?.ApiResponse?.status_code === "404" || midtransErr?.httpStatusCode === 404) {
        return Response.json(
          {
            orderId,
            status: "PENDING" as PaymentNormalizedStatus,
            transactionStatus: "pending",
            message: "Transaksi belum diproses atau sedang menunggu pembayaran",
          },
          { status: 200 },
        );
      }
      throw midtransErr;
    }

    if (!midtransStatus) {
      return Response.json(
        {
          orderId,
          status: "PENDING" as PaymentNormalizedStatus,
          message: "Status transaksi tidak ditemukan",
        },
        { status: 200 },
      );
    }

    // 2. Normalisasi status transaksi
    let normalizedStatus: PaymentNormalizedStatus = "PENDING";
    const { transaction_status, fraud_status } = midtransStatus;

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

    const response: PaymentStatusResponse = {
      orderId,
      status: normalizedStatus,
      transactionStatus: midtransStatus.transaction_status,
      fraudStatus: midtransStatus.fraud_status,
      paymentType: midtransStatus.payment_type,
      grossAmount: midtransStatus.gross_amount ? Number(midtransStatus.gross_amount) : undefined,
      transactionTime: midtransStatus.transaction_time,
      settlementTime: midtransStatus.settlement_time,
    };

    return Response.json(response, { status: 200 });
  } catch (error) {
    console.warn(`[Midtrans Check Status Warning for ${orderId}]:`, error);

    return Response.json(
      {
        orderId,
        status: "PENDING" as PaymentNormalizedStatus,
        transactionStatus: "pending",
        message:
          "Status pembayaran belum bisa dipastikan. Silakan cek lagi beberapa saat lagi.",
      },
      { status: 200 },
    );
  }
}
