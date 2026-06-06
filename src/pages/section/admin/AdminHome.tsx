import { useEffect, useState } from "react";
import StatCard from "../../../components/dashboard/StatCard";
import { Users, Stethoscope, Calendar, Building2, Activity } from "lucide-react";
import {
  appointmentService,
  departmentService,
  doctorService,
  userService,
} from "../../../api";
import type { Appointment, User } from "../../../types";

export default function AdminHome({ user }: { user: User | null }) {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [recentApts, setRecentApts] = useState<Appointment[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [users, apts, docs, deps] = await Promise.all([
          userService.getAll(),
          appointmentService.getAll(),
          doctorService.getAll(),
          departmentService.getAll(),
        ]);
        setStats({
          users: users.length,
          doctors: docs.length,
          departments: deps.length,
          appointments: apts.length,
          today: apts.filter(
            (a) => a.appointmentDate === new Date().toISOString().split("T")[0]
          ).length,
        });
        setRecentApts(apts.slice(-5).reverse());
      } catch {
        /* ignore */
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 text-white">
        <p className="text-sm text-blue-200">Admin Panel</p>
        <h3 className="text-xl font-bold mt-0.5">Welcome, {user?.firstName}</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard label="Total Users" value={stats.users} icon={Users} color="blue" />
        <StatCard label="Doctors" value={stats.doctors} icon={Stethoscope} color="teal" />
        <StatCard label="Departments" value={stats.departments} icon={Building2} color="violet" />
        <StatCard label="Appointments" value={stats.appointments} icon={Calendar} color="amber" />
        <StatCard label="Today's Appts" value={stats.today} icon={Activity} color="green" sub="Scheduled today" />
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="px-4 py-3 border-b">
          <h4 className="text-sm font-semibold">Recent Appointments</h4>
        </div>
        {recentApts.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-sm">No recent appointments</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Patient", "Doctor", "Date", "Status"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentApts.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-2.5">{a.patientName}</td>
                  <td className="px-4 py-2.5">{a.doctorName}</td>
                  <td className="px-4 py-2.5">{a.appointmentDate}</td>
                  <td className="px-4 py-2.5">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
