import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import toast from "react-hot-toast";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ─── Drop-in replacement — wire up your API / toast / router as before ───────
// import API from "../services/api";
// import toast from "react-hot-toast";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = (location.state as { from?: string })?.from || "/dashboard";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await login(form.email, form.password);
      toast.success("Login successful");
      navigate(from, { replace: true });
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 400) {
        toast.error("Invalid email or password");
      } else if (err.response?.status === 403) {
        toast.error("Access denied");
      } else {
        toast.error("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 relative overflow-hidden font-['DM_Sans',sans-serif]">

      {/* ── Background grid ── */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Accent blobs ── */}
      <div className="absolute top-[-120px] left-[-120px] w-[420px] h-[420px] rounded-full bg-violet-600 opacity-[0.12] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[320px] h-[320px] rounded-full bg-cyan-500 opacity-[0.10] blur-[100px] pointer-events-none" />

      {/* ── Geometric corner accents ── */}
      <span className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-violet-500/40" />
      <span className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-violet-500/40" />
      <span className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-violet-500/40" />
      <span className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-violet-500/40" />

      {/* ── Card ── */}
      <div className="relative w-full max-w-[400px] animate-[fadeUp_0.5s_ease_both]">

        {/* thin top bar */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-violet-500 to-transparent mb-px rounded-t-2xl" />

        <div className="bg-[#111118]/90 border border-white/[0.07] rounded-2xl px-8 pt-8 pb-7 shadow-[0_32px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl">

          {/* Logo mark */}
          <div className="flex justify-center mb-6">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-[0_0_24px_rgba(139,92,246,0.4)]">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 3L4 14h8l-1 7 9-11h-8l1-7z" />
              </svg>
            </div>
          </div>

          <h1 className="text-white text-[22px] font-semibold tracking-tight text-center leading-tight">
            Welcome back
          </h1>
          <p className="text-white/40 text-sm text-center mt-1 mb-7">
            Sign in to continue
          </p>

          {/* ── Email field ── */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-white/50 mb-2 tracking-wide uppercase">
              Email
            </label>
            <div
              className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                focused === "email"
                  ? "border-violet-500/70 bg-violet-500/[0.05] shadow-[0_0_0_3px_rgba(139,92,246,0.12)]"
                  : "border-white/[0.08] bg-white/[0.03]"
              }`}
            >
              <HiOutlineMail
                className={`absolute left-3.5 text-base transition-colors duration-200 ${
                  focused === "email" ? "text-violet-400" : "text-white/25"
                }`}
              />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused("")}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent pl-10 pr-4 py-3 text-sm text-white placeholder-white/20 outline-none"
              />
            </div>
          </div>

          {/* ── Password field ── */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-white/50 mb-2 tracking-wide uppercase">
              Password
            </label>
            <div
              className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                focused === "password"
                  ? "border-violet-500/70 bg-violet-500/[0.05] shadow-[0_0_0_3px_rgba(139,92,246,0.12)]"
                  : "border-white/[0.08] bg-white/[0.03]"
              }`}
            >
              <HiOutlineLockClosed
                className={`absolute left-3.5 text-base transition-colors duration-200 ${
                  focused === "password" ? "text-violet-400" : "text-white/25"
                }`}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused("")}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent pl-10 pr-11 py-3 text-sm text-white placeholder-white/20 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-white/30 hover:text-white/70 transition-colors duration-150"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible className="text-base" />
                ) : (
                  <AiOutlineEye className="text-base" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot */}
          <div className="flex justify-end mb-6">
            <button className="text-xs text-violet-400/80 hover:text-violet-300 transition-colors duration-150">
              <Link to="/forgot-password">
                Forgot password?
              </Link>
            </button>
          </div>

          {/* ── Login button ── */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="relative w-full py-3 rounded-xl font-semibold text-sm text-white bg-violet-600 hover:bg-violet-500 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_4px_24px_rgba(139,92,246,0.35)] overflow-hidden group"
          >
            {/* shimmer on hover */}
            <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="relative">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </span>
          </button>

          {/* ── Divider ── */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-xs text-white/25 font-medium">OR</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* ── Google ── */}
          <button className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-sm text-white/70 hover:text-white transition-all duration-200 active:scale-[0.98]">
            <FaGoogle className="text-sm" />
            Continue with Google
          </button>

          {/* ── Sign up ── */}
          <p className="text-center text-xs text-white/30 mt-6">
            Don't have an account?{" "}
            <span className="text-violet-400 hover:text-violet-300 cursor-pointer transition-colors duration-150 font-medium" onClick={() => navigate("/register")}>
              Create one
            </span>
          </p>
        </div>

        {/* bottom thin bar */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/5 to-transparent mt-px" />
      </div>

      {/* ── keyframe injection ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}