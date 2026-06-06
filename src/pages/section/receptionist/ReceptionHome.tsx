import { useEffect, useState } from "react";
import StatCard from "../../../components/dashboard/StatCard";
import { Calendar, Users, UserPlus, Clock } from "lucide-react";
import { receptionService } from "../../../api";
import type { Appointment, Patient, User } from "../../../types";

export default function ReceptionHome({ user }: { user: User | null }) {
  const [todayApts, setTodayApts] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    receptionService.getTodayAppointments().then(setTodayApts).catch(() => {});
    receptionService.getPatients().then(setPatients).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-5 text-white">
        <p className="text-sm text-teal-200">Reception Desk</p>
        <h3 className="text-xl font-bold mt-0.5">Welcome, {user?.firstName}</h3>
        <p className="text-sm text-teal-200 mt-1">{todayApts.length} appointments today</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Today" value={todayApts.length} icon={Clock} color="teal" />
        <StatCard label="Patients" value={patients.length} icon={Users} color="blue" />
        <StatCard label="Pending" value={todayApts.filter((a) => a.status === "PENDING").length} icon={Calendar} color="amber" />
        <StatCard label="Confirmed" value={todayApts.filter((a) => a.status === "CONFIRMED").length} icon={UserPlus} color="green" />
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="px-4 py-3 border-b font-semibold text-sm">Today's schedule (GET /reception/appointments/today)</div>
        {todayApts.length === 0 ? (
          <p className="py-8 text-center text-gray-400 text-sm">No appointments today</p>
        ) : (
          todayApts.map((a) => (
            <div key={a.id} className="flex justify-between px-4 py-3 border-b last:border-0">
              <div>
                <p className="font-medium text-sm">{a.patientName}</p>
                <p className="text-xs text-gray-400">{a.appointmentTime} · Dr. {a.doctorName}</p>
              </div>
              <span className="text-xs font-semibold text-teal-700">{a.status}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
