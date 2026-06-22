import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { paymentService } from "../../api";
import type { Bill } from "../../types";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get("order_id");

  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError("No order reference detected.");
      return;
    }

    let attempts = 0;
    let intervalId: ReturnType<typeof setInterval>;

    const checkStatus = async () => {
      try {
        attempts++;
        const res = await paymentService.status(orderId);
        setBill(res);

        // Webhook එකෙන් backend එක PAID කියලා update කරලා නම් loop එක නවත්තන්න
        if (res.paymentStatus === "PAID") {
          setLoading(false);
          clearInterval(intervalId);
        } else if (attempts >= 5) {
          // උපරිම 5 පාරක් check කරලත් PENDING නම් loading එක නවත්තන්න
          setLoading(false);
          clearInterval(intervalId);
        }
      } catch (err) {
        console.error(err);
        if (attempts >= 3) {
          setError("Verification delay. Please check your bills history shortly.");
          setLoading(false);
          clearInterval(intervalId);
        }
      }
    };

    // මුලින්ම එකපාරක් check කරනවා, නැත්නම් හැම තත්පර 2කටම සැරයක් run කරනවා
    checkStatus();
    intervalId = setInterval(checkStatus, 2500);

    return () => clearInterval(intervalId);
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-9 h-9 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-slate-500 font-medium">Confirming transaction with PayHere...</p>
        </div>
      </div>
    );
  }

  const isPaid = bill?.paymentStatus === "PAID";

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border shadow-lg p-8 text-center">
        
        {error || !isPaid ? (
          <>
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto text-2xl mb-4 font-bold">
              !
            </div>
            <h1 className="text-xl font-bold text-slate-900">Payment Processing</h1>
            <p className="text-sm text-slate-500 mt-2">
              {error || `Status is currently: ${bill?.paymentStatus || "PENDING"}. It will update in a moment.`}
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl mb-4">
              ✓
            </div>
            <h1 className="text-xl font-bold text-slate-900">Payment Successful</h1>
            <p className="text-sm text-slate-500 mt-2">Your transaction has been successfully completed.</p>
          </>
        )}

        {orderId && (
          <p className="text-xs text-slate-400 mt-4 font-mono bg-slate-50 py-2 rounded border">
            Reference ID: {orderId}
          </p>
        )}

        {bill && isPaid && (
          <div className="mt-4 p-3 bg-teal-50/50 rounded-lg border border-teal-100 text-xs text-left text-slate-600 space-y-1">
            <p><strong>Amount Paid:</strong> {bill.currency} {bill.amount?.toFixed(2)}</p>
            <p><strong>Description:</strong> {bill.description}</p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2">
          <Link
            to="/dashboard/bills"
            className="w-full py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition"
          >
            Go to My Bills
          </Link>
          <Link
            to="/dashboard"
            className="w-full py-2.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-200 transition"
          >
            Dashboard Home
          </Link>
        </div>
      </div>
    </div>
  );
}