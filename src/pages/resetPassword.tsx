// @ts-nocheck
// src/pages/ForgotPassword.tsx
// Backend API mapping:
//   Step 1 → POST /auth/forgot-password/:email          (send OTP)
//   Step 2 → POST /auth/verify-otp?email=&otp=          (verify OTP)
//   Step 3 → POST /auth/reset-password?email=&newPassword= (@RequestParam)

import { useState, useRef, useEffect } from "react";
import React from "react";
import API from "../services/api";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ApiResponse<T> {
message: string;
error: boolean;
success: boolean;
data: T | null;
}

// ─── Shared input style ───────────────────────────────────────────────────────
const inputStyle = (focused: boolean, hasError: boolean): React.CSSProperties => ({
width: "100%",
background: focused ? "rgba(99,102,241,0.07)" : "rgba(255,255,255,0.03)",
border: `1.5px solid ${hasError ? "#f87171" : focused ? "#6366f1" : "rgba(255,255,255,0.1)"}`,
borderRadius: "14px",
padding: "13px 48px 13px 44px",
fontSize: "15px",
color: "#fff",
outline: "none",
transition: "all 0.2s ease",
boxSizing: "border-box",
WebkitAppearance: "none",
caretColor: "#6366f1",
fontFamily: "'Outfit', sans-serif",
});

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const IconMail = ({ active }: { active: boolean }) => (
<svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: active ? "#6366f1" : "rgba(255,255,255,0.3)", transition: "color 0.2s", pointerEvents: "none" }}
width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<rect x="2" y="4" width="20" height="16" rx="3" /><path d="m22 7-10 7L2 7" />
</svg>
);

const IconLock = ({ active }: { active: boolean }) => (
<svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: active ? "#6366f1" : "rgba(255,255,255,0.3)", transition: "color 0.2s", pointerEvents: "none" }}
width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
</svg>
);

const IconEye = ({ open }: { open: boolean }) => open
? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
</svg>
: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
</svg>;

const IconCheck = () => (
<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
<polyline points="20 6 9 17 4 12" />
</svg>
);

const IconArrow = () => (
<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
<path d="M5 12h14M12 5l7 7-7 7" />
</svg>
);

const IconBack = () => (
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
<path d="M19 12H5M12 19l-7-7 7-7" />
</svg>
);

const IconSpinner = () => (
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
<circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
<path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
</svg>
);

const IconLogin = () => (
<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
</svg>
);

// ─── Password strength ────────────────────────────────────────────────────────
const getStrength = (p: string) => {
let s = 0;
if (p.length >= 8) s++;
if (/[A-Z]/.test(p)) s++;
if (/[0-9]/.test(p)) s++;
if (/[^A-Za-z0-9]/.test(p)) s++;
return s;
};
const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColor = ["", "#f87171", "#fbbf24", "#34d399", "#6366f1"];

function StrengthBar({ password }: { password: string }) {
const score = getStrength(password);
if (!password) return null;
return (
<div style={{ marginTop: 8 }}>
    <div style={{ display: "flex", gap: 4, marginBottom: 5 }}>
    {[1, 2, 3, 4].map((i) => (
        <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, transition: "background 0.3s", background: i <= score ? strengthColor[score] : "rgba(255,255,255,0.1)" }} />
    ))}
    </div>
    <span style={{ fontSize: 11, color: strengthColor[score], fontWeight: 500 }}>{strengthLabel[score]}</span>
</div>
);
}

