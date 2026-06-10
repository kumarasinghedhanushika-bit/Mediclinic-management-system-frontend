import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
} from "react-icons/hi";
import {
  HiOutlineShieldCheck,
  HiOutlineClipboardDocumentCheck,
  HiOutlineDevicePhoneMobile,
  HiOutlineChartBar,
} from "react-icons/hi2";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// ── Password strength ──────────────────────────────────────────────────────
function StrengthBar({ password }: { password: string }) {
  if (!password) return null;

  const calc = (p: string) => {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };

  const score = calc(password);
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "bg-red-400", "bg-amber-400", "bg-emerald-400", "bg-sky-400"];
  const textColors = ["", "text-red-400", "text-amber-400", "text-emerald-400", "text-sky-400"];

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`flex-1 h-[3px] rounded-full transition-all duration-300 ${
              i <= score ? colors[score] : "bg-white/10"
            }`}
          />
        ))}
      </div>
      <p className={`text-[11px] font-medium ${textColors[score]}`}>
        {labels[score]}
      </p>
    </div>
  );
}

const features = [
  { icon: <HiOutlineClipboardDocumentCheck className="w-4 h-4" />, label: "Prescription tracking", color: "bg-sky-500/20 text-sky-400" },
  { icon: <HiOutlineDevicePhoneMobile className="w-4 h-4" />, label: "Mobile-ready access", color: "bg-violet-500/20 text-violet-400" },
  { icon: <HiOutlineChartBar className="w-4 h-4" />, label: "Health analytics", color: "bg-emerald-500/20 text-emerald-400" },
  { icon: <HiOutlineShieldCheck className="w-4 h-4" />, label: "HIPAA-grade encryption", color: "bg-rose-500/20 text-rose-400" },
];

