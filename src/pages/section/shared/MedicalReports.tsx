import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { medicalReportService, patientService } from "../../../api";
import type { MedicalReport, Role, User } from "../../../types";

const REPORT_TYPES = [
  "PRESCRIPTION",
  "LAB_RESULT",
  "DIAGNOSIS",
  "DISCHARGE_SUMMARY",
  "OTHER",
];

interface Props {
  role?: Role;
  user?: User | null;
}

export default function MedicalReports({ role, user }: Props) {
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    patientId: "",
    reportType: "LAB_RESULT",
    diagnosis: "",
    notes: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const canUpload = ["DOCTOR", "LAB_TECHNICIAN", "ADMIN"].includes(role || "");
  const canDelete = canUpload;

  const load = async () => {
    setLoading(true);
    try {
      if (role === "PATIENT" && user?.id) {
        const patientId = await patientService.findIdByUserId(user.id);
        setReports(patientId ? await medicalReportService.byPatient(patientId) : []);
      } else {
        setReports(await medicalReportService.getAll());
      }
    } catch {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [role, user?.id]);

  const handleSubmit = async () => {
    if (!form.patientId) return toast.error("Patient ID required");
    try {
      await medicalReportService.create(form, file || undefined);
      toast.success("Report uploaded");
      setShowForm(false);
      setForm({ patientId: "", reportType: "LAB_RESULT", diagnosis: "", notes: "" });
      setFile(null);
      load();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Upload failed");
    }
  };

  const download = async (id: string) => {
    try {
      const res = await medicalReportService.download(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${id}.pdf`;
      a.click();
    } catch {
      toast.error("Download failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this report?")) return;
    try {
      await medicalReportService.delete(id);
      toast.success("Deleted");
      load();
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-400 py-8 text-center">Loading…</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-base font-semibold text-gray-900">
          {role === "PATIENT" ? "My Medical Reports" : "Medical Reports"}
        </h3>
        {canUpload && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg"
          >
            + Upload report
          </button>
        )}
      </div>

      {showForm && canUpload && (
        <div className="bg-gray-50 rounded-xl p-4 border space-y-3">
          <input
            placeholder="Patient ID *"
            value={form.patientId}
            onChange={(e) => setForm({ ...form, patientId: e.target.value })}
            className="w-full px-3 py-2 text-sm border rounded-lg"
          />
          <select
            value={form.reportType}
            onChange={(e) => setForm({ ...form, reportType: e.target.value })}
            className="w-full px-3 py-2 text-sm border rounded-lg"
          >
            {REPORT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <input
            placeholder="Diagnosis"
            value={form.diagnosis}
            onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
            className="w-full px-3 py-2 text-sm border rounded-lg"
          />
          <textarea
            placeholder="Notes"
            rows={2}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full px-3 py-2 text-sm border rounded-lg resize-none"
          />
          <input type="file" accept=".pdf,image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm" />
          <button onClick={handleSubmit} className="w-full py-2 bg-blue-600 text-white text-sm rounded-lg">
            Submit
          </button>
        </div>
      )}

      {reports.length === 0 ? (
        <div className="py-12 text-center text-gray-400 text-sm bg-gray-50 rounded-xl">No reports found</div>
      ) : (
        <div className="grid gap-3">
          {reports.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border p-4 flex justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{r.reportType}</span>
                <p className="font-medium text-gray-900 mt-2">{r.diagnosis || "Medical report"}</p>
                <p className="text-sm text-gray-500 mt-1">{r.notes}</p>
                <p className="text-xs text-gray-400 mt-2">{r.createdDate?.slice(0, 10)}</p>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                {r.reportFileUrl && (
                  <a href={r.reportFileUrl} target="_blank" rel="noreferrer" className="text-xs px-2 py-1 bg-gray-100 rounded-lg text-center">
                    View
                  </a>
                )}
                <button onClick={() => download(r.id)} className="text-xs px-2 py-1 bg-teal-50 text-teal-700 rounded-lg">
                  Download
                </button>
                {canDelete && (
                  <button onClick={() => handleDelete(r.id)} className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded-lg">
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
