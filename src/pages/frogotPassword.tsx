import { useState, useRef, useEffect } from "react";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineShieldCheck,
} from "react-icons/hi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { HiOutlineArrowLeft, HiOutlineArrowRight, HiOutlineCheckCircle } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

// ── Password strength bar ──────────────────────────────────────────────────
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
          <div key={i} className={`flex-1 h-[3px] rounded-full transition-all duration-300 ${i <= score ? colors[score] : "bg-white/10"}`} />
        ))}
      </div>
      <p className={`text-[11px] font-medium ${textColors[score]}`}>{labels[score]}</p>
    </div>
  );
}

// ── Step indicator ─────────────────────────────────────────────────────────
function StepDots({ current }: { current: number }) {
  const steps = ["Email", "Verify", "Reset"];
  return (
    <div className="flex items-center justify-center mb-7">
      {steps.map((label, idx) => {
        const s = idx + 1;
        const done = s < current;
        const active = s === current;
        return (
          <div key={s} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                done
                  ? "bg-sky-500 border-sky-500"
                  : active
                  ? "bg-sky-500/20 border-sky-500 shadow-[0_0_0_4px_rgba(14,165,233,0.15)]"
                  : "bg-white/5 border-white/15"
              }`}>
                {done ? (
                  <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span className={`text-[13px] font-semibold ${active ? "text-sky-400" : "text-white/25"}`}>{s}</span>
                )}
              </div>
              <span className={`text-[11px] font-medium ${active || done ? "text-white/60" : "text-white/20"}`}>{label}</span>
            </div>
            {idx < 2 && (
              <div className={`w-12 h-0.5 mb-5 mx-1 transition-all duration-300 ${s < current ? "bg-sky-500" : "bg-white/10"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Shared page wrapper ────────────────────────────────────────────────────
function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-[url('/bglogin.png')] bg-cover bg-center flex items-center justify-center px-4 py-10">
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
      <div className="relative z-10 w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center">
            <HiOutlineShieldCheck className="w-4.5 h-4.5 text-sky-400" />
          </div>
          <span className="text-white font-semibold text-base tracking-wide">MedicVault</span>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Shared card ────────────────────────────────────────────────────────────
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
      {/* top shimmer line */}
      <div className="absolute top-0 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
      {children}
    </div>
  );
}

// ── Input wrapper helpers ──────────────────────────────────────────────────
function inputWrap(focused: boolean, hasError: boolean) {
  return `relative flex items-center rounded-xl border transition-all duration-200 ${
    hasError
      ? "border-red-500/60 bg-red-950/20"
      : focused
      ? "border-sky-500/60 bg-sky-950/40 shadow-[0_0_0_3px_rgba(14,165,233,0.12)]"
      : "border-white/10 bg-black/30"
  }`;
}
function iconCls(focused: boolean, hasError: boolean) {
  return `absolute left-3.5 w-4 h-4 transition-colors duration-200 ${
    hasError ? "text-red-400" : focused ? "text-sky-400" : "text-white/30"
  }`;
}
const baseInput = "w-full h-[48px] pl-10 pr-4 bg-transparent text-white text-sm placeholder-white/25 outline-none rounded-xl";

// ── Submit button ──────────────────────────────────────────────────────────
function SubmitBtn({
  children, onClick, disabled, loading,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="relative w-full h-[50px] rounded-xl font-semibold text-sm text-white overflow-hidden transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed group"
      style={{ background: "linear-gradient(90deg,#0ea5e9 0%,#3b82f6 100%)" }}
    >
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 pointer-events-none" />
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          {children}
        </span>
      ) : children}
    </button>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 mx-auto mt-4 text-xs text-white/30 hover:text-white/60 transition-colors duration-200"
    >
      <HiOutlineArrowLeft className="w-3.5 h-3.5" />
      Back
    </button>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// STEP 1 — Email
// ══════════════════════════════════════════════════════════════════════════════
function StepEmail({ onNext }: { onNext: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    setError("");
    if (!email) { setError("Email is required"); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Enter a valid email address"); return; }
    try {
      setLoading(true);
      const res = await API.post("/auth/forgot-password", null, { params: { email } });
      if (res.data.success) { onNext(email); }
      else { setError(res.data.message || "No account found with this email"); }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send reset code");
    } finally { setLoading(false); }
  };

  return (
    <PageShell>
      <Card>
        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-500/25 flex items-center justify-center">
            <HiOutlineMail className="w-6 h-6 text-sky-400" />
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-1.5">Forgot password?</h1>
          <p className="text-white/40 text-sm leading-relaxed">No worries — we'll send you a reset code</p>
        </div>

        <StepDots current={1} />

        <div className="mb-5">
          <label className="block text-xs text-white/50 mb-1.5 ml-1">Email address</label>
          <div className={inputWrap(focused, !!error)}>
            <HiOutlineMail className={iconCls(focused, !!error)} />
            <input
              type="email"
              value={email}
              placeholder="you@example.com"
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              className={baseInput}
              autoComplete="email"
              inputMode="email"
            />
          </div>
          {error && <p className="text-red-400 text-[11px] mt-1 ml-1">{error}</p>}
        </div>

        <SubmitBtn onClick={submit} loading={loading}>
          {!loading && (
            <span className="flex items-center justify-center gap-1.5">
              Send OTP <HiOutlineArrowRight className="w-4 h-4" />
            </span>
          )}
          {loading && "Sending code…"}
        </SubmitBtn>

        <p className="text-center text-xs text-white/35 mt-5">
          Remember your password?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-sky-400 hover:text-sky-300 cursor-pointer transition-colors hover:underline underline-offset-2"
          >
            Sign in
          </span>
        </p>
      </Card>
    </PageShell>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// STEP 2 — OTP
// ══════════════════════════════════════════════════════════════════════════════
function StepOTP({
  email, onNext, onBack,
}: { email: string; onNext: () => void; onBack: () => void }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    refs.current[0]?.focus();
    const t = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(t); setCanResend(true); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const handleChange = (i: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp]; next[i] = digit; setOtp(next); setError("");
    if (digit && i < 5) refs.current[i + 1]?.focus();
  };
  const handleKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };
  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) { setOtp(pasted.split("")); refs.current[5]?.focus(); }
  };

  const submit = async () => {
    const code = otp.join("");
    if (code.length < 6) { setError("Enter the full 6-digit code"); return; }
    try {
      setLoading(true);
      const res = await API.post(`/auth/verify-otp?email=${email}&otp=${code}`);
      if (res.data.success) { onNext(); }
      else { setError(res.data.message || "Invalid or expired code"); }
    } catch (err: any) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally { setLoading(false); }
  };

  const resend = async () => {
    setResending(true);
    try { await API.post("/auth/forgot-password", null, { params: { email } }); } catch {}
    setResending(false); setCountdown(60); setCanResend(false);
    setOtp(["", "", "", "", "", ""]); refs.current[0]?.focus();
    const t = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(t); setCanResend(true); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  const filled = otp.every((d) => d !== "");

  return (
    <PageShell>
      <Card>
        <div className="flex justify-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-500/25 flex items-center justify-center">
            <HiOutlineShieldCheck className="w-6 h-6 text-sky-400" />
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-1.5">Check your email</h1>
          <p className="text-white/40 text-sm leading-relaxed">
            We sent a 6-digit code to<br />
            <span className="text-sky-400 font-medium">{email}</span>
          </p>
        </div>

        <StepDots current={2} />

        {/* OTP boxes */}
        <div className="flex gap-2.5 justify-center mb-2" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKey(i, e)}
              className={`w-11 h-14 rounded-xl text-center text-xl font-bold text-white outline-none transition-all duration-150 ${
                error
                  ? "border-2 border-red-500/60 bg-red-950/20"
                  : digit
                  ? "border-2 border-sky-500 bg-sky-500/10 shadow-[0_0_0_3px_rgba(14,165,233,0.12)]"
                  : "border border-white/15 bg-white/5 focus:border-sky-500/60 focus:bg-sky-950/20 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.10)]"
              }`}
              style={{ caretColor: "#38bdf8" }}
            />
          ))}
        </div>

        {error && <p className="text-red-400 text-[11px] text-center mt-1 mb-4">{error}</p>}

        <div className="mt-5 mb-1">
          <SubmitBtn onClick={submit} loading={loading} disabled={!filled}>
            {!loading && "Verify OTP"}
            {loading && "Verifying…"}
          </SubmitBtn>
        </div>

        <p className="text-center text-xs text-white/35 mt-4">
          {canResend ? (
            <>
              Didn't receive it?{" "}
              <span
                onClick={!resending ? resend : undefined}
                className="text-sky-400 hover:text-sky-300 cursor-pointer transition-colors hover:underline underline-offset-2"
              >
                {resending ? "Sending…" : "Resend code"}
              </span>
            </>
          ) : (
            <>
              Resend in{" "}
              <span className="text-sky-400 font-medium">{countdown}s</span>
            </>
          )}
        </p>

        <BackBtn onClick={onBack} />
      </Card>
    </PageShell>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// STEP 3 — New Password
// ══════════════════════════════════════════════════════════════════════════════
function StepNewPassword({
  email, onBack, onSuccess,
}: { email: string; onBack: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [show, setShow] = useState({ password: false, confirm: false });
  const [focused, setFocused] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "At least 8 characters";
    if (!form.confirm) e.confirm = "Please confirm your password";
    else if (form.confirm !== form.password) e.confirm = "Passwords don't match";
    return e;
  };

  const submit = async () => {
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    try {
      setLoading(true);
      await API.post("/auth/reset-password", { email, newPassword: form.password });
      onSuccess();
    } catch (err: any) {
      setErrors({ password: err.response?.data?.message || "Reset failed. Please try again." });
    } finally { setLoading(false); }
  };

  return (
    <PageShell>
      <Card>
        <div className="flex justify-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-500/25 flex items-center justify-center">
            <HiOutlineLockClosed className="w-6 h-6 text-sky-400" />
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-1.5">Set new password</h1>
          <p className="text-white/40 text-sm">Must be at least 8 characters</p>
        </div>

        <StepDots current={3} />

        {/* New password */}
        <div className="mb-4">
          <label className="block text-xs text-white/50 mb-1.5 ml-1">New password</label>
          <div className={`${inputWrap(focused === "password", !!errors.password)} pr-4`}>
            <HiOutlineLockClosed className={iconCls(focused === "password", !!errors.password)} />
            <input
              type={show.password ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              placeholder="Min. 8 characters"
              className={`${baseInput} pr-10`}
              autoComplete="new-password"
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
          {errors.password && <p className="text-red-400 text-[11px] mt-1 ml-1">{errors.password}</p>}
        </div>

        {/* Confirm password */}
        <div className="mb-6">
          <label className="block text-xs text-white/50 mb-1.5 ml-1">Confirm password</label>
          <div className={`${inputWrap(focused === "confirm", !!errors.confirm)} pr-4`}>
            <HiOutlineLockClosed className={iconCls(focused === "confirm", !!errors.confirm)} />
            <input
              type={show.confirm ? "text" : "password"}
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              onFocus={() => setFocused("confirm")}
              onBlur={() => setFocused(null)}
              placeholder="Repeat your password"
              className={`${baseInput} pr-10`}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShow({ ...show, confirm: !show.confirm })}
              className="absolute right-3.5 text-white/30 hover:text-white/70 transition-colors duration-200"
            >
              {show.confirm ? <AiOutlineEyeInvisible className="w-4 h-4" /> : <AiOutlineEye className="w-4 h-4" />}
            </button>
          </div>
          {form.confirm && form.password && (
            <p className={`text-[11px] mt-1 ml-1 ${form.confirm === form.password ? "text-emerald-400" : "text-red-400"}`}>
              {form.confirm === form.password ? "✓ Passwords match" : "Passwords do not match"}
            </p>
          )}
          {errors.confirm && !form.confirm && (
            <p className="text-red-400 text-[11px] mt-1 ml-1">{errors.confirm}</p>
          )}
        </div>

        <SubmitBtn onClick={submit} loading={loading}>
          {!loading && "Reset Password"}
          {loading && "Updating password…"}
        </SubmitBtn>

        <BackBtn onClick={onBack} />
      </Card>
    </PageShell>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// STEP 4 — Success
// ══════════════════════════════════════════════════════════════════════════════
function StepSuccess() {
  const navigate = useNavigate();
  return (
    <PageShell>
      <Card>
        <div className="text-center py-4">
          {/* Animated check ring */}
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/25 flex items-center justify-center mx-auto mb-6 animate-fade-up">
            <HiOutlineCheckCircle className="w-10 h-10 text-emerald-400" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Password updated!</h2>
          <p className="text-white/40 text-sm leading-relaxed mb-8">
            Your password has been reset successfully.<br />
            You can now sign in with your new password.
          </p>

          <SubmitBtn onClick={() => navigate("/login")}>
            <span className="flex items-center justify-center gap-1.5">
              Back to Sign in <HiOutlineArrowRight className="w-4 h-4" />
            </span>
          </SubmitBtn>
        </div>
      </Card>
    </PageShell>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  return (
    <>
    <div className="w-full min-h-screen relative overflow-hidden bg-[url('/bglogin.png')] bg-cover bg-center">
      {step === 1 && <StepEmail onNext={(em) => { setEmail(em); setStep(2); }} />}
      {step === 2 && <StepOTP email={email} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
      {step === 3 && <StepNewPassword email={email} onBack={() => setStep(2)} onSuccess={() => setStep(4)} />}
      {step === 4 && <StepSuccess />}
      </div>
    </>
  );
}