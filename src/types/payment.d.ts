export type TransactionStatus =
  | "settlement"
  | "capture"
  | "pending"
  | "deny"
  | "cancel"
  | "expire"
  | "failure"
  | "refund"
  | "partial_refund"
  | "chargeback"
  | "partial_chargeback"
  | "authorize";

export type FraudStatus = "accept" | "challenge" | "deny";

export type PaymentNormalizedStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "EXPIRED"
  | "CHALLENGE";

export interface CreatePaymentRequest {
  amount: number;
  customerName: string;
  customerEmail: string;
  driverId?: number;
  rideTime?: number;
  itemDetails?: {
    id: string;
    price: number;
    quantity: number;
    name: string;
  }[];
}

export interface CreatePaymentResponse {
  orderId: string;
  token: string;
  redirectUrl: string;
}

export interface PaymentStatusResponse {
  orderId: string;
  status: PaymentNormalizedStatus;
  transactionStatus?: TransactionStatus | string;
  fraudStatus?: FraudStatus | string;
  paymentType?: string;
  grossAmount?: number;
  transactionTime?: string;
  settlementTime?: string;
}

export interface MidtransNotificationPayload {
  transaction_time: string;
  transaction_status: TransactionStatus;
  transaction_id: string;
  status_message: string;
  status_code: string;
  signature_key: string;
  payment_type: string;
  order_id: string;
  merchant_id: string;
  gross_amount: string;
  fraud_status?: FraudStatus;
  currency?: string;
  settlement_time?: string;
  approval_code?: string;
  bank?: string;
  va_numbers?: Array<{
    bank: string;
    va_number: string;
  }>;
  bill_key?: string;
  biller_code?: string;
  pdf_url?: string;
  finish_redirect_url?: string;
}

export interface MidtransStatusResponse {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: TransactionStatus;
  fraud_status?: FraudStatus;
  signature_key?: string;
  settlement_time?: string;
}
