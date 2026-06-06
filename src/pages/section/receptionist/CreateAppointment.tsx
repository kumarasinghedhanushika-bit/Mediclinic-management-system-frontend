import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { publicService, receptionService } from "../../../api";
import type { Doctor, Patient, TimeSlot } from "../../../types";

export default function CreateAppointment() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    receptionService.getPatients().then(setPatients).catch(() => {});
    receptionService.getDoctors().then(setDoctors).catch(() => {});
  }, []);

  const loadSlots = async (doctorId: string, date: string) => {
    if (!doctorId || !date) return setSlots([]);
    try {
      const data = await publicService.getDoctorSlots(doctorId, date);
      setSlots(data);
    } catch {
      setSlots([]);
    }
  };

  const handleSubmit = async () => {
    const { patientId, doctorId, appointmentDate, appointmentTime, reason } = form;
    if (!patientId || !doctorId || !appointmentDate || !appointmentTime || !reason) {
      return toast.error("Fill all required fields");
    }
    try {
      setLoading(true);
      await receptionService.createAppointment(form);
      toast.success("Appointment created");
      setForm({
        patientId: "",
        doctorId: "",
        appointmentDate: "",
        appointmentTime: "",
        reason: "",
        notes: "",
      });
      setSlots([]);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-lg space-y-4">
      <h3 className="text-base font-semibold text-gray-900">Create appointment</h3>
      <div className="bg-gray-50 rounded-xl p-4 border space-y-3">
        <div>
          <label className="text-xs text-gray-500">Patient record ID *</label>
          <select
            value={form.patientId}
            onChange={(e) => setForm({ ...form, patientId: e.target.value })}
            className="w-full mt-1 px-3 py-2 text-sm border rounded-lg"
          >
            <option value="">Select patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.patientNumber || p.id} — {p.userId?.slice(-6)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">Doctor *</label>
          <select
            value={form.doctorId}
            onChange={(e) => {
              const id = e.target.value;
              setForm({ ...form, doctorId: id, appointmentTime: "" });
              loadSlots(id, form.appointmentDate);
            }}
            className="w-full mt-1 px-3 py-2 text-sm border rounded-lg"
          >
            <option value="">Select doctor</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.doctorName} — {d.specialization}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">Date *</label>
          <input
            type="date"
            min={today}
            value={form.appointmentDate}
            onChange={(e) => {
              const date = e.target.value;
              setForm({ ...form, appointmentDate: date, appointmentTime: "" });
              loadSlots(form.doctorId, date);
            }}
            className="w-full mt-1 px-3 py-2 text-sm border rounded-lg"
          />
        </div>
        {slots.length > 0 && (
          <div>
            <label className="text-xs text-gray-500">Time slot *</label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {slots.map((s) => (
                <button
                  key={s.time}
                  type="button"
                  disabled={!s.available}
                  onClick={() => setForm({ ...form, appointmentTime: s.time })}
                  className={`px-2 py-1.5 text-xs rounded-lg border ${
                    form.appointmentTime === s.time
                      ? "bg-teal-600 text-white"
                      : s.available
                        ? "bg-white hover:border-teal-400"
                        : "opacity-40"
                  }`}
                >
                  {s.time}
                </button>
              ))}
            </div>
          </div>
        )}
        <input
          placeholder="Reason *"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          className="w-full px-3 py-2 text-sm border rounded-lg"
        />
        <textarea
          placeholder="Notes"
          rows={2}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="w-full px-3 py-2 text-sm border rounded-lg resize-none"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-lg disabled:opacity-50"
        >
          {loading ? "Creating…" : "Create appointment"}
        </button>
      </div>
    </div>
  );
}
