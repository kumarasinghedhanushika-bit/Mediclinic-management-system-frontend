import { useEffect, useState } from "react";
import { appointmentService } from "../../../api";
import StatCard from "../../../components/dashboard/StatCard";
import { Calendar, CheckCircle, Clock, CreditCard } from "lucide-react";
import type { Appointment, User } from "../../../types";

export default function PatientHome({
  user,
  onNavigate,
}: {
  user: User | null;
  onNavigate: (key: string) => void;
}) {
  const [apts, setApts]   = useState<Appointment[]>([]);

  useEffect(() => {
    appointmentService.my().then(setApts).catch(() => {});
  }, []);

  const upcoming = apts.filter(a => ["PENDING","CONFIRMED"].includes(a.status));

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-violet-600 to-violet-700 rounded-xl p-5 text-white">
        <p className="text-sm text-violet-200">Patient Portal</p>
        <h3 className="text-xl font-bold mt-0.5">Hello, {user?.firstName} 👋</h3>
        <p className="text-sm text-violet-200 mt-1">You have {upcoming.length} upcoming appointment(s).</p>
        <button
          onClick={() => onNavigate?.("book")}
          className="mt-3 px-4 py-2 bg-white text-violet-700 text-sm font-semibold rounded-lg hover:bg-violet-50 transition"
        >
          Book Appointment
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Appts"   value={apts.length}                                      icon={Calendar}     color="violet" />
        <StatCard label="Upcoming"      value={upcoming.length}                                  icon={Clock}        color="blue"   />
        <StatCard label="Completed"     value={apts.filter(a=>a.status==="COMPLETED").length}    icon={CheckCircle}  color="green"  />
        <StatCard label="Cancelled"     value={apts.filter(a=>a.status==="CANCELLED").length}    icon={CreditCard}   color="rose"   />
      </div>

      {/* Upcoming */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h4 className="text-sm font-semibold text-gray-900">Upcoming Appointments</h4>
        </div>
        {upcoming.length === 0
          ? <div className="py-8 text-center text-gray-400 text-sm">No upcoming appointments. <button onClick={() => onNavigate?.("book")} className="text-blue-600 hover:underline">Book one?</button></div>
          : upcoming.map(a => (
            <div key={a.id} className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">Dr. {a.doctorName}</p>
                <p className="text-xs text-gray-400">{a.appointmentDate} · {a.appointmentTime} · {a.departmentName}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                a.status === "CONFIRMED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
              }`}>{a.status}</span>
            </div>
          ))
        }
      </div>
    </div>
  );
}