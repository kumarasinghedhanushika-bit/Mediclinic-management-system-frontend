import { useState } from "react";
import toast from "react-hot-toast";
import { userService } from "../../../api";
import type { Role } from "../../../types";

const STAFF_ROLES: Role[] = [
  "DOCTOR",
  "RECEPTIONIST",
  "NURSE",
  "PHARMACIST",
  "LAB_TECHNICIAN",
  "ADMIN",
];

export default function ManageStaff() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "RECEPTIONIST" as Role,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!form.firstName.trim() || !form.email.trim()) {
      toast.error("First name and email are required");
      return;
    }

    try {
      setLoading(true);

      await userService.registerStaff({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        role: form.role,
      });

      toast.success(
        "Staff account created. Login details sent to email."
      );

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        role: "RECEPTIONIST",
      });
    } catch (e: unknown) {
      const err = e as {
        response?: { data?: { message?: string } };
      };

      toast.error(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg space-y-4">
      <h3 className="text-base font-semibold text-gray-900">
        Register Staff
      </h3>

      <p className="text-sm text-gray-500">
        Create staff accounts. The system will generate login
        credentials and send them via email automatically.
      </p>

      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
        {/* First + Last Name */}
        <div className="grid grid-cols-2 gap-3">
          <input
            name="firstName"
            placeholder="First name *"
            value={form.firstName}
            onChange={handleChange}
            className="px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
          />

          <input
            name="lastName"
            placeholder="Last name"
            value={form.lastName}
            onChange={handleChange}
            className="px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>

        {/* Email */}
        <input
          name="email"
          type="email"
          placeholder="Email *"
          value={form.email}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
        />

        {/* Role */}
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
        >
          {STAFF_ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 disabled:opacity-50 transition"
        >
          {loading ? "Creating staff..." : "Create Staff"}
        </button>
      </div>
    </div>
  );
}