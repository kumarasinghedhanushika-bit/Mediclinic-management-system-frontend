import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import {
  HiOutlineBellAlert,
  HiOutlineUsers,
  HiOutlineShieldCheck,
  HiOutlineUserGroup,
} from "react-icons/hi2";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const features = [
  { icon: <HiOutlineBellAlert className="w-4 h-4" />, label: "Smart reminders", color: "bg-sky-500/20 text-sky-400" },
  { icon: <HiOutlineUserGroup className="w-4 h-4" />, label: "Family profiles", color: "bg-violet-500/20 text-violet-400" },
  { icon: <HiOutlineUsers className="w-4 h-4" />, label: "Doctor sharing", color: "bg-emerald-500/20 text-emerald-400" },
  { icon: <HiOutlineShieldCheck className="w-4 h-4" />, label: "Secure encryption", color: "bg-rose-500/20 text-rose-400" },
];

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<"email" | "password" | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      await login(formData.email, formData.password);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/api/auth/oauth2/authorize/google`;
  };

  return (
    <div className="w-full h-screen relative overflow-hidden bg-[url('/bglogin.png')] bg-cover bg-center">
      


      {/* ── Ambient orbs ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-pulse-slow absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full bg-sky-500/10 blur-3xl" />
        <div className="animate-pulse-slow absolute -bottom-24 -right-24 w-[320px] h-[320px] rounded-full bg-indigo-500/10 blur-3xl animation-delay-1500" />
        <div className="animate-pulse-slow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-900/20 blur-3xl animation-delay-3000" />
      </div>

      {/* ── Subtle grid overlay ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── Main layout ── */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-8 px-6 py-10">

          {/* ─── LEFT PANEL ─── */}
          <div className="hidden lg:flex flex-col w-1/2 animate-fade-up">

            {/* Logo */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center">
                <HiOutlineShieldCheck className="w-5 h-5 text-sky-400" />
              </div>
              <span className="text-white font-semibold text-lg tracking-wide">MedicVault</span>
            </div>

            <h1 className="text-5xl font-bold text-white leading-tight mb-4">
              Welcome <br />
              <span className="text-sky-400">back</span> 👋
            </h1>

            <p className="text-slate-400 text-sm leading-relaxed mb-10 max-w-xs">
              Manage prescriptions, schedules, and medical records in a secure,
              modern digital health platform.
            </p>

            {/* Feature cards */}
            <div className="flex flex-col gap-3">
              {features.map((f, i) => (
                <div
                  key={f.label}
                  className="flex items-center gap-3 bg-white/5 hover:bg-white/8 border border-white/8 rounded-xl px-4 py-3 transition-all duration-300 hover:translate-x-1 animate-fade-up"
                  style={{ animationDelay: `${i * 80 + 200}ms` }}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${f.color}`}>
                    {f.icon}
                  </div>
                  <span className="text-sm text-white/75">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ─── RIGHT FORM PANEL ─── */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8 animate-fade-up animation-delay-100"
            >
              {/* Header */}
              <div className="text-center mb-7">
                <h2 className="text-3xl font-bold text-white">Sign in</h2>
                <p className="text-white/45 text-sm mt-1">Access your MedicVault account</p>
              </div>

              {/* Google button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-3 bg-white/90 hover:bg-white text-slate-700 font-medium rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-sm mb-5"
              >
                <FaGoogle className="text-red-500 text-sm" />
                <span className="text-sm">Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-white/30 text-xs tracking-widest uppercase">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Email field */}
              <div className="mb-4">
                <label className="block text-xs text-white/50 mb-1.5 ml-1">Email address</label>
                <div
                  className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                    focused === "email"
                      ? "border-sky-500/60 bg-sky-950/40 shadow-[0_0_0_3px_rgba(14,165,233,0.12)]"
                      : "border-white/10 bg-black/30"
                  }`}
                >
                  <HiOutlineMail
                    className={`absolute left-3.5 w-4 h-4 transition-colors duration-200 ${
                      focused === "email" ? "text-sky-400" : "text-white/30"
                    }`}
                  />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    placeholder="you@example.com"
                    className="w-full h-[48px] pl-10 pr-4 bg-transparent text-white text-sm placeholder-white/25 outline-none rounded-xl"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="mb-3">
                <label className="block text-xs text-white/50 mb-1.5 ml-1">Password</label>
                <div
                  className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                    focused === "password"
                      ? "border-sky-500/60 bg-sky-950/40 shadow-[0_0_0_3px_rgba(14,165,233,0.12)]"
                      : "border-white/10 bg-black/30"
                  }`}
                >
                  <HiOutlineLockClosed
                    className={`absolute left-3.5 w-4 h-4 transition-colors duration-200 ${
                      focused === "password" ? "text-sky-400" : "text-white/30"
                    }`}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    placeholder="••••••••"
                    className="w-full h-[48px] pl-10 pr-12 bg-transparent text-white text-sm placeholder-white/25 outline-none rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-white/30 hover:text-white/70 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible className="w-4 h-4" />
                    ) : (
                      <AiOutlineEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="text-right mb-6">
                <span
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs text-sky-400 hover:text-sky-300 cursor-pointer transition-colors duration-150 hover:underline underline-offset-2"
                >
                  Forgot password?
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full h-[50px] rounded-xl font-semibold text-sm text-white overflow-hidden transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:scale-100 group"
                style={{
                  background: "linear-gradient(90deg, #0ea5e9 0%, #3b82f6 100%)",
                }}
              >
                {/* shimmer */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 pointer-events-none" />

                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin w-4 h-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Register link */}
              <p className="text-center text-xs text-white/40 mt-5">
                Don&apos;t have an account?{" "}
                <span
                  onClick={() => navigate("/register")}
                  className="text-sky-400 hover:text-sky-300 cursor-pointer transition-colors hover:underline underline-offset-2"
                >
                  Create one
                </span>
              </p>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}