// Password requirement checklist
const requirements = [
{ label: "At least 8 characters", test: (p: string) => p.length >= 8 },
{ label: "Uppercase letter (A–Z)", test: (p: string) => /[A-Z]/.test(p) },
{ label: "Number (0–9)", test: (p: string) => /[0-9]/.test(p) },
{ label: "Special character (!@#…)", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

function RequirementList({ password }: { password: string }) {
if (!password) return null;
return (
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px", margin: "12px 0 20px" }}>
    {requirements.map(({ label, test }) => {
    const ok = test(password);
    return (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{
            width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
            background: ok ? "rgba(52,211,153,0.12)" : "rgba(255,255,255,0.04)",
            border: `1.5px solid ${ok ? "#34d399" : "rgba(255,255,255,0.12)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s",
        }}>
            {ok && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
        </div>
        <span style={{ fontSize: 11, color: ok ? "#34d399" : "rgba(255,255,255,0.3)", transition: "color 0.2s", fontWeight: 500 }}>{label}</span>
        </div>
    );
    })}
</div>
);
}

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: number }) {
const steps = ["Email", "Verify", "Reset"];
return (
<div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
    {steps.map((label, idx) => {
    const s = idx + 1;
    const done = s < current;
    const active = s === current;
    return (
        <React.Fragment key={s}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: done || active ? "#6366f1" : "rgba(255,255,255,0.05)",
            border: `2px solid ${done || active ? "#6366f1" : "rgba(255,255,255,0.12)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: active ? "0 0 0 4px rgba(99,102,241,0.18)" : "none",
            transition: "all 0.3s ease",
            }}>
            {done
                ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                : <span style={{ fontSize: 13, fontWeight: 700, color: active ? "#fff" : "rgba(255,255,255,0.25)" }}>{s}</span>
            }
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" as const, color: done || active ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.18)" }}>{label}</span>
        </div>
        {idx < 2 && (
            <div style={{ width: 44, height: 2, margin: "0 4px", marginBottom: 18, background: s < current ? "#6366f1" : "rgba(255,255,255,0.08)", transition: "background 0.4s ease", flexShrink: 0 }} />
        )}
        </React.Fragment>
    );
    })}
</div>
);
}

// ─── Shared layout ────────────────────────────────────────────────────────────
function Screen({ children }: { children: React.ReactNode }) {
return (
<div style={{
    minHeight: "100svh",
    background: "linear-gradient(135deg, #0c0c14 0%, #0f0f1a 50%, #0c0c14 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "20px 16px", fontFamily: "'Outfit', sans-serif",
    position: "relative", overflow: "hidden",
}}>
    {/* ambient blobs */}
    <div style={{ position: "absolute", top: "-10%", left: "-15%", width: "55vw", maxWidth: 440, height: "55vw", maxHeight: 440, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.16) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(50px)" }} />
    <div style={{ position: "absolute", bottom: "-8%", right: "-10%", width: "50vw", maxWidth: 380, height: "50vw", maxHeight: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(45px)" }} />
    <div style={{ position: "absolute", top: "38%", right: "6%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,211,238,0.05) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(35px)" }} />
    {children}
</div>
);
}

function Card({ children }: { children: React.ReactNode }) {
return (
<div className="fp-card" style={{
    width: "100%", maxWidth: 430,
    background: "rgba(255,255,255,0.035)",
    backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)",
    border: "1px solid rgba(255,255,255,0.08)", borderRadius: 28,
    padding: "38px 32px 32px",
    boxShadow: "0 48px 96px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)",
    position: "relative",
}}>
    {/* shimmer top line */}
    <div style={{ position: "absolute", top: 0, left: "18%", right: "18%", height: 1, background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.55), transparent)", borderRadius: 1 }} />
    {children}
</div>
);
}

function CardIcon({ children }: { children: React.ReactNode }) {
return (
<div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
    <div style={{
    width: 52, height: 52, borderRadius: 16,
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 0 0 1px rgba(99,102,241,0.3), 0 8px 28px rgba(99,102,241,0.4)",
    }}>
    {children}
    </div>
</div>
);
}

function Heading({ title, sub }: { title: string; sub: React.ReactNode }) {
return (
<div style={{ textAlign: "center", marginBottom: 26 }}>
    <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.4px" }}>{title}</h1>
    <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 14, margin: 0, lineHeight: 1.65 }}>{sub}</p>
</div>
);
}

function FieldLabel({ text }: { text: string }) {
return <label style={{ display: "block", color: "rgba(255,255,255,0.52)", fontSize: 12, fontWeight: 600, marginBottom: 8, letterSpacing: "0.6px", textTransform: "uppercase" as const }}>{text}</label>;
}

function FieldError({ msg }: { msg: string }) {
return (
<div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 5 }}>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
    <span style={{ color: "#f87171", fontSize: 12, fontWeight: 500 }}>{msg}</span>
</div>
);
}

