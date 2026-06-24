import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { billService, patientService, paymentService, appointmentService } from "../../../api";
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

interface NewBillForm {
  appointmentId: string;
  patientId: string;
  appointmentNumber: string;
  patientName: string;
  consultationFee: number;
  hospitalCharge: number;
  description: string;
  currency: string;
}

const EMPTY_BILL: NewBillForm = {
  appointmentId: "",
  patientId: "",
  appointmentNumber: "",
  patientName: "",
  consultationFee: 0,
  hospitalCharge: 0,
  description: "Consultation fee",
  currency: "LKR",
};

export default function Bills({ role, user }: Props) {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [lookingUp, setLookingUp] = useState(false);

  const [newBill, setNewBill] = useState<NewBillForm>(EMPTY_BILL);

  const load = async () => {
    setLoading(true);
    try {
      if (role === "PATIENT" && user?.id) {
        const patientId = await patientService.findIdByUserId(user.id);
        const data = patientId ? await billService.byPatient(patientId) : [];
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
    if (role && user?.id) {
      load();
    }
  }, [role, user?.id]);

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

  // AUTO-FILL: when the appointment ID changes, fetch the appointment
  // and pull patient + consultation fee straight from it.
  // AUTO-FILL: when the appointment ID changes, fetch the appointment
  // and pull patient + consultation fee straight from it.
  const handleAppointmentIdChange = async (appointmentId: string) => {
    setNewBill((prev) => ({ ...prev, appointmentId }));

    if (!appointmentId.trim()) {
      setNewBill((prev) => ({
        ...prev,
        patientId: "",
        appointmentNumber: "",
        patientName: "",
        consultationFee: 0,
      }));
      return;
    }

    try {
      setLookingUp(true);
      const appt = await appointmentService.getByNumber(appointmentId.trim());
      console.log("appppp", appt);
      setNewBill((prev) => ({
        ...prev,
        patientId: appt.patientId ?? "",
        appointmentNumber: appt.appointmentNumber ?? "",
        patientName: appt.patientName ?? "",
        consultationFee: appt.consultationFee ?? 0,
      }));
    } catch {
      setNewBill((prev) => ({
        ...prev,
        patientId: "",
        appointmentNumber: "",
        patientName: "",
        consultationFee: 0,
      }));
      toast.error("Appointment not found");
    } finally {
      setLookingUp(false);
    }
  };

  const handleCreateBill = async () => {
    if (!newBill.appointmentId || !newBill.patientId) {
      return toast.error("Enter a valid Appointment ID first");
    }
    if (newBill.consultationFee <= 0 && newBill.hospitalCharge <= 0) {
      return toast.error("Bill amount must be greater than 0");
    }
    try {
      await billService.create({
        appointmentId: newBill.appointmentId,
        patientId: newBill.patientId,
        consultationFee: newBill.consultationFee,
        hospitalCharge: newBill.hospitalCharge,
        description: newBill.description,
        currency: newBill.currency,
      } as Bill);
      toast.success("Bill created");
      setShowCreate(false);
      setNewBill(EMPTY_BILL);
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create bill");
    }
  };

  const canCreate = role === "ADMIN" || role === "RECEPTIONIST";
  const totalAmount = (newBill.consultationFee || 0) + (newBill.hospitalCharge || 0);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500 text-sm animate-pulse">
        Loading bills...
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">
          {role === "PATIENT" ? "My Bills" : "Billing Management"}
        </h2>

        {canCreate && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700 transition"
          >
            {showCreate ? "Close" : "+ Create Bill"}
          </button>
        )}
      </div>

      {showCreate && canCreate && (
        <div className="bg-white border rounded-xl p-4 space-y-3 shadow-sm max-w-md">
          <div>
            <label className="text-xs text-gray-500">Appointment ID</label>
            <input
              className="w-full border p-2 rounded text-sm focus:outline-teal-600"
              placeholder="Paste appointment ID"
              value={newBill.appointmentId}
              onChange={(e) => handleAppointmentIdChange(e.target.value)}
            />
          </div>

          {lookingUp && (
            <p className="text-xs text-gray-400">Looking up appointment...</p>
          )}

          <div>
            <label className="text-xs text-gray-500">Appointment No.</label>
            <input
              className="w-full border p-2 rounded text-sm bg-gray-50 text-gray-500"
              value={newBill.appointmentNumber}
              disabled
              placeholder="Auto-filled"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">Patient</label>
            <input
              className="w-full border p-2 rounded text-sm bg-gray-50 text-gray-500"
              value={newBill.patientName}
              disabled
              placeholder="Auto-filled"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">Consultation Fee</label>
            <input
              type="number"
              className="w-full border p-2 rounded text-sm bg-gray-50 text-gray-500"
              value={newBill.consultationFee}
              disabled
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">Hospital Charge</label>
            <input
              type="number"
              className="w-full border p-2 rounded text-sm focus:outline-teal-600"
              placeholder="0.00"
              value={newBill.hospitalCharge || ""}
              onChange={(e) =>
                setNewBill({ ...newBill, hospitalCharge: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">Description</label>
            <input
              className="w-full border p-2 rounded text-sm focus:outline-teal-600"
              value={newBill.description}
              onChange={(e) => setNewBill({ ...newBill, description: e.target.value })}
            />
          </div>

          <div className="flex justify-between text-sm font-medium pt-1">
            <span>Total</span>
            <span>{newBill.currency} {totalAmount.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCreateBill}
            className="w-full bg-teal-600 text-white py-2 rounded text-sm font-medium hover:bg-teal-700 transition"
          >
            Save Bill
          </button>
        </div>
      )}

      {bills.length === 0 ? (
        <div className="text-center text-gray-400 py-10 border rounded-xl bg-gray-50/50">
          No bills found
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border rounded-xl shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b text-gray-600">
              <tr>
                <th className="p-3 font-medium">Appointment No.</th>
                <th className="p-3 font-medium">Description</th>
                <th className="p-3 font-medium">Amount</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-700">
              {bills.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3 font-mono text-xs text-slate-500">
                    {b.appointmentNumber || b.orderId || b.id.slice(-6)}
                  </td>
                  <td className="p-3">{b.description || "Consultation"}</td>
                  <td className="p-3 font-medium">
                    {b.currency} {b.amount?.toFixed(2)}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${STATUS_STYLE[b.paymentStatus || "PENDING"]}`}>
                      {b.paymentStatus || "PENDING"}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {role === "PATIENT" && b.paymentStatus === "PENDING" && b.appointmentId && (
                      <button
                        disabled={paying === b.id}
                        onClick={() => handlePay(b)}
                        className="bg-teal-600 text-white px-4 py-1.5 rounded-md text-xs font-medium hover:bg-teal-700 disabled:opacity-50 transition"
                      >
                        {paying === b.id ? "Processing..." : "Pay Now"}
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