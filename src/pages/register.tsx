// @ts-nocheck
import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const inputBase = (field, focused, errors) => ({
  width: "100%",
  background:
    focused === field ? "rgba(99,102,241,0.06)" : "rgba(255,255,255,0.03)",
  border: `1.5px solid ${
    errors[field]
      ? "#f87171"
      : focused === field
      ? "#6366f1"
      : "rgba(255,255,255,0.1)"
  }`,
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

function StrengthBar({ password }) {
  const calc = (p) => {
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
    <div style={{ marginTop: "8px" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "5px" }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: "3px",
              borderRadius: "99px",
              background:
                i <= score ? colors[score] : "rgba(255,255,255,0.1)",
              transition: "background 0.3s ease",
            }}
          />
        ))}
      </div>
      <p
        style={{
          fontSize: "11px",
          color: colors[score],
          margin: 0,
          fontWeight: 500,
        }}
      >
        {labels[score]}
      </p>
    </div>
  );
}

function IconMail({ color }) {
  return (
    <svg
      style={{
        position: "absolute",
        left: "14px",
        top: "50%",
        transform: "translateY(-50%)",
        color,
        transition: "color 0.2s",
        pointerEvents: "none",
      }}
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="m22 7-10 7L2 7" />
    </svg>
  );
}