function PrimaryButton({ label, loadingLabel, onClick, disabled, loading }: {
label: React.ReactNode; loadingLabel: string; onClick: () => void; disabled?: boolean; loading?: boolean;
}) {
return (
<button className="btn-primary" onClick={onClick} disabled={disabled || loading} style={{
    width: "100%", padding: "14px 20px", borderRadius: 14, border: "none",
    background: (disabled || loading) ? "rgba(99,102,241,0.4)" : "#6366f1",
    color: "#fff", fontSize: 15, fontWeight: 600,
    cursor: (disabled || loading) ? "not-allowed" : "pointer",
    fontFamily: "inherit", letterSpacing: "0.1px",
    boxShadow: (disabled || loading) ? "none" : "0 4px 22px rgba(99,102,241,0.38)",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    transition: "all 0.2s ease",
}}>
    {loading ? <><IconSpinner />{loadingLabel}</> : label}
</button>
);
}

function BackButton({ onClick }: { onClick: () => void }) {
return (
<button onClick={onClick} className="back-btn" style={{
    display: "flex", alignItems: "center", gap: 6,
    background: "none", border: "none", color: "rgba(255,255,255,0.28)",
    fontSize: 13, cursor: "pointer", fontFamily: "inherit",
    margin: "16px auto 0", padding: 0, transition: "color 0.2s",
}}>
    <IconBack /> Back
</button>
);
}

function EyeButton({ show, onToggle }: { show: boolean; onToggle: () => void }) {
return (
<button type="button" onClick={onToggle} className="eye-btn" style={{
    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
    background: "none", border: "none", color: "rgba(255,255,255,0.28)",
    cursor: "pointer", padding: 4, display: "flex", transition: "color 0.2s",
}}>
    <IconEye open={show} />
</button>
);
}

// ─── STEP 1 — Send OTP to email ───────────────────────────────────────────────
function StepEmail({ onNext }: { onNext: (email: string) => void }) {
const [email, setEmail]     = useState("");
const [focused, setFocused] = useState(false);
const [error, setError]     = useState("");
const [loading, setLoading] = useState(false);

const submit = async () => {
setError("");
if (!email.trim()) { setError("Email address is required"); return; }
if (!/\S+@\S+\.\S+/.test(email)) { setError("Please enter a valid email address"); return; }
try {
    setLoading(true);
    // POST /auth/forgot-password/:email
    const res = await API.post<ApiResponse<null>>(`/auth/forgot-password/${email.trim()}`);
    if (res.data.success) {
    onNext(email.trim());
    } else {
    setError(res.data.message || "No account found with this email");
    }
} catch (err: any) {
    setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
} finally { setLoading(false); }
};

return (
<Screen>
    <Card>
    <CardIcon>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="3" /><path d="m22 7-10 7L2 7" />
        </svg>
    </CardIcon>
    <Heading title="Forgot password?" sub="Enter your email and we'll send you a verification code" />
    <StepIndicator current={1} />

    <div style={{ marginBottom: 18 }}>
        <FieldLabel text="Email address" />
        <div style={{ position: "relative" }}>
        <IconMail active={focused} />
        <input
            type="email" placeholder="you@example.com" value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            style={{ ...inputStyle(focused, !!error), padding: "13px 16px 13px 44px" }}
            autoComplete="email" inputMode="email"
        />
        </div>
        {error && <FieldError msg={error} />}
    </div>

    <PrimaryButton
        label={<>Send OTP <IconArrow /></>}
        loadingLabel="Sending code…"
        onClick={submit}
        loading={loading}
    />

    <p style={{ textAlign: "center", color: "rgba(255,255,255,0.28)", fontSize: 13, marginTop: 20, marginBottom: 0 }}>
        Remember your password?{" "}
        <button className="link-btn" onClick={() => window.location.href = "/login"}
        style={{ background: "none", border: "none", color: "#818cf8", fontWeight: 600, cursor: "pointer", fontSize: 13, padding: 0, fontFamily: "inherit", transition: "color 0.2s" }}>
        Sign in
        </button>
    </p>
    </Card>
</Screen>
);
}

