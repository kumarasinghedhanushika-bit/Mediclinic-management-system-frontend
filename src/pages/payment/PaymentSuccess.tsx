import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { paymentService } from "../../api";
import type { Bill } from "../../types";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get("order_id");

  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const fetchStatus = async () => {
      try {
        const res = await paymentService.status(orderId);
        setBill(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [orderId]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border shadow-lg p-8 text-center">

        {/* ICON */}
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl mb-4">
          ✓
        </div>

        {/* TITLE */}
        <h1 className="text-xl font-bold text-slate-900">
          Payment Successful
        </h1>

        <p className="text-sm text-slate-500 mt-2">
          Your transaction has been completed.
        </p>

        {/* ORDER ID */}
        {orderId && (
          <p className="text-xs text-slate-400 mt-3 font-mono">
            Order: {orderId}
          </p>
        )}

        {/* STATUS */}
        {bill && (
          <div className="mt-4">
            <p className="text-sm font-medium text-teal-700">
              Status: {bill.paymentStatus}
            </p>
            <p className="text-xs text-slate-500">
              Amount: {bill.currency} {bill.amount}
            </p>
          </div>
        )}

        {loading && (
          <p className="text-sm text-slate-400 mt-3">Checking payment...</p>
        )}

        {/* BUTTON */}
        <Link
          to="/dashboard"
          className="inline-block mt-6 px-6 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}