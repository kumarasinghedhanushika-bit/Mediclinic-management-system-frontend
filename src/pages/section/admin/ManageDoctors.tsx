import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  departmentService,
  doctorService,
  userService,
} from "../../../api";
import type { Department, Doctor, DoctorRequestPayload, User } from "../../../types";

const emptyForm = (): DoctorRequestPayload => ({
  userId: "",
  specialization: "",
  departmentId: "",
  licenseNumber: "",
  experienceYears: 0,
  consultationFee: 0,
  slotDurationMinutes: 30,
  consultationStartTime: "09:00",
  consultationEndTime: "17:00",
  availableDays: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
  active: true,
});

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctorUsers, setDoctorUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DoctorRequestPayload>(emptyForm());

  const load = async () => {
    try {
      const [docs, deps, users] = await Promise.all([
        doctorService.getAll(),
        departmentService.getAll(),
        userService.getAll(),
      ]);
      setDoctors(docs);
      setDepartments(deps);
      setDoctorUsers(users.filter((u) => u.role === "DOCTOR"));
    } catch {
      toast.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setShowForm(true);
  };

  const openEdit = async (d: Doctor) => {
    try {
      const full = await doctorService.getById(d.id);
      setEditingId(d.id);
      setForm({
        userId: full.userId || "",
        specialization: full.specialization || "",
        departmentId: full.departmentId || "",
        licenseNumber: full.licenseNumber || "",
        experienceYears: full.experienceYears || 0,
        consultationFee: full.consultationFee || 0,
        slotDurationMinutes: full.slotDurationMinutes || 30,
        consultationStartTime: full.consultationStartTime || "09:00",
        consultationEndTime: full.consultationEndTime || "17:00",
        availableDays: full.availableDays || [],
        active: full.active ?? true,
      });
      setShowForm(true);
    } catch {
      toast.error("Could not load doctor");
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await doctorService.update(editingId, form);
        toast.success("Doctor updated");
      } else {
        await doctorService.create(form);
        toast.success("Doctor created");
      }
      setShowForm(false);
      load();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Save failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this doctor profile?")) return;
    try {
      await doctorService.delete(id);
      toast.success("Deleted");
      load();
    } catch {
      toast.error("Delete failed");
    }
  };

  const toggleActive = async (d: Doctor) => {
    if (!d.userId) return toast.error("Missing user link");
    try {
      await doctorService.update(d.id, {
        userId: d.userId,
        specialization: d.specialization || "",
        departmentId: d.departmentId || "",
        licenseNumber: d.licenseNumber || "N/A",
        experienceYears: d.experienceYears,
        consultationFee: d.consultationFee,
        slotDurationMinutes: d.slotDurationMinutes,
        consultationStartTime: d.consultationStartTime,
        consultationEndTime: d.consultationEndTime,
        availableDays: d.availableDays,
        active: !(d.active ?? false),
      });
      load();
    } catch {
      toast.error("Update failed");
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-400 text-sm">Loading…</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h3 className="text-base font-semibold text-gray-900">Manage doctors</h3>
        <button
          onClick={openCreate}
          className="px-3 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700"
        >
          + Add doctor profile
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
          <h4 className="text-sm font-semibold">
            {editingId ? "Edit doctor" : "New doctor profile"}
          </h4>
          <select
            value={form.userId}
            onChange={(e) => setForm({ ...form, userId: e.target.value })}
            disabled={!!editingId}
            className="w-full px-3 py-2 text-sm border rounded-lg"
          >
            <option value="">Link to user (DOCTOR role) *</option>
            {doctorUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.firstName} {u.lastName} — {u.email}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Specialization *"
              value={form.specialization}
              onChange={(e) => setForm({ ...form, specialization: e.target.value })}
              className="px-3 py-2 text-sm border rounded-lg"
            />
            <select
              value={form.departmentId}
              onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
              className="px-3 py-2 text-sm border rounded-lg"
            >
              <option value="">Department *</option>
              {departments.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.name}
                </option>
              ))}
            </select>
            <input
              placeholder="License number *"
              value={form.licenseNumber}
              onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
              className="px-3 py-2 text-sm border rounded-lg"
            />
            <input
              type="number"
              placeholder="Experience (years)"
              value={form.experienceYears}
              onChange={(e) =>
                setForm({ ...form, experienceYears: Number(e.target.value) })
              }
              className="px-3 py-2 text-sm border rounded-lg"
            />
            <input
              type="number"
              placeholder="Consultation fee (LKR)"
              value={form.consultationFee}
              onChange={(e) =>
                setForm({ ...form, consultationFee: Number(e.target.value) })
              }
              className="px-3 py-2 text-sm border rounded-lg"
            />
            <input
              type="number"
              placeholder="Slot duration (min)"
              value={form.slotDurationMinutes}
              onChange={(e) =>
                setForm({ ...form, slotDurationMinutes: Number(e.target.value) })
              }
              className="px-3 py-2 text-sm border rounded-lg"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 py-2 bg-teal-600 text-white text-sm rounded-lg"
            >
              Save
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 py-2 bg-gray-200 text-sm rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {["Name", "Specialization", "Department", "Fee", "Status", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {doctors.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">
                  {d.doctorName || `Dr. ${d.firstName || ""} ${d.lastName || ""}`.trim()}
                </td>
                <td className="px-4 py-3">{d.specialization}</td>
                <td className="px-4 py-3">{d.departmentName}</td>
                <td className="px-4 py-3">LKR {d.consultationFee}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActive(d)}
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      d.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {d.active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button
                    onClick={() => openEdit(d)}
                    className="text-xs text-teal-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
