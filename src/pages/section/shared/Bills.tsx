import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { billService, patientService, paymentService } from "../../../api";
import type { Bill, Role, User } from "../../../types";
import { redirectToPayHere } from "../../../utils/payhere";


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
    patientId: "",
    appointmentId: "",
    amount: 0,
    description: "Consultation fee",
    currency: "LKR",
  });

  // ======================
  // LOAD BILLS
  // ======================
  const load = async () => {
    setLoading(true);
    try {
      if (role === "PATIENT" && user?.id) {
        const patientId = await patientService.findIdByUserId(user.id);
        const data = patientId
          ? await billService.byPatient(patientId)
          : [];
        setBills(data);
      } else {
        const data = await billService.getAll();
        setBills(data);
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

  // ======================
  // PAY NOW (PAYHERE)
  // ======================
  const handlePay = async (bill: Bill) => {
    if (!bill.appointmentId || !bill.amount) {
      return toast.error("Invalid bill");
    }

    try {
      setPaying(bill.id);

      const res = await paymentService.checkout(
        bill.appointmentId,
        bill.amount,
        bill.description || "Consultation"
      );

      redirectToPayHere(res);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Payment failed");
    } finally {
      setPaying(null);
    }
  };

  // ======================
  // CREATE BILL (ADMIN/RECEPTIONIST)
  // ======================
  const handleCreateBill = async () => {
    try {
      await billService.create(newBill as Bill);
      toast.success("Bill created");
      setShowCreate(false);
      setNewBill({
        patientId: "",
        appointmentId: "",
        amount: 0,
        description: "Consultation fee",
        currency: "LKR",
      });
      load();
    } catch {
      toast.error("Failed to create bill");
    }
  };

  const canCreate = role === "ADMIN" || role === "RECEPTIONIST";

  // ======================
  // LOADING UI
  // ======================
  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500 text-sm">
        Loading bills...
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {role === "PATIENT" ? "My Bills" : "Billing Management"}
        </h2>

        {canCreate && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700"
          >
            + Create Bill
          </button>
        )}
      </div>

      {/* CREATE BILL FORM */}
      {showCreate && canCreate && (
        <div className="bg-white border rounded-xl p-4 space-y-3 shadow-sm">

          <input
            className="w-full border p-2 rounded"
            placeholder="Patient ID"
            value={newBill.patientId}
            onChange={(e) =>
              setNewBill({ ...newBill, patientId: e.target.value })
            }
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Appointment ID"
            value={newBill.appointmentId}
            onChange={(e) =>
              setNewBill({ ...newBill, appointmentId: e.target.value })
            }
          />

          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="Amount"
            value={newBill.amount}
            onChange={(e) =>
              setNewBill({ ...newBill, amount: Number(e.target.value) })
            }
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Description"
            value={newBill.description}
            onChange={(e) =>
              setNewBill({ ...newBill, description: e.target.value })
            }
          />

          <button
            onClick={handleCreateBill}
            className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700"
          >
            Save Bill
          </button>
        </div>
      )}

      {/* EMPTY STATE */}
      {bills.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          No bills found
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border rounded-xl shadow-sm">
          <table className="w-full text-sm">

            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Order</th>
                <th className="p-3">Description</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {bills.map((b) => (
                <tr key={b.id} className="border-t">

                  {/* ORDER */}
                  <td className="p-3 font-mono text-xs">
                    {b.orderId || b.id.slice(-6)}
                  </td>

                  {/* DESCRIPTION */}
                  <td className="p-3">
                    {b.description || "Consultation"}
                  </td>

                  {/* AMOUNT */}
                  <td className="p-3">
                    {b.currency} {b.amount?.toFixed(2)}
                  </td>

                  {/* STATUS */}
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        STATUS_STYLE[b.paymentStatus || "PENDING"]
                      }`}
                    >
                      {b.paymentStatus || "PENDING"}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="p-3">
                    {role === "PATIENT" &&
                      b.paymentStatus === "PENDING" &&
                      b.appointmentId && (
                        <button
                          disabled={paying === b.id}
                          onClick={() => handlePay(b)}
                          className="bg-teal-600 text-white px-3 py-1 rounded text-xs hover:bg-teal-700 disabled:opacity-50"
                        >
                          {paying === b.id ? "Processing..." : "Pay"}
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