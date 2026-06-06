import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { userService } from "../../../api";
import type { Role, User, UserStatus } from "../../../types";

const ROLES = ["ADMIN","DOCTOR","RECEPTIONIST","NURSE","PHARMACIST","LAB_TECHNICIAN","PATIENT"];
const STATUSES = ["ACTIVE","INACTIVE","SUSPENDED"];

export default function ManageUsers() {
  const [users, setUsers]   = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  useEffect(() => {
    userService.getAll()
      .then(setUsers)
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  const changeRole = async (email: string, newRole: string) => {
    try {
      await userService.changeRole(email, newRole as Role);
      setUsers(users.map(u => u.email === email ? { ...u, role: newRole as Role } : u));
      toast.success("Role updated");
    } catch { toast.error("Failed"); }
  };

  const changeStatus = async (email: string, newStatus: string) => {
    try {
      await userService.changeStatus(email, newStatus as UserStatus);
      setUsers(users.map(u => u.email === email ? { ...u, status: newStatus as UserStatus } : u));
      toast.success("Status updated");
    } catch { toast.error("Failed"); }
  };

  const filtered = users.filter(u =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="text-center py-8 text-gray-400 text-sm">Loading…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-base font-semibold text-gray-900">Manage Users</h3>
        <input
          placeholder="Search users…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Name","Email","Role","Status","Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {filtered.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{u.firstName} {u.lastName}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{u.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    onChange={e => changeRole(u.email, e.target.value)}
                    className="text-xs border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={u.status || "ACTIVE"}
                    onChange={e => changeStatus(u.email, e.target.value)}
                    className="text-xs border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    u.emailVerified ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {u.emailVerified ? "Verified" : "Unverified"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}