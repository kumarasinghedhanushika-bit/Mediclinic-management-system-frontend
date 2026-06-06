import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { receptionService } from "../../../api";
import type { Patient } from "../../../types";

export default function PatientsList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Patient | null>(null);
  const [editForm, setEditForm] = useState<Patient | null>(null);

  const load = () =>
    receptionService
      .getPatients()
      .then(setPatients)
      .catch(() => toast.error("Failed to load patients"))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const openPatient = async (id: string) => {
    try {
      const p = await receptionService.getPatient(id);
      setSelected(p);
      setEditForm({ ...p });
    } catch {
      toast.error("Could not load patient");
    }
  };

  const savePatient = async () => {
    if (!editForm?.id) return;
    try {
      await receptionService.updatePatient(editForm.id, editForm);
      toast.success("Patient updated");
      setSelected(null);
      load();
    } catch {
      toast.error("Update failed");
    }
  };

  const filtered = patients.filter((p) =>
    `${p.patientNumber} ${p.id} ${p.userId} ${p.bloodGroup}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8 text-gray-400 text-sm">Loading…</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-base font-semibold text-gray-900">Patients</h3>
        <input
          placeholder="Search patients…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg w-56"
        />
      </div>

      {selected && editForm && (
        <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 space-y-3">
          <h4 className="text-sm font-semibold">Patient record: {selected.patientNumber || selected.id}</h4>
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Blood group"
              value={editForm.bloodGroup || ""}
              onChange={(e) => setEditForm({ ...editForm, bloodGroup: e.target.value })}
              className="px-3 py-2 text-sm border rounded-lg"
            />
            <input
              placeholder="Allergies"
              value={editForm.allergies || ""}
              onChange={(e) => setEditForm({ ...editForm, allergies: e.target.value })}
              className="px-3 py-2 text-sm border rounded-lg"
            />
            <input
              placeholder="Emergency contact"
              value={editForm.emergencyContactName || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, emergencyContactName: e.target.value })
              }
              className="px-3 py-2 text-sm border rounded-lg"
            />
            <input
              placeholder="Emergency phone"
              value={editForm.emergencyContactPhone || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, emergencyContactPhone: e.target.value })
              }
              className="px-3 py-2 text-sm border rounded-lg"
            />
            <textarea
              placeholder="Medical history"
              rows={2}
              value={editForm.medicalHistory || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, medicalHistory: e.target.value })
              }
              className="col-span-2 px-3 py-2 text-sm border rounded-lg resize-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={savePatient}
              className="px-4 py-2 bg-teal-600 text-white text-sm rounded-lg"
            >
              Save
            </button>
            <button
              onClick={() => setSelected(null)}
              className="px-4 py-2 bg-gray-200 text-sm rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {["Patient #", "User ID", "Blood", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{p.patientNumber || "—"}</td>
                <td className="px-4 py-3 text-xs text-gray-500 font-mono">{p.userId}</td>
                <td className="px-4 py-3">{p.bloodGroup || "—"}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => openPatient(p.id)}
                    className="text-xs text-teal-600 hover:underline"
                  >
                    View / Edit
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
