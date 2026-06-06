import { useState } from "react";
import toast from "react-hot-toast";
import { userService } from "../../../api";
import type { User } from "../../../types";

export default function Profile({
  user,
  onUpdate,
}: {
  user: User;
  onUpdate?: () => void;
}) {
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    gender: user?.gender || "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(user?.avatar || null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await userService.updateProfile(form, avatarFile || undefined);
      toast.success("Profile updated!");
      onUpdate?.();
    } catch(error: unknown) {
      console.error("Profile update failed:", error);
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h3 className="text-base font-semibold text-gray-900 mb-4">My Profile</h3>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
        <div className="w-16 h-16 rounded-full bg-blue-100 overflow-hidden flex items-center justify-center font-bold text-blue-600 text-xl flex-shrink-0">
          {preview
            ? <img src={preview} alt="" className="w-full h-full object-cover" />
            : `${form.firstName?.[0] || ""}${form.lastName?.[0] || ""}`
          }
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{user?.email}</p>
          <label className="mt-1 inline-block text-xs text-blue-600 cursor-pointer hover:underline">
            Change photo
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { name: "firstName", label: "First Name" },
          { name: "lastName",  label: "Last Name"  },
          { name: "phone",     label: "Phone"      },
        ].map(({ name, label }) => (
          <div key={name} className={name === "phone" ? "col-span-2" : ""}>
            <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
            <input
              name={name}
              value={form[name as keyof typeof form]}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        ))}
        <div className="col-span-2">
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
        {loading ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}