import { Link } from "react-router-dom";

export default function PaymentCancel() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-100 shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto text-3xl mb-4">
          ×
        </div>
        <h1 className="text-xl font-bold text-slate-900">Payment cancelled</h1>
        <p className="text-sm text-slate-500 mt-2">
          You can retry payment from your bills section anytime.
        </p>
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
