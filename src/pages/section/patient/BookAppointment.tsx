import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { appointmentService, publicService } from "../../../api";
import type { Department, Doctor, TimeSlot } from "../../../types";

export default function BookAppointment() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [form, setForm] = useState({
    departmentId: "",
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    publicService.getDepartments().then(setDepartments).catch(() => {});
  }, []);

  const handleDepartment = async (depId: string) => {
    setForm((f) => ({ ...f, departmentId: depId, doctorId: "", appointmentTime: "" }));
    setSlots([]);
    if (!depId) return setDoctors([]);
    setDoctors(await publicService.getDoctors(depId));
  };

  const handleDoctorDate = async (doctorId: string, date: string) => {
    setForm((f) => ({ ...f, doctorId, appointmentDate: date, appointmentTime: "" }));
    if (!doctorId || !date) return;
    try {
      setSlots(await publicService.getDoctorSlots(doctorId, date));
    } catch {
      setSlots([]);
    }
  };

  const handleSubmit = async () => {
    const { doctorId, appointmentDate, appointmentTime, reason } = form;
    if (!doctorId || !appointmentDate || !appointmentTime || !reason) {
      return toast.error("Fill all required fields");
    }
    try {
      setLoading(true);
      await appointmentService.book({
        doctorId,
        appointmentDate,
        appointmentTime,
        reason,
        notes: form.notes,
      });
      setBooked(true);
      toast.success("Appointment booked!");
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  if (booked) {
    return (
      <div className="max-w-md">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
          <h4 className="font-semibold text-gray-900 mb-1">Appointment Booked!</h4>
          <p className="text-sm text-gray-500">You will receive a confirmation shortly.</p>
          <button
            onClick={() => {
              setBooked(false);
              setForm({
                departmentId: "",
                doctorId: "",
                appointmentDate: "",
                appointmentTime: "",
                reason: "",
                notes: "",
              });
            }}
            className="mt-4 px-4 py-2 bg-teal-600 text-white text-sm rounded-lg"
          >
            Book Another
          </button>
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-lg space-y-4">
      <h3 className="text-base font-semibold text-gray-900">Book Appointment</h3>
      <div className="bg-gray-50 rounded-xl p-4 border space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Department *</label>
          <select
            value={form.departmentId}
            onChange={(e) => handleDepartment(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-lg"
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Doctor *</label>
          <select
            value={form.doctorId}
            onChange={(e) => handleDoctorDate(e.target.value, form.appointmentDate)}
            disabled={!doctors.length}
            className="w-full px-3 py-2 text-sm border rounded-lg disabled:bg-gray-100"
          >
            <option value="">Select Doctor</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.doctorName || `Dr. ${d.firstName || ""} ${d.lastName || ""}`.trim()} — LKR {d.consultationFee}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Date *</label>
          <input
            type="date"
            min={today}
            value={form.appointmentDate}
            onChange={(e) => handleDoctorDate(form.doctorId, e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-lg"
          />
        </div>
        {slots.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Available Slots *</label>
            <div className="grid grid-cols-4 gap-2">
              {slots.map((s) => (
                <button
                  key={s.time}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, appointmentTime: s.time }))}
                  disabled={!s.available}
                  className={`px-2 py-1.5 text-xs rounded-lg border font-medium ${
                    form.appointmentTime === s.time
                      ? "bg-teal-600 text-white border-teal-600"
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
          onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
          className="w-full px-3 py-2 text-sm border rounded-lg"
        />
        <textarea
          placeholder="Notes"
          rows={2}
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          className="w-full px-3 py-2 text-sm border rounded-lg resize-none"
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-lg disabled:opacity-50"
      >
        {loading ? "Booking…" : "Confirm Booking"}
      </button>
    </div>
  );
}