// ── Success screen ─────────────────────────────────────────────────────────
function SuccessScreen() {
  const navigate = useNavigate();
  return (
    <div className="w-full h-screen relative overflow-hidden bg-[url('/bglogin.png')] bg-cover bg-center flex items-center justify-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-pulse-slow absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full bg-sky-500/10 blur-3xl" />
        <div className="animate-pulse-slow absolute -bottom-24 -right-24 w-[320px] h-[320px] rounded-full bg-indigo-500/10 blur-3xl" />
      </div>
      <div className="relative z-10 w-full max-w-sm mx-auto px-6 text-center animate-fade-up">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <HiOutlineShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
          <p className="text-white/45 text-sm mb-1">Welcome aboard!</p>
          <p className="text-white/40 text-sm mb-8">
            Check your email to verify your account before signing in.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="relative w-full h-[48px] rounded-xl font-semibold text-sm text-white overflow-hidden transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
            style={{ background: "linear-gradient(90deg,#0ea5e9 0%,#3b82f6 100%)" }}
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 pointer-events-none" />
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Register ──────────────────────────────────────────────────────────
export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [show, setShow] = useState({ password: false, confirm: false });
  const [focused, setFocused] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Minimum 8 characters";
    if (!form.confirm) e.confirm = "Please confirm your password";
    else if (form.confirm !== form.password) e.confirm = "Passwords do not match";
    if (!agreed) e.agree = "You must accept the terms";
    return e;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
    };

    try {
      setLoading(true);
      await API.post("/auth/register", payload);
      setSuccess(true);
      setForm({ firstName: "", lastName: "", email: "", password: "", confirm: "" });
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/api/auth/oauth2/authorize/google`;
  };

  if (success) return <SuccessScreen />;

const inputClass = (_field: string) =>
  `w-full h-[48px] pl-10 pr-4 bg-transparent text-white text-sm placeholder-white/25 outline-none rounded-xl transition-all duration-200`;
  const wrapClass = (field: string) =>
    `relative flex items-center rounded-xl border transition-all duration-200 ${
      errors[field]
        ? "border-red-500/60 bg-red-950/20"
        : focused === field
        ? "border-sky-500/60 bg-sky-950/40 shadow-[0_0_0_3px_rgba(14,165,233,0.12)]"
        : "border-white/10 bg-black/30"
    }`;

  const iconClass = (field: string) =>
    `absolute left-3.5 w-4 h-4 transition-colors duration-200 ${
      errors[field] ? "text-red-400" : focused === field ? "text-sky-400" : "text-white/30"
    }`;

  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-[url('/bglogin.png')] bg-cover bg-center">

      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-pulse-slow absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full bg-sky-500/10 blur-3xl" />
        <div className="animate-pulse-slow absolute -bottom-24 -right-24 w-[320px] h-[320px] rounded-full bg-indigo-500/10 blur-3xl animation-delay-1500" />
        <div className="animate-pulse-slow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-900/20 blur-3xl animation-delay-3000" />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 w-full min-h-screen flex items-center justify-center">
        <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-8 px-6 py-10">

          {/* ─── LEFT PANEL ─── */}
          <div className="hidden lg:flex flex-col w-1/2 animate-fade-up">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center">
                <HiOutlineShieldCheck className="w-5 h-5 text-sky-400" />
              </div>
              <span className="text-white font-semibold text-lg tracking-wide">MedicVault</span>
            </div>

            <h1 className="text-5xl font-bold text-white leading-tight mb-4">
              Join us <br />
              <span className="text-sky-400">today</span> 🚀
            </h1>

            <p className="text-slate-400 text-sm leading-relaxed mb-10 max-w-xs">
              Create your free account and take control of your health records, prescriptions, and appointments — all in one place.
            </p>

            <div className="flex flex-col gap-3">
              {features.map((f, i) => (
                <div
                  key={f.label}
                  className="flex items-center gap-3 bg-white/5 hover:bg-white/[0.08] border border-white/8 rounded-xl px-4 py-3 transition-all duration-300 hover:translate-x-1 animate-fade-up"
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
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-white">Create account</h2>
                <p className="text-white/45 text-sm mt-1">Join MedicVault for free</p>
              </div>

              {/* Google */}
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

              {/* First + Last name */}
              <div className="flex gap-3 mb-4">
                <div className="flex-1">
                  <label className="block text-xs text-white/50 mb-1.5 ml-1">First name</label>
                  <div className={wrapClass("firstName")}>
                    <HiOutlineUser className={iconClass("firstName")} />
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      onFocus={() => setFocused("firstName")}
                      onBlur={() => setFocused(null)}
                      placeholder="John"
                      className={inputClass("firstName")}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-400 text-[11px] mt-1 ml-1">{errors.firstName}</p>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-white/50 mb-1.5 ml-1">Last name</label>
                  <div className={wrapClass("lastName")}>
                    <HiOutlineUser className={iconClass("lastName")} />
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      onFocus={() => setFocused("lastName")}
                      onBlur={() => setFocused(null)}
                      placeholder="Doe"
                      className={inputClass("lastName")}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-red-400 text-[11px] mt-1 ml-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-xs text-white/50 mb-1.5 ml-1">Email address</label>
                <div className={wrapClass("email")}>
                  <HiOutlineMail className={iconClass("email")} />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    placeholder="you@example.com"
                    className={inputClass("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-[11px] mt-1 ml-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="block text-xs text-white/50 mb-1.5 ml-1">Password</label>
                <div className={`${wrapClass("password")} pr-4`}>
                  <HiOutlineLockClosed className={iconClass("password")} />
                  <input
                    type={show.password ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    placeholder="Min. 8 characters"
                    className={`${inputClass("password")} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShow({ ...show, password: !show.password })}
                    className="absolute right-3.5 text-white/30 hover:text-white/70 transition-colors duration-200"
                  >
                    {show.password ? <AiOutlineEyeInvisible className="w-4 h-4" /> : <AiOutlineEye className="w-4 h-4" />}
                  </button>
                </div>
                <StrengthBar password={form.password} />
                {errors.password && (
                  <p className="text-red-400 text-[11px] mt-1 ml-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm password */}
              <div className="mb-5">
                <label className="block text-xs text-white/50 mb-1.5 ml-1">Confirm password</label>
                <div className={`${wrapClass("confirm")} pr-4`}>
                  <HiOutlineLockClosed className={iconClass("confirm")} />
                  <input
                    type={show.confirm ? "text" : "password"}
                    name="confirm"
                    value={form.confirm}
                    onChange={handleChange}
                    onFocus={() => setFocused("confirm")}
                    onBlur={() => setFocused(null)}
                    placeholder="Re-enter password"
                    className={`${inputClass("confirm")} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShow({ ...show, confirm: !show.confirm })}
                    className="absolute right-3.5 text-white/30 hover:text-white/70 transition-colors duration-200"
                  >
                    {show.confirm ? <AiOutlineEyeInvisible className="w-4 h-4" /> : <AiOutlineEye className="w-4 h-4" />}
                  </button>
                </div>
                {/* match indicator */}
                {form.confirm && form.password && (
                  <p className={`text-[11px] mt-1 ml-1 ${form.confirm === form.password ? "text-emerald-400" : "text-red-400"}`}>
                    {form.confirm === form.password ? "✓ Passwords match" : "Passwords do not match"}
                  </p>
                )}
                {errors.confirm && !form.confirm && (
                  <p className="text-red-400 text-[11px] mt-1 ml-1">{errors.confirm}</p>
                )}
              </div>

              {/* Terms */}
              <div className="mb-5">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={() => {
                        setAgreed(!agreed);
                        if (errors.agree) setErrors({ ...errors, agree: "" });
                      }}
                      className="peer sr-only"
                    />
                    <div className={`w-4 h-4 rounded border transition-all duration-200 flex items-center justify-center ${
                      agreed ? "bg-sky-500 border-sky-500" : "border-white/20 bg-white/5"
                    }`}>
                      {agreed && (
                        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 10" fill="none">
                          <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-white/50 leading-relaxed">
                    I agree to the{" "}
                    <span className="text-sky-400 hover:text-sky-300 cursor-pointer underline underline-offset-2 transition-colors">
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="text-sky-400 hover:text-sky-300 cursor-pointer underline underline-offset-2 transition-colors">
                      Privacy Policy
                    </span>
                  </span>
                </label>
                {errors.agree && (
                  <p className="text-red-400 text-[11px] mt-1 ml-7">{errors.agree}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full h-[50px] rounded-xl font-semibold text-sm text-white overflow-hidden transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:scale-100 group"
                style={{ background: "linear-gradient(90deg,#0ea5e9 0%,#3b82f6 100%)" }}
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 pointer-events-none" />
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>

              {/* Login link */}
              <p className="text-center text-xs text-white/40 mt-5">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-sky-400 hover:text-sky-300 transition-colors hover:underline underline-offset-2"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}