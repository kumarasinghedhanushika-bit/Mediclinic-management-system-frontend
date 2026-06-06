import { useEffect, useState } from "react";
import { appointmentService, doctorService } from "../../../api";
import StatCard from "../../../components/dashboard/StatCard";
import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import type { Appointment, User } from "../../../types";

export default function DoctorHome({ user }: { user: User | null }) {
  const [apts, setApts] = useState<Appointment[]>([]);

  useEffect(() => {
    appointmentService.doctorSchedule().then(setApts).catch(() => {});
    doctorService.getMe().catch(() => {});
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const todayApts = apts.filter(a => a.appointmentDate === today);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-5 text-white">
        <p className="text-sm text-teal-200">Doctor Portal</p>
        <h3 className="text-xl font-bold mt-0.5">Good day, Dr. {user?.firstName} 👨‍⚕️</h3>
        <p className="text-sm text-teal-200 mt-1">You have {todayApts.length} appointment(s) today.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total"     value={apts.length}                                        icon={Calendar}     color="blue"  />
        <StatCard label="Today"     value={todayApts.length}                                   icon={Clock}        color="teal"  />
        <StatCard label="Completed" value={apts.filter(a=>a.status==="COMPLETED").length}      icon={CheckCircle}  color="green" />
        <StatCard label="Cancelled" value={apts.filter(a=>a.status==="CANCELLED").length}      icon={XCircle}      color="rose"  />
      </div>

      {/* Today's list */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h4 className="text-sm font-semibold text-gray-900">Today's Appointments</h4>
        </div>
        {todayApts.length === 0
          ? <div className="py-8 text-center text-gray-400 text-sm">No appointments today</div>
          : todayApts.map(a => (
            <div key={a.id} className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{a.patientName}</p>
                <p className="text-xs text-gray-400">{a.appointmentTime} · {a.reason || "General"}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                a.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                a.status === "PENDING"   ? "bg-amber-100 text-amber-700" :
                "bg-gray-100 text-gray-600"
              }`}>{a.status}</span>
            </div>
          ))
        }
      </div>
    </div>
  );
}