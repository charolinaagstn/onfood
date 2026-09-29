import { snap } from "@/lib/payment/midtrans";
import type { CreatePaymentRequest, CreatePaymentResponse } from "@/types/payment";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request): Promise<Response> {
  try {
    let body: Partial<CreatePaymentRequest>;
    try {
      body = (await request.json()) as Partial<CreatePaymentRequest>;
    } catch {
      return Response.json(
        { error: "INVALID_BODY", message: "Request body must be valid JSON" },
        { status: 400 },
      );
    }

    const { amount, customerName, customerEmail, driverId, rideTime } = body;

    // 1. Validasi Amount
    if (typeof amount !== "number" || isNaN(amount) || amount < 1000) {
      return Response.json(
        {
          error: "INVALID_AMOUNT",
          message: "Nominal pembayaran harus berupa angka dan minimal Rp 1.000",
        },
        { status: 400 },
      );
    }

    // Midtrans mewajibkan nominal IDR bulat (integer)
    const grossAmount = Math.round(amount);

    // 2. Validasi Customer Email
    if (!customerEmail || typeof customerEmail !== "string" || !EMAIL_REGEX.test(customerEmail.trim())) {
      return Response.json(
        {
          error: "INVALID_EMAIL",
          message: "Format email customer tidak valid",
        },
        { status: 400 },
      );
    }

    // 3. Validasi Customer Name
    const sanitizedName = (customerName && typeof customerName === "string" ? customerName.trim() : "Pelanggan Gowez").slice(0, 50);

    // 4. Generate Unique Order ID
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const orderId = `GOWEZ-${Date.now()}-${randomSuffix}`;

    // 5. Inisialisasi Transaksi Snap Midtrans
    const transactionPayload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: sanitizedName,
        email: customerEmail.trim(),
      },
      item_details: [
        {
          id: `RIDE-${driverId ?? "DEFAULT"}`,
          price: grossAmount,
          quantity: 1,
          name: `Layanan Perjalanan Gowez (${rideTime ? `${Math.round(rideTime)} mnt` : "Ride"})`,
        },
      ],
      usage_limit: 1,
    };

    const transaction = await snap.createTransaction(transactionPayload);

    if (!transaction || !transaction.token || !transaction.redirect_url) {
      throw new Error("Respon transaksi dari Midtrans tidak valid");
    }

    const response: CreatePaymentResponse = {
      orderId,
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
    };

    return Response.json(response, { status: 200 });
  } catch (error) {
    console.error("[Midtrans Create Payment Error]:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Terjadi kesalahan pada server saat membuat transaksi";

    return Response.json(
      {
        error: "PAYMENT_CREATION_FAILED",
        message: errorMessage,
      },
      { status: 500 },
    );
  }
}
