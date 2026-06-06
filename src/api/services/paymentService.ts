import API from "../api";
import { unwrap } from "../client";
import type { ApiResponse, Bill, PayHereCheckout } from "../../types";

export const paymentService = {
  checkout: (appointmentId: string, amount: number, items?: string) =>
    unwrap(
      API.post<ApiResponse<PayHereCheckout>>("/payments/payhere/checkout", {
        appointmentId,
        amount,
        items,
      })
    ),

  status: (orderId: string) =>
    unwrap(API.get<ApiResponse<Bill>>(`/payments/status/${orderId}`)),
};
