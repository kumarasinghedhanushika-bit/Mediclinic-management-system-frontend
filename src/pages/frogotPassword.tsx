// @ts-nocheck
// src/pages/ForgotPassword.tsx

import { useState, useRef, useEffect } from "react";
import React from "react";
import API from "../services/api";

// ─── Shared style helper ──────────────────────────────────────────────────────
const inputBase = (focused: boolean, hasError: boolean): React.CSSProperties => ({
width: "100%",
background: focused ? "rgba(99,102,241,0.06)" : "rgba(255,255,255,0.03)",
border: `1.5px solid ${hasError ? "#f87171" : focused ? "#6366f1" : "rgba(255,255,255,0.1)"}`,
borderRadius: "14px",
padding: "13px 16px 13px 44px",
fontSize: "15px",
color: "#fff",
outline: "none",
transition: "all 0.2s ease",
boxSizing: "border-box",
WebkitAppearance: "none",
caretColor: "#6366f1",
});

// ─── Icons ────────────────────────────────────────────────────────────────────
function IconMail({ color }: { color: string }) {
return (
<svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color, transition: "color 0.2s", pointerEvents: "none" }}
    width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="3" /><path d="m22 7-10 7L2 7" />
</svg>
);
}
function IconLock({ color }: { color: string }) {
return (
<svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color, transition: "color 0.2s", pointerEvents: "none" }}
    width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
</svg>
);
}
function EyeIcon({ open }: { open: boolean }) {
return open
? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
    </svg>
: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>;
}

// ─── Password strength bar ────────────────────────────────────────────────────
function StrengthBar({ password }: { password: string }) {
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
const colors = ["", "#f87171", "#fbbf24", "#34d399", "#6366f1"];
if (!password) return null;
return (
<div style={{ marginTop: 8 }}>
    <div style={{ display: "flex", gap: 4, marginBottom: 5 }}>
    {[1, 2, 3, 4].map((i) => (
        <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= score ? colors[score] : "rgba(255,255,255,0.1)", transition: "background 0.3s ease" }} />
    ))}
    </div>
    <p style={{ fontSize: 11, color: colors[score], margin: 0, fontWeight: 500 }}>{labels[score]}</p>
