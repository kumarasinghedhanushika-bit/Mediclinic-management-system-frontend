import { useEffect, useState } from "react";
import { FlaskConical, FileText, Clock } from "lucide-react";
import { medicalReportService } from "../../../api";
import StatCard from "../../../components/dashboard/StatCard";
import type { MedicalReport, User } from "../../../types";

interface Props {
  user?: User | null;
}

export default function LabHome({ user }: Props) {
  const [reports, setReports] = useState<MedicalReport[]>([]);

  useEffect(() => {
    medicalReportService.getAll().then(setReports).catch(() => {});
  }, []);

  const labReports = reports.filter((r) => r.reportType === "LAB_RESULT");

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-xl p-5 text-white">
        <p className="text-sm text-cyan-200">Laboratory</p>
        <h3 className="text-xl font-bold mt-0.5">
          Welcome, {user?.firstName} 🔬
        </h3>
        <p className="text-sm text-cyan-200 mt-1">
          Upload and manage lab reports for patients
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard
          label="Total reports"
          value={reports.length}
          icon={FileText}
          color="cyan"
        />
        <StatCard
          label="Lab results"
          value={labReports.length}
          icon={FlaskConical}
          color="blue"
        />
        <StatCard
          label="This week"
          value={
            reports.filter((r) => {
              const d = r.createdDate?.slice(0, 10);
              if (!d) return false;
              const diff =
                (Date.now() - new Date(d).getTime()) / (1000 * 60 * 60 * 24);
              return diff <= 7;
            }).length
          }
          icon={Clock}
          color="teal"
        />
      </div>

      <p className="text-sm text-gray-500">
        Use the <strong>Lab Reports</strong> menu to upload new results.
      </p>
    </div>
  );
}
