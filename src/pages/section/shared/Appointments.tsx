import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  appointmentService,
  receptionService,
} from "../../../api";
import type {
  Appointment,
  AppointmentStatus,
  Role,
  User,
} from "../../../types";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  NO_SHOW: "bg-gray-100 text-gray-600",
};

interface Props {
  role?: Role;
  user?: User | null;
}

export default function Appointments({ role, user }: Props) {
  const [list, setList] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [rescheduleForm, setRescheduleForm] = useState({
    appointmentDate: "",
    appointmentTime: "",
    notes: "",
  });

  const load = async () => {
    setLoading(true);
    try {
      let data: Appointment[] = [];
      if (role === "PATIENT") data = await appointmentService.my();
      else if (role === "DOCTOR") data = await appointmentService.doctorSchedule();
      else if (role === "RECEPTIONIST") data = await receptionService.getAppointments();
      else data = await appointmentService.getAll();
      setList(data);
    } catch {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [role]);

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this appointment?")) return;
    try {
      await appointmentService.cancel(id);
      toast.success("Cancelled");
      load();
    } catch {
      toast.error("Failed to cancel");
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      await appointmentService.confirm(id);
      toast.success("Confirmed");
      load();
    } catch {
      toast.error("Failed to confirm");
    }
  };

  const handleStatus = async (id: string, status: AppointmentStatus) => {
    try {
      await appointmentService.updateStatus(id, status);
      toast.success("Status updated");
      load();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleId) return;
    try {
      await appointmentService.reschedule(rescheduleId, rescheduleForm);
      toast.success("Rescheduled");
      setRescheduleId(null);
      load();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Reschedule failed");
    }
  };

  const canConfirm = role === "RECEPTIONIST" || role === "ADMIN";
  const canStatus = role === "DOCTOR";
  const canCancel =
    role === "PATIENT" || role === "RECEPTIONIST" || role === "ADMIN";
  const canReschedule =
    role === "PATIENT" || role === "RECEPTIONIST" || role === "ADMIN";

  if (loading) {
    return <div className="text-sm text-gray-400 py-8 text-center">Loading…</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900">
        {role === "PATIENT"
          ? "My Appointments"
          : role === "DOCTOR"
            ? "My Schedule"
            : "All Appointments"}
      </h3>

      {rescheduleId && (
        <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 space-y-3">
          <h4 className="text-sm font-semibold text-teal-900">Reschedule appointment</h4>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              value={rescheduleForm.appointmentDate}
              onChange={(e) =>
                setRescheduleForm((f) => ({
                  ...f,
                  appointmentDate: e.target.value,
                }))
              }
              className="px-3 py-2 text-sm border rounded-lg"
            />
            <input
              type="time"
              value={rescheduleForm.appointmentTime}
              onChange={(e) =>
                setRescheduleForm((f) => ({
                  ...f,
                  appointmentTime: e.target.value,
                }))
              }
              className="px-3 py-2 text-sm border rounded-lg"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleReschedule}
              className="px-4 py-2 bg-teal-600 text-white text-sm rounded-lg"
            >
              Save
            </button>
            <button
              onClick={() => setRescheduleId(null)}
              className="px-4 py-2 bg-gray-200 text-sm rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {list.length === 0 ? (
        <div className="py-12 text-center text-gray-400 text-sm bg-gray-50 rounded-xl">
          No appointments found
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {[
                  "#",
                  "Patient",
                  "Doctor",
                  "Date",
                  "Time",
                  "Status",
                  "Fee",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {list.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    {a.appointmentNumber}
                  </td>
                  <td className="px-4 py-3 font-medium whitespace-nowrap">
                    {a.patientName}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {a.doctorName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{a.appointmentDate}</td>
                  <td className="px-4 py-3 text-gray-600">{a.appointmentTime}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                        STATUS_COLORS[a.status] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    LKR {a.consultationFee?.toFixed(2) ?? "—"}
                  </td>
                  <td className="px-4 py-3 flex flex-wrap gap-1">
                    {canConfirm && a.status === "PENDING" && (
                      <button
                        onClick={() => handleConfirm(a.id)}
                        className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-lg"
                      >
                        Confirm
                      </button>
                    )}
                    {canStatus && a.status === "CONFIRMED" && (
                      <button
                        onClick={() => handleStatus(a.id, "COMPLETED")}
                        className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-lg"
                      >
                        Complete
                      </button>
                    )}
                    {canReschedule &&
                      (a.status === "PENDING" || a.status === "CONFIRMED") && (
                        <button
                          onClick={() => {
                            setRescheduleId(a.id);
                            setRescheduleForm({
                              appointmentDate: a.appointmentDate || "",
                              appointmentTime: String(a.appointmentTime || "").slice(0, 5),
                              notes: "",
                            });
                          }}
                          className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded-lg"
                        >
                          Reschedule
                        </button>
                      )}
                    {canCancel &&
                      (a.status === "PENDING" || a.status === "CONFIRMED") && (
                        <button
                          onClick={() => handleCancel(a.id)}
                          className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded-lg"
                        >
                          Cancel
                        </button>
                      )}
                    {role === "PATIENT" && a.status === "CONFIRMED" && user && (
                      <span className="text-[10px] text-gray-400 self-center">
                        Pay in Bills
                      </span>
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
