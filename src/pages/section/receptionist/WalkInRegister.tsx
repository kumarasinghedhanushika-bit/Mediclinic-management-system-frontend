import { useState } from "react";
import toast from "react-hot-toast";
import { receptionService } from "../../../api";
import type { User } from "../../../types";

export default function WalkInRegister() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    password: "Temp@1234", phone: "", gender: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<User | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.firstName || !form.email || !form.password) {
      return toast.error("Fill required fields");
    }
    try {
      setLoading(true);
      const res = await receptionService.registerWalkIn(form);
      setDone(res);
      toast.success("Patient registered!");
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="max-w-md">
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-green-600 text-2xl">✓</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Patient Registered!</h4>
          <p className="text-sm text-gray-600">{done.firstName} {done.lastName}</p>
          <p className="text-xs text-gray-400">{done.email}</p>
          <button
            onClick={() => setDone(null)}
            className="mt-4 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
          >
            Register Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-4">
      <h3 className="text-base font-semibold text-gray-900">Register Walk-in Patient</h3>
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 grid grid-cols-2 gap-3">
        {[
          { name: "firstName", label: "First Name *", full: false },
          { name: "lastName",  label: "Last Name",   full: false },
          { name: "email",     label: "Email *",     full: true  },
          { name: "phone",     label: "Phone",       full: false },
          { name: "password",  label: "Password *",  full: false },
        ].map(({ name, label, full }) => (
          <div key={name} className={full ? "col-span-2" : ""}>
            <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
            <input
              name={name}
              value={form[name as keyof typeof form]}
              onChange={handleChange}
              type={name === "password" ? "password" : "text"}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {loading ? "Registering…" : "Register Patient"}
      </button>
    </div>
  );
}