// ─── STEP 2 — Verify OTP ─────────────────────────────────────────────────────
function StepOTP({ email, onNext, onBack }: { email: string; onNext: () => void; onBack: () => void }) {
const [otp, setOtp]           = useState(["", "", "", "", "", ""]);
const [error, setError]       = useState("");
const [loading, setLoading]   = useState(false);
const [resending, setResending] = useState(false);
const [countdown, setCountdown] = useState(60);
const [canResend, setCanResend] = useState(false);
const refs = useRef<(HTMLInputElement | null)[]>([]);

const startTimer = () => {
setCountdown(60); setCanResend(false);
const t = setInterval(() => setCountdown((c) => {
    if (c <= 1) { clearInterval(t); setCanResend(true); return 0; }
    return c - 1;
}), 1000);
};

useEffect(() => { refs.current[0]?.focus(); startTimer(); }, []);

const handleChange = (i: number, val: string) => {
const digit = val.replace(/\D/g, "").slice(-1);
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
if (code.length < 6) { setError("Please enter the complete 6-digit code"); return; }
try {
    setLoading(true);
    // POST /auth/verify-otp?email=...&otp=...
    const res = await API.post<ApiResponse<null>>(`/auth/verify-otp?email=${encodeURIComponent(email)}&otp=${code}`);
    if (res.data.success) { onNext(); }
    else { setError(res.data.message || "Invalid or expired code"); }
} catch (err: any) {
    setError(err.response?.data?.message || "OTP verification failed");
} finally { setLoading(false); }
};

const resend = async () => {
setResending(true);
try { await API.post(`/auth/forgot-password/${email}`); } catch {}
setOtp(["", "", "", "", "", ""]); setError("");
refs.current[0]?.focus();
startTimer();
setResending(false);
};

const filled = otp.every((d) => d !== "");

return (
<Screen>
    <Card>
    <CardIcon>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    </CardIcon>
    <Heading
        title="Enter verification code"
        sub={<>We sent a 6-digit code to<br /><span style={{ color: "#a5b4fc", fontWeight: 600 }}>{email}</span></>}
    />
    <StepIndicator current={2} />

    {/* OTP input grid */}
    <div style={{ display: "flex", gap: 9, justifyContent: "center", marginBottom: 8 }} onPaste={handlePaste}>
        {otp.map((digit, i) => (
        <input key={i}
            ref={(el) => { refs.current[i] = el; }}
            type="text" inputMode="numeric" maxLength={1} value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKey(i, e)}
            style={{
            width: 46, height: 56, textAlign: "center",
            fontSize: 22, fontWeight: 700, color: "#fff", fontFamily: "'Outfit', sans-serif",
            borderRadius: 14, outline: "none", caretColor: "#6366f1",
            boxSizing: "border-box", transition: "all 0.15s ease",
            background: digit ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.03)",
            border: `1.5px solid ${error ? "#f87171" : digit ? "#6366f1" : "rgba(255,255,255,0.12)"}`,
            }}
        />
        ))}
    </div>
    {error && <p style={{ color: "#f87171", fontSize: 12, margin: "4px 0 0", textAlign: "center", fontWeight: 500 }}>{error}</p>}

    <div style={{ marginTop: 22 }}>
        <PrimaryButton
        label="Verify OTP"
        loadingLabel="Verifying…"
        onClick={submit}
        loading={loading}
        disabled={!filled}
        />
    </div>

    <p style={{ textAlign: "center", color: "rgba(255,255,255,0.28)", fontSize: 13, marginTop: 16, marginBottom: 0 }}>
        {canResend
        ? <>Didn't receive it?{" "}
            <button className="link-btn" onClick={resend} disabled={resending}
                style={{ background: "none", border: "none", color: "#818cf8", fontWeight: 600, cursor: "pointer", fontSize: 13, padding: 0, fontFamily: "inherit" }}>
                {resending ? "Sending…" : "Resend code"}
            </button>
            </>
        : <>Resend available in <span style={{ color: "#a5b4fc", fontWeight: 700 }}>{countdown}s</span></>
        }
    </p>
    <BackButton onClick={onBack} />
    </Card>
</Screen>
);
}