</div>
);
}

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepDots({ current }: { current: number }) {
const labels = ["Email", "Verify", "Reset"];
return (
<div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 28 }}>
    {[1, 2, 3].map((s, idx) => (
    <React.Fragment key={s}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
        <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: s <= current ? "#6366f1" : "rgba(255,255,255,0.06)",
            border: `2px solid ${s <= current ? "#6366f1" : "rgba(255,255,255,0.12)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.3s ease",
            boxShadow: s === current ? "0 0 0 4px rgba(99,102,241,0.2)" : "none",
        }}>
            {s < current
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            : <span style={{ color: s <= current ? "#fff" : "rgba(255,255,255,0.3)", fontSize: 13, fontWeight: 600 }}>{s}</span>
            }
        </div>
        <span style={{ fontSize: 11, color: s <= current ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)", fontWeight: 500, letterSpacing: "0.3px" }}>{labels[idx]}</span>
        </div>
        {idx < 2 && (
        <div style={{ width: 48, height: 2, background: s < current ? "#6366f1" : "rgba(255,255,255,0.08)", marginBottom: 20, transition: "background 0.3s ease", flexShrink: 0 }} />
        )}
    </React.Fragment>
    ))}
</div>
);
}

// ─── Shared page wrapper ──────────────────────────────────────────────────────
function PageWrap({ children }: { children: React.ReactNode }) {
return (
<div style={{
    minHeight: "100svh",
    background: "linear-gradient(135deg, #0c0c14 0%, #0f0f1a 50%, #0c0c14 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "20px 16px", fontFamily: "'Outfit', sans-serif",
    position: "relative", overflow: "hidden",
}}>
    <div style={{ position: "absolute", top: "-10%", left: "-15%", width: "55vw", maxWidth: 420, height: "55vw", maxHeight: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.17) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(40px)" }} />
    <div style={{ position: "absolute", bottom: "-8%", right: "-10%", width: "45vw", maxWidth: 360, height: "45vw", maxHeight: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.13) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(40px)" }} />
    <div style={{ position: "absolute", top: "35%", right: "5%", width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,211,238,0.05) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(30px)" }} />
    {children}
</div>
);
}

// ─── Card shell ───────────────────────────────────────────────────────────────
function Card({ children }: { children: React.ReactNode }) {
return (
<div className="fp-card" style={{
    width: "100%", maxWidth: 420,
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(255,255,255,0.09)", borderRadius: 28,
    padding: "36px 30px 30px",
    boxShadow: "0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
    position: "relative",
}}>
    <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 1, background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)" }} />
    {children}
</div>
);
}

function LogoIcon({ icon }: { icon: React.ReactNode }) {
return (
<div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
    <div style={{ width: 50, height: 50, borderRadius: 15, background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 1px rgba(99,102,241,0.3), 0 8px 24px rgba(99,102,241,0.38)" }}>
    {icon}
    </div>
</div>
);
}

function PrimaryBtn({ children, onClick, disabled, loading }: {
children: React.ReactNode; onClick: () => void; disabled?: boolean; loading?: boolean;
}) {
return (
<button className="btn-primary" onClick={onClick} disabled={disabled || loading} style={{
    width: "100%", padding: "14px", borderRadius: 14, border: "none",
    background: (disabled || loading) ? "rgba(99,102,241,0.45)" : "#6366f1",
    color: "#fff", fontSize: 15, fontWeight: 600,
    cursor: (disabled || loading) ? "not-allowed" : "pointer",
    fontFamily: "inherit", letterSpacing: "0.1px",
    boxShadow: (disabled || loading) ? "none" : "0 4px 20px rgba(99,102,241,0.35)",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    transition: "all 0.2s ease",
}}>
    {loading && (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
        <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
    )}
    {children}
</button>
);
}

const Label = ({ text }: { text: string }) => (
<label style={{ display: "block", color: "rgba(255,255,255,0.55)", fontSize: 12, fontWeight: 600, marginBottom: 8, letterSpacing: "0.6px", textTransform: "uppercase" as const }}>{text}</label>
);
const ErrorMsg = ({ msg }: { msg: string }) => (
<p style={{ color: "#f87171", fontSize: 12, margin: "5px 0 0 4px" }}>{msg}</p>
);

// ─── STEP 1 — Email ───────────────────────────────────────────────────────────
function StepEmail({ onNext }: { onNext: (email: string) => void }) {
const [email, setEmail] = useState("");
const [focused, setFocused] = useState(false);
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

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
<PageWrap>
    <Card>
    <LogoIcon icon={
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="3" /><path d="m22 7-10 7L2 7" />
        </svg>
    } />
    <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, textAlign: "center", margin: "0 0 6px", letterSpacing: "-0.4px" }}>Forgot password?</h1>
    <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 14, textAlign: "center", margin: "0 0 26px", lineHeight: 1.6 }}>No worries — we'll send you a reset code</p>
    <StepDots current={1} />
    <div style={{ marginBottom: 16 }}>
        <Label text="Email address" />
        <div style={{ position: "relative" }}>
        <IconMail color={focused ? "#6366f1" : "rgba(255,255,255,0.3)"} />
        <input type="email" placeholder="you@example.com" value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            style={{ ...inputBase(focused, !!error), paddingRight: 16 }}
            autoComplete="email" inputMode="email" />
        </div>
        {error && <ErrorMsg msg={error} />}
    </div>
    <PrimaryBtn onClick={submit} loading={loading}>
        {!loading && <>Send OTP <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg></>}
        {loading && "Sending code…"}
    </PrimaryBtn>
    <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 13, marginTop: 20, marginBottom: 0 }}>
        Remember your password?{" "}
        <button className="link-btn" onClick={() => window.location.href = "/login"} style={{ background: "none", border: "none", color: "#818cf8", fontWeight: 600, cursor: "pointer", fontSize: 13, padding: 0, fontFamily: "inherit", transition: "color 0.2s" }}>Sign in</button>
    </p>
    </Card>
</PageWrap>
);
}

// ─── STEP 2 — OTP ─────────────────────────────────────────────────────────────
function StepOTP({ email, onNext, onBack }: { email: string; onNext: () => void; onBack: () => void }) {
const [otp, setOtp] = useState(["", "", "", "", "", ""]);
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const [resending, setResending] = useState(false);
const [countdown, setCountdown] = useState(60);
const [canResend, setCanResend] = useState(false);
const refs = useRef<(HTMLInputElement | null)[]>([]);

useEffect(() => {
refs.current[0]?.focus();
const t = setInterval(() => setCountdown((c) => { if (c <= 1) { clearInterval(t); setCanResend(true); return 0; } return c - 1; }), 1000);
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
const t = setInterval(() => setCountdown((c) => { if (c <= 1) { clearInterval(t); setCanResend(true); return 0; } return c - 1; }), 1000);
};

const filled = otp.every((d) => d !== "");

return (
<PageWrap>
    <Card>
    <LogoIcon icon={
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    } />
    <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, textAlign: "center", margin: "0 0 6px", letterSpacing: "-0.4px" }}>Check your email</h1>
    <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 14, textAlign: "center", margin: "0 0 26px", lineHeight: 1.6 }}>
        We sent a 6-digit code to<br />
        <span style={{ color: "#a5b4fc", fontWeight: 600 }}>{email}</span>
    </p>
    <StepDots current={2} />
    <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 8 }} onPaste={handlePaste}>
        {otp.map((digit, i) => (
        <input key={i} ref={(el) => { refs.current[i] = el; }}
            type="text" inputMode="numeric" maxLength={1} value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKey(i, e)}
            style={{
            width: 46, height: 54, borderRadius: 14, textAlign: "center",
            fontSize: 22, fontWeight: 700, color: "#fff", fontFamily: "'Outfit', sans-serif",
            background: digit ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.03)",
            border: `1.5px solid ${error ? "#f87171" : digit ? "#6366f1" : "rgba(255,255,255,0.12)"}`,
            outline: "none", caretColor: "#6366f1", transition: "all 0.15s ease", boxSizing: "border-box",
            }} />
        ))}
    </div>
    {error && <p style={{ color: "#f87171", fontSize: 12, margin: "4px 0 0", textAlign: "center" }}>{error}</p>}
    <div style={{ marginTop: 20 }}>
        <PrimaryBtn onClick={submit} loading={loading} disabled={!filled}>
        {!loading && "Verify OTP"}
        {loading && "Verifying…"}
        </PrimaryBtn>
    </div>
    <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 13, marginTop: 16, marginBottom: 0 }}>
        {canResend
        ? <>Didn't receive it?{" "}<button className="link-btn" onClick={resend} disabled={resending} style={{ background: "none", border: "none", color: "#818cf8", fontWeight: 600, cursor: "pointer", fontSize: 13, padding: 0, fontFamily: "inherit" }}>{resending ? "Sending…" : "Resend code"}</button></>
        : <>Resend in <span style={{ color: "#a5b4fc", fontWeight: 600 }}>{countdown}s</span></>
        }
    </p>
    <button onClick={onBack} className="back-btn" style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 13, cursor: "pointer", fontFamily: "inherit", margin: "14px auto 0", padding: 0, transition: "color 0.2s" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        Back
    </button>
    </Card>
</PageWrap>
);
}

// ─── STEP 3 — New Password ────────────────────────────────────────────────────
function StepNewPassword({ email, onBack, onSuccess }: { email: string; onBack: () => void; onSuccess: () => void }) {
const [form, setForm] = useState({ password: "", confirm: "" });
const [show, setShow] = useState({ password: false, confirm: false });
const [focused, setFocused] = useState("");
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
<PageWrap>
    <Card>
    <LogoIcon icon={
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
        <circle cx="12" cy="16" r="1" fill="white" />
        </svg>
    } />
    <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, textAlign: "center", margin: "0 0 6px", letterSpacing: "-0.4px" }}>Set new password</h1>
    <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 14, textAlign: "center", margin: "0 0 26px" }}>Must be at least 8 characters</p>
    <StepDots current={3} />
    <div style={{ marginBottom: 14 }}>
        <Label text="New password" />
        <div style={{ position: "relative" }}>
        <IconLock color={focused === "password" ? "#6366f1" : "rgba(255,255,255,0.3)"} />
        <input type={show.password ? "text" : "password"} name="password" placeholder="Min. 8 characters"
            value={form.password} onChange={handleChange}
            onFocus={() => setFocused("password")} onBlur={() => setFocused("")}
            style={{ ...inputBase(focused === "password", !!errors.password), paddingRight: 48 }}
            autoComplete="new-password" />
        <button type="button" onClick={() => setShow({ ...show, password: !show.password })} className="eye-btn"
            style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: 4, display: "flex", transition: "color 0.2s" }}>
            <EyeIcon open={show.password} />
        </button>
        </div>
        <StrengthBar password={form.password} />
        {errors.password && <ErrorMsg msg={errors.password} />}
    </div>
    <div style={{ marginBottom: 22 }}>
        <Label text="Confirm password" />
        <div style={{ position: "relative" }}>
        <IconLock color={focused === "confirm" ? "#6366f1" : "rgba(255,255,255,0.3)"} />
        <input type={show.confirm ? "text" : "password"} name="confirm" placeholder="Repeat your password"
            value={form.confirm} onChange={handleChange}
            onFocus={() => setFocused("confirm")} onBlur={() => setFocused("")}
            style={{ ...inputBase(focused === "confirm", !!errors.confirm), paddingRight: 48 }}
            autoComplete="new-password" />
        <button type="button" onClick={() => setShow({ ...show, confirm: !show.confirm })} className="eye-btn"
            style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: 4, display: "flex", transition: "color 0.2s" }}>
            <EyeIcon open={show.confirm} />
        </button>
        {form.confirm && form.confirm === form.password && (
            <div style={{ position: "absolute", right: 44, top: "50%", transform: "translateY(-50%)" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
        )}
        </div>
        {errors.confirm && <ErrorMsg msg={errors.confirm} />}
    </div>
    <PrimaryBtn onClick={submit} loading={loading}>
        {!loading && "Reset Password"}
        {loading && "Updating password…"}
    </PrimaryBtn>
    <button onClick={onBack} className="back-btn" style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 13, cursor: "pointer", fontFamily: "inherit", margin: "14px auto 0", padding: 0, transition: "color 0.2s" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        Back
    </button>
    </Card>
</PageWrap>
);
}

// ─── STEP 4 — Success ─────────────────────────────────────────────────────────
function StepSuccess() {
return (
<PageWrap>
    <div className="fp-card" style={{
    width: "100%", maxWidth: 420, textAlign: "center",
    background: "rgba(255,255,255,0.04)", backdropFilter: "blur(24px)",
    border: "1px solid rgba(255,255,255,0.09)", borderRadius: 28,
    padding: "52px 32px 44px",
    boxShadow: "0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
    position: "relative",
    }}>
    <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 1, background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)" }} />
    <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(52,211,153,0.12)", border: "1.5px solid rgba(52,211,153,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", animation: "popIn 0.5s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
    </div>
    <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: "0 0 10px", letterSpacing: "-0.4px" }}>Password updated!</h2>
    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: "0 0 32px", lineHeight: 1.7 }}>
        Your password has been reset successfully.<br />You can now sign in with your new password.
    </p>
    <button className="btn-primary" onClick={() => window.location.href = "/login"} style={{
        width: "100%", padding: 14, borderRadius: 14, border: "none",
        background: "#6366f1", color: "#fff", fontSize: 15, fontWeight: 600,
        cursor: "pointer", fontFamily: "inherit",
        boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        transition: "all 0.2s ease",
    }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" /></svg>
        Back to Sign in
    </button>
    </div>
</PageWrap>
);
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function ForgotPassword() {
const [step, setStep] = useState(1);
const [email, setEmail] = useState("");

return (
<>
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    body { margin: 0; }
    input:-webkit-autofill { -webkit-box-shadow: 0 0 0 100px #13131f inset !important; -webkit-text-fill-color: #fff !important; }
    input::placeholder { color: rgba(255,255,255,0.22); }
    .fp-card { animation: slideUp 0.45s cubic-bezier(0.16,1,0.3,1) both; }
    @keyframes slideUp { from { opacity:0; transform:translateY(28px) scale(0.97); } to { opacity:1; transform:none; } }
    @keyframes popIn  { 0%{transform:scale(0)} 70%{transform:scale(1.15)} 100%{transform:scale(1)} }
    @keyframes spin   { to { transform: rotate(360deg); } }
    .btn-primary { transition: all 0.2s ease !important; }
    .btn-primary:hover:not(:disabled) { background: #4f46e5 !important; transform: translateY(-1px); box-shadow: 0 8px 32px rgba(99,102,241,0.45) !important; }
    .btn-primary:active:not(:disabled) { transform: scale(0.98) translateY(0) !important; }
    .eye-btn:hover { color: rgba(255,255,255,0.8) !important; }
    .link-btn:hover { color: #a5b4fc !important; }
    .back-btn:hover { color: rgba(255,255,255,0.6) !important; }
    @media (max-width: 480px) { .fp-card { border-radius: 22px !important; padding: 26px 18px 22px !important; } }
    `}</style>

    {step === 1 && <StepEmail onNext={(em) => { setEmail(em); setStep(2); }} />}
    {step === 2 && <StepOTP email={email} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
    {step === 3 && <StepNewPassword email={email} onBack={() => setStep(2)} onSuccess={() => setStep(4)} />}
    {step === 4 && <StepSuccess />}
</>
);
}