function IconLock({ color }) {
  return (
    <svg
      style={{
        position: "absolute",
        left: "14px",
        top: "50%",
        transform: "translateY(-50%)",
        color,
        transition: "color 0.2s",
        pointerEvents: "none",
      }}
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconUser({ color }) {
  return (
    <svg
      style={{
        position: "absolute",
        left: "14px",
        top: "50%",
        transform: "translateY(-50%)",
        color,
        transition: "color 0.2s",
        pointerEvents: "none",
      }}
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function EyeIcon({ open }) {
  return open ? (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
    </svg>
  ) : (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function Register() {
  // ✅ FIX: State matches backend DTO — firstName + lastName instead of single "name"
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [show, setShow] = useState({
    password: false,
    confirm: false,
  });

  const [focused, setFocused] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  // ✅ FIX: Validation matches actual form fields — firstName & lastName
  const validate = () => {
    const e = {};

    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";

    if (!form.email) {
      e.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      e.email = "Enter a valid email";
    }

    if (!form.password) {
      e.password = "Password is required";
    } else if (form.password.length < 8) {
      e.password = "Minimum 8 characters";
    }

    if (!form.confirm) {
      e.confirm = "Please confirm your password";
    } else if (form.confirm !== form.password) {
      e.confirm = "Passwords do not match";
    }

    if (!agreed) e.agree = "You must accept the terms";

    return e;
  };

  const handleSubmit = async () => {
    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }

    try {
      setLoading(true);

      // ✅ FIX: Sends firstName + lastName separately, matching RegisterRequest DTO
      await API.post("/auth/register", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });

      setStep(2);

      // ✅ FIX: Reset includes all actual fields
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirm: "",
      });
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const iconColor = (field) =>
    focused === field ? "#6366f1" : "rgba(255,255,255,0.3)";

  // ─── Step 2: Success Screen ────────────────────────────────────────────────
  if (step === 2) {
    return (
      <div
        style={{
          minHeight: "100svh",
          background:
            "linear-gradient(135deg, #0c0c14 0%, #0f0f1a 50%, #0c0c14 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px 16px",
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            textAlign: "center",
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "28px",
            padding: "48px 32px 40px",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "rgba(52,211,153,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#34d399"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h2
            style={{
              color: "#fff",
              fontSize: "22px",
              fontWeight: 700,
              margin: "0 0 8px",
            }}
          >
            Account Created!
          </h2>

          {/* ✅ FIX: Was form.name (undefined) — now correctly uses form.firstName */}
          <p
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "14px",
              margin: "0 0 8px",
            }}
          >
            Welcome aboard!
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "13px",
              margin: "0 0 32px",
            }}
          >
            Check your email to verify your account before logging in.
          </p>

          <Link to="/login">
            <button
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "14px",
                border: "none",
                background: "#6366f1",
                color: "#fff",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Go to Login
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // ─── Step 1: Register Form ─────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100svh",
        background:
          "linear-gradient(135deg, #0c0c14 0%, #0f0f1a 50%, #0c0c14 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 16px",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: "28px",
          padding: "34px 30px 28px",
        }}
      >
        <h1
          style={{
            color: "#fff",
            fontSize: "24px",
            marginBottom: "25px",
            textAlign: "center",
            fontWeight: 700,
          }}
        >
          Create Account
        </h1>

        {/* ✅ FIX: Split into firstName + lastName — two separate inputs */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "14px" }}>
          {/* First Name */}
          <div style={{ flex: 1 }}>
            <div style={{ position: "relative" }}>
              <IconUser color={iconColor("firstName")} />
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                onFocus={() => setFocused("firstName")}
                onBlur={() => setFocused("")}
                style={inputBase("firstName", focused, errors)}
              />
            </div>
            {errors.firstName && (
              <p style={{ color: "#f87171", fontSize: "12px", margin: "4px 0 0" }}>
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div style={{ flex: 1 }}>
            <div style={{ position: "relative" }}>
              <IconUser color={iconColor("lastName")} />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                onFocus={() => setFocused("lastName")}
                onBlur={() => setFocused("")}
                style={inputBase("lastName", focused, errors)}
              />
            </div>
            {errors.lastName && (
              <p style={{ color: "#f87171", fontSize: "12px", margin: "4px 0 0" }}>
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* EMAIL */}
        <div style={{ marginBottom: "14px" }}>
          <div style={{ position: "relative" }}>
            <IconMail color={iconColor("email")} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused("")}
              style={inputBase("email", focused, errors)}
            />
          </div>
          {errors.email && (
            <p style={{ color: "#f87171", fontSize: "12px", margin: "4px 0 0" }}>
              {errors.email}
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div style={{ marginBottom: "14px" }}>
          <div style={{ position: "relative" }}>
            <IconLock color={iconColor("password")} />
            <input
              type={show.password ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused("")}
              style={{
                ...inputBase("password", focused, errors),
                paddingRight: "48px",
              }}
            />
            <button
              type="button"
              onClick={() => setShow({ ...show, password: !show.password })}
              style={{
                position: "absolute",
                right: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.4)",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
              }}
            >
              <EyeIcon open={show.password} />
            </button>
          </div>
          <StrengthBar password={form.password} />
          {errors.password && (
            <p style={{ color: "#f87171", fontSize: "12px", margin: "4px 0 0" }}>
              {errors.password}
            </p>
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ position: "relative" }}>
            <IconLock color={iconColor("confirm")} />
            <input
              type={show.confirm ? "text" : "password"}
              name="confirm"
              placeholder="Confirm Password"
              value={form.confirm}
              onChange={handleChange}
              onFocus={() => setFocused("confirm")}
              onBlur={() => setFocused("")}
              style={{
                ...inputBase("confirm", focused, errors),
                paddingRight: "48px",
              }}
            />
            <button
              type="button"
              onClick={() => setShow({ ...show, confirm: !show.confirm })}
              style={{
                position: "absolute",
                right: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.4)",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
              }}
            >
              <EyeIcon open={show.confirm} />
            </button>
          </div>
          {errors.confirm && (
            <p style={{ color: "#f87171", fontSize: "12px", margin: "4px 0 0" }}>
              {errors.confirm}
            </p>
          )}
        </div>

        {/* TERMS */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "rgba(255,255,255,0.7)",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
              style={{ accentColor: "#6366f1", width: "15px", height: "15px" }}
            />
            I agree to the{" "}
            <span style={{ color: "#6366f1", textDecoration: "underline", cursor: "pointer" }}>
              Terms &amp; Privacy Policy
            </span>
          </label>
          {errors.agree && (
            <p style={{ color: "#f87171", fontSize: "12px", margin: "4px 0 0" }}>
              {errors.agree}
            </p>
          )}
        </div>

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "14px",
            border: "none",
            background: loading ? "rgba(99,102,241,0.5)" : "#6366f1",
            color: "#fff",
            fontSize: "15px",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s ease",
          }}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        {/* LOGIN LINK */}
        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "rgba(255,255,255,0.4)",
            fontSize: "13px",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "#6366f1", textDecoration: "none", fontWeight: 500 }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}