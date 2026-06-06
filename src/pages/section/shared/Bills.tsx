import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { billService, patientService, paymentService } from "../../../api";
import { redirectToPayHere } from "../../../utils/payhere";
import type { Bill, Role, User } from "../../../types";

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-600",
};

interface Props {
  role?: Role;
  user?: User | null;
}

export default function Bills({ role, user }: Props) {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newBill, setNewBill] = useState({
    patientId: "PAT-",
    appointmentId: "APT-",
    amount: 0,
    description: "Consultation fee",
    currency: "LKR",
  });

  const load = async () => {
    setLoading(true);
    try {
      if (role === "PATIENT" && user?.id) {
        const patientId = await patientService.findIdByUserId(user.id);
        setBills(patientId ? await billService.byPatient(patientId) : []);
      } else {
        setBills(await billService.getAll());
      }
    } catch {
      toast.error("Failed to load bills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [role, user?.id]);

  const handlePay = async (bill: Bill) => {
    if (!bill.appointmentId || !bill.amount) {
      return toast.error("Invalid bill for payment");
    }
    try {
      setPaying(bill.id);
      const checkout = await paymentService.checkout(
        bill.appointmentId,
        bill.amount,
        bill.description || "Consultation"
      );
      redirectToPayHere(checkout);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Payment initiation failed");
    } finally {
      setPaying(null);
    }
  };

  const handleCreateBill = async () => {
    try {
      await billService.create(newBill as Bill);
      toast.success("Bill created");
      setShowCreate(false);
      load();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const canCreate = role === "ADMIN" || role === "RECEPTIONIST";

  if (loading) {
    return <div className="text-sm text-gray-400 py-8 text-center">Loading…</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h3 className="text-base font-semibold text-gray-900">
          {role === "PATIENT" ? "My Bills" : "Billing"}
        </h3>
        {canCreate && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="px-3 py-2 bg-teal-600 text-white text-sm rounded-lg"
          >
            + Create bill
          </button>
        )}
      </div>

      {showCreate && canCreate && (
        <div className="bg-gray-50 rounded-xl p-4 border space-y-3">
          <input
            placeholder="Patient ID *"
            value={newBill.patientId}
            onChange={(e) => setNewBill({ ...newBill, patientId: e.target.value })}
            className="w-full px-3 py-2 text-sm border rounded-lg"
          />
          <input
            placeholder="Appointment ID"
            value={newBill.appointmentId}
            onChange={(e) => setNewBill({ ...newBill, appointmentId: e.target.value })}
            className="w-full px-3 py-2 text-sm border rounded-lg"
          />
          <input
            type="number"
            placeholder="Amount *"
            value={newBill.amount}
            onChange={(e) => setNewBill({ ...newBill, amount: Number(e.target.value) })}
            className="w-full px-3 py-2 text-sm border rounded-lg"
          />
          <input
            placeholder="Description"
            value={newBill.description}
            onChange={(e) => setNewBill({ ...newBill, description: e.target.value })}
            className="w-full px-3 py-2 text-sm border rounded-lg"
          />
          <button
            onClick={handleCreateBill}
            className="w-full py-2 bg-teal-600 text-white text-sm rounded-lg"
          >
            Save bill
          </button>
        </div>
      )}

      {bills.length === 0 ? (
        <div className="py-12 text-center text-gray-400 text-sm bg-gray-50 rounded-xl">
          No bills found
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["Order", "Description", "Amount", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bills.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{b.orderId || b.id.slice(-8)}</td>
                  <td className="px-4 py-3">{b.description || b.items || "Consultation"}</td>
                  <td className="px-4 py-3 font-medium">
                    {b.currency || "LKR"} {b.amount?.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_STYLE[b.paymentStatus || "PENDING"]}`}>
                      {b.paymentStatus || "PENDING"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {role === "PATIENT" && b.paymentStatus === "PENDING" && b.appointmentId && (
                      <button
                        onClick={() => handlePay(b)}
                        disabled={paying === b.id}
                        className="text-xs px-3 py-1.5 bg-teal-600 text-white rounded-lg disabled:opacity-50"
                      >
                        {paying === b.id ? "…" : "Pay now"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
