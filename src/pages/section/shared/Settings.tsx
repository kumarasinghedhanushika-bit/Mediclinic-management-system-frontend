import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { userService } from "../../../api";
import { useAuth } from "../../../context/AuthContext";

export default function Settings() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (form.newPassword !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    try {
      setLoading(true);
      await userService.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success("Password changed");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Permanently delete your account?")) return;
    try {
      await userService.deleteAccount();
      await logout();
      navigate("/");
      toast.success("Account deleted");
    } catch {
      toast.error("Could not delete account");
    }
  };

  return (
    <div className="max-w-md space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Change Password</h3>
        <div className="space-y-3">
          {[
            { name: "currentPassword", label: "Current Password" },
            { name: "newPassword", label: "New Password" },
            { name: "confirmPassword", label: "Confirm Password" },
          ].map(({ name, label }) => (
            <div key={name}>
              <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
              <input
                type="password"
                name={name}
                value={form[name as keyof typeof form]}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-lg"
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-4 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-lg disabled:opacity-50"
        >
          {loading ? "Saving…" : "Update Password"}
        </button>
      </div>
      <div className="border-t pt-6">
        <h3 className="text-base font-semibold text-red-600 mb-2">Danger zone</h3>
        <p className="text-sm text-gray-500 mb-3">DELETE /api/user/delete</p>
        <button
          onClick={handleDeleteAccount}
          className="px-4 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-lg border border-red-200"
        >
          Delete my account
        </button>
      </div>
    </div>
  );
}
