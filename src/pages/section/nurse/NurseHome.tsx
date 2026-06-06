import { useEffect, useState } from "react";
import { appointmentService } from "../../../api";
import StatCard from "../../../components/dashboard/StatCard";
import { Calendar, Users, Activity, Clock } from "lucide-react";
import type { Appointment, User } from "../../../types";

export default function NurseHome({ user }: { user: User | null }) {
  const [apts, setApts] = useState<Appointment[]>([]);

  useEffect(() => {
    appointmentService.getAll().then(setApts).catch(() => {});
  }, []);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-600 to-pink-700 rounded-xl p-5 text-white">
        <p className="text-sm text-pink-200">Nurse Portal</p>
        <h3 className="text-xl font-bold mt-0.5">Welcome, {user?.firstName} 👩‍⚕️</h3>
        <p className="text-sm text-pink-200 mt-1">{apts.filter(a=>a.appointmentDate===today).length} appointments today.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Appts"   value={apts.length}                                      icon={Calendar} color="blue"  />
        <StatCard label="Today"         value={apts.filter(a=>a.appointmentDate===today).length} icon={Clock}    color="pink"  sub="" />
        <StatCard label="Confirmed"     value={apts.filter(a=>a.status==="CONFIRMED").length}    icon={Activity} color="green" />
        <StatCard label="Pending"       value={apts.filter(a=>a.status==="PENDING").length}      icon={Users}    color="amber" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h4 className="text-sm font-semibold text-gray-900">Today's Appointments</h4>
        </div>
        {apts.filter(a=>a.appointmentDate===today).map(a => (
          <div key={a.id} className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0">
            <div>
              <p className="text-sm font-medium text-gray-900">{a.patientName}</p>
              <p className="text-xs text-gray-400">Dr. {a.doctorName} · {a.appointmentTime}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
              a.status === "CONFIRMED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
            }`}>{a.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}