// ─── STEP 3 — Reset Password ──────────────────────────────────────────────────
// Backend: POST /auth/reset-password?email=...&newPassword=...
// Controller uses @RequestParam String email, @RequestParam String newPassword
// Service: finds user → bcrypt encodes → saves to MongoDB
function StepResetPassword({ email, onBack, onSuccess }: { email: string; onBack: () => void; onSuccess: () => void }) {
const [password, setPassword]   = useState("");
const [confirm, setConfirm]     = useState("");
const [showPw, setShowPw]       = useState(false);
const [showCf, setShowCf]       = useState(false);
const [focusedPw, setFocusedPw] = useState(false);
const [focusedCf, setFocusedCf] = useState(false);
const [errors, setErrors]       = useState<{ password?: string; confirm?: string; api?: string }>({});
const [loading, setLoading]     = useState(false);

const validate = () => {
const e: { password?: string; confirm?: string } = {};
if (!password)          e.password = "New password is required";
else if (password.length < 8) e.password = "Password must be at least 8 characters";
if (!confirm)           e.confirm  = "Please confirm your password";
else if (confirm !== password) e.confirm = "Passwords do not match";
return e;
};

const submit = async () => {
const v = validate();
if (Object.keys(v).length) { setErrors(v); return; }
try {
    setLoading(true);
    setErrors({});

    // ── API Call ──────────────────────────────────────────────────────────
    // Your Spring Boot controller:
    //   @PostMapping("/reset-password")
    //   public ResponseEntity<?> resetPassword(
    //     @RequestParam String email,
    //     @RequestParam String newPassword
    //   )
    // Must use query params — NOT request body
    // ─────────────────────────────────────────────────────────────────────
    const res = await API.post<ApiResponse<null>>(
    `/auth/reset-password?email=${encodeURIComponent(email)}&newPassword=${encodeURIComponent(password)}`
    );

    if (res.data.success) {
    onSuccess();
    } else {
    setErrors({ api: res.data.message || "Reset failed. Please try again." });
    }
} catch (err: any) {
    setErrors({ api: err.response?.data?.message || "Something went wrong. Please try again." });
} finally { setLoading(false); }
};

const passwordsMatch = confirm.length > 0 && confirm === password;

return (
<Screen>
    <Card>
    <CardIcon>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
        <circle cx="12" cy="16" r="1" fill="white" />
        </svg>
    </CardIcon>
    <Heading
        title="Set new password"
        sub={<>Resetting password for <span style={{ color: "#a5b4fc", fontWeight: 600 }}>{email}</span></>}
    />
    <StepIndicator current={3} />

    {/* API error banner */}
    {errors.api && (
        <div style={{
        background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)",
        borderRadius: 12, padding: "10px 14px", marginBottom: 16,
        display: "flex", alignItems: "center", gap: 8, color: "#fca5a5", fontSize: 13,
        }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        {errors.api}
        </div>
    )}

    {/* New password */}
    <div style={{ marginBottom: 14 }}>
        <FieldLabel text="New password" />
        <div style={{ position: "relative" }}>
        <IconLock active={focusedPw} />
        <input
            type={showPw ? "text" : "password"}
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: "" })); }}
            onFocus={() => setFocusedPw(true)}
            onBlur={() => setFocusedPw(false)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            style={inputStyle(focusedPw, !!errors.password)}
            autoComplete="new-password"
        />
        <EyeButton show={showPw} onToggle={() => setShowPw(!showPw)} />
        </div>
        <StrengthBar password={password} />
        {errors.password && <FieldError msg={errors.password} />}
    </div>

    {/* Confirm password */}
    <div style={{ marginBottom: 6 }}>
        <FieldLabel text="Confirm new password" />
        <div style={{ position: "relative" }}>
        <IconLock active={focusedCf} />
        <input
            type={showCf ? "text" : "password"}
            placeholder="Repeat your new password"
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value); setErrors((prev) => ({ ...prev, confirm: "" })); }}
            onFocus={() => setFocusedCf(true)}
            onBlur={() => setFocusedCf(false)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            style={inputStyle(focusedCf, !!errors.confirm)}
            autoComplete="new-password"
        />
        <EyeButton show={showCf} onToggle={() => setShowCf(!showCf)} />
        {/* Match checkmark — appears inside the field */}
        {passwordsMatch && (
            <div style={{ position: "absolute", right: 44, top: "50%", transform: "translateY(-50%)" }}>
            <IconCheck />
            </div>
        )}
        </div>
        {errors.confirm && <FieldError msg={errors.confirm} />}
    </div>

    {/* Password requirements checklist */}
    <RequirementList password={password} />

    {/* Submit */}
    <PrimaryButton
        label="Reset Password"
        loadingLabel="Updating password…"
        onClick={submit}
        loading={loading}
    />

    <BackButton onClick={onBack} />
    </Card>
</Screen>
);
}

