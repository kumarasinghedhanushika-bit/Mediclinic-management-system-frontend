import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { paymentService } from "../../api";
import type { Bill } from "../../types";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get("order_id");
  const [bill, setBill] = useState<Bill | null>(null);

  useEffect(() => {
    if (!orderId) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    paymentService.status(orderId).then(setBill)
      .catch(() => {});
  }, [orderId]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-100 shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl mb-4">
          ✓
        </div>
        <h1 className="text-xl font-bold text-slate-900">Payment successful</h1>
        <p className="text-sm text-slate-500 mt-2">
          Thank you! Your payment has been received.
        </p>
        {orderId && (
          <p className="text-xs text-slate-400 mt-2 font-mono">Order: {orderId}</p>
        )}
        {bill && (
          <p className="text-sm text-teal-700 font-medium mt-2">
            Status: {bill.paymentStatus}
          </p>
        )}
        <Link
          to="/dashboard"
          className="inline-block mt-6 px-6 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