// ─── STEP 4 — Success screen ──────────────────────────────────────────────────
function StepSuccess() {
return (
<Screen>
    <div className="fp-card" style={{
    width: "100%", maxWidth: 430, textAlign: "center",
    background: "rgba(255,255,255,0.035)", backdropFilter: "blur(28px)",
    border: "1px solid rgba(255,255,255,0.08)", borderRadius: 28,
    padding: "56px 32px 48px",
    boxShadow: "0 48px 96px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)",
    position: "relative",
    }}>
    <div style={{ position: "absolute", top: 0, left: "18%", right: "18%", height: 1, background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.55), transparent)" }} />

    {/* Animated success ring */}
    <div style={{ width: 76, height: 76, borderRadius: "50%", background: "rgba(52,211,153,0.1)", border: "1.5px solid rgba(52,211,153,0.28)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 26px", animation: "popIn 0.5s cubic-bezier(0.16,1,0.3,1) 0.15s both" }}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
        </svg>
    </div>

    <h2 style={{ color: "#fff", fontSize: 23, fontWeight: 700, margin: "0 0 10px", letterSpacing: "-0.4px" }}>Password updated!</h2>
    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: "0 0 10px", lineHeight: 1.75 }}>
        Your password has been reset and encrypted<br />securely. You can now sign in.
    </p>

    {/* Divider */}
    <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "24px 0" }} />

    <button className="btn-primary" onClick={() => window.location.href = "/login"} style={{
        width: "100%", padding: 14, borderRadius: 14, border: "none",
        background: "#6366f1", color: "#fff", fontSize: 15, fontWeight: 600,
        cursor: "pointer", fontFamily: "inherit",
        boxShadow: "0 4px 22px rgba(99,102,241,0.38)",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        transition: "all 0.2s ease",
    }}>
        <IconLogin /> Go to Sign in
    </button>
    </div>
</Screen>
);
}

// ─── Root — orchestrates all 4 steps ─────────────────────────────────────────
export default function ForgotPassword() {
const [step, setStep]   = useState<1 | 2 | 3 | 4>(1);
const [email, setEmail] = useState("");

return (
<>
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    body { margin: 0; }
    input:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 100px #12121e inset !important;
        -webkit-text-fill-color: #fff !important;
    }
    input::placeholder { color: rgba(255,255,255,0.2); }

    /* Card entrance */
    .fp-card { animation: slideUp 0.45s cubic-bezier(0.16,1,0.3,1) both; }
    @keyframes slideUp {
        from { opacity: 0; transform: translateY(28px) scale(0.97); }
        to   { opacity: 1; transform: none; }
    }
    @keyframes popIn {
        0%   { transform: scale(0);    opacity: 0; }
        70%  { transform: scale(1.12); opacity: 1; }
        100% { transform: scale(1); }
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Button states */
    .btn-primary { transition: all 0.2s ease !important; }
    .btn-primary:hover:not(:disabled) {
        background: #4f46e5 !important;
        transform: translateY(-1px);
        box-shadow: 0 8px 30px rgba(99,102,241,0.45) !important;
    }
    .btn-primary:active:not(:disabled) {
        transform: scale(0.98) translateY(0) !important;
    }

    /* Misc interactive */
    .eye-btn:hover  { color: rgba(255,255,255,0.75) !important; }
    .link-btn:hover { color: #a5b4fc !important; }
    .back-btn:hover { color: rgba(255,255,255,0.55) !important; }

    /* Mobile */
    @media (max-width: 480px) {
        .fp-card { border-radius: 22px !important; padding: 26px 18px 24px !important; }
    }
    `}</style>

    {step === 1 && (
    <StepEmail onNext={(em) => { setEmail(em); setStep(2); }} />
    )}
    {step === 2 && (
    <StepOTP email={email} onNext={() => setStep(3)} onBack={() => setStep(1)} />
    )}
    {step === 3 && (
    <StepResetPassword email={email} onBack={() => setStep(2)} onSuccess={() => setStep(4)} />
    )}
    {step === 4 && <StepSuccess />}
</>
);
}