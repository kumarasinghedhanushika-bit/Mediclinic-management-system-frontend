import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Shield,
  Clock,
  ArrowRight,
  Building2,
  Search,
  ChevronDown,
  Stethoscope,
} from "lucide-react";
import { publicService } from "../api";
import type { Department } from "../types";
import { useAuth } from "../context/AuthContext";

// ── Hex-pattern SVG background (inline data URI) ──────────────────────────────
const HEX_PATTERN = `url("data:image/svg+xml,%3Csvg width='60' height='70' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='30,5 55,17.5 55,52.5 30,65 5,52.5 5,17.5' fill='none' stroke='%232a8fa0' stroke-width='1.5'/%3E%3C/svg%3E")`;

// ── Stat strip ─────────────────────────────────────────────────────────────────
const STATS = [
  { value: "4500+", label: "Happy Patients" },
  { value: "200",   label: "Hospital Rooms" },
  { value: "500+",  label: "Award Wins"     },
  { value: "20+",   label: "Ambulances"     },
];

// ── Feature cards ──────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Calendar,
    title: "Online booking",
    desc: "Choose department, doctor, date and time slot in seconds from anywhere.",
  },
  {
    icon: Shield,
    title: "Secure payments",
    desc: "Pay consultation fees via PayHere with fully encrypted checkout.",
  },
  {
    icon: Clock,
    title: "Real-time schedule",
    desc: "Staff and doctors see live appointment status updates instantly.",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);

  // Search bar state
  const [searchDept,     setSearchDept]     = useState("");
  const [searchDoctor,   setSearchDoctor]   = useState("");
  const [searchDate,     setSearchDate]     = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  useEffect(() => {
    publicService
      .getDepartments()
      .then((data) => setDepartments(data.slice(0, 6)))
      .catch(() => {});
  }, []);

  // Navigate to channeling with optional filters
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchDept)   params.set("department", searchDept);
    if (searchDoctor) params.set("doctor",     searchDoctor);
    navigate(`/channeling${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <div className="font-sans">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(140deg,#88CDF6 0%,#53A7D8 40%,#BCE6FF 100%)",
          minHeight: 420,
        }}
      >
        {/* Hex pattern */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: HEX_PATTERN,
            backgroundSize: "60px 70px",
          }}
        />

        {/* Decorative blobs */}
        <div
          className="absolute pointer-events-none"
          style={{
            right: "5%",
            top: "8%",
            width: 340,
            height: 340,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(58,168,184,0.35) 0%,transparent 70%)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            right: "14%",
            bottom: "4%",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(42,143,160,0.18) 0%,transparent 70%)",
          }}
        />

        {/* Content grid */}
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 pt-14 pb-0 grid md:grid-cols-2 gap-8 items-end">

          {/* Left column */}
          <div className="pb-14 md:pb-16 z-10">

            {/* Online badge */}
            <span
              className="inline-flex items-center gap-2 bg-white rounded-full px-3 py-1.5 text-xs font-semibold text-slate-800 mb-6"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
            >
              <span
                className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"
                style={{ animation: "hpPulse 2s infinite" }}
              />
              Online hospital services
            </span>

            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight mb-4">
              Premium Treatments for<br />
              a{" "}
              <span style={{ color: "#015C92" }}>Healthy</span> Lifestyle
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed max-w-md mb-8">
              Book specialist appointments online, track visits, pay securely,
              and access your medical records — all in one convenient portal.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() =>
                  navigate(isAuthenticated ? "/dashboard" : "/aboutus")
                }
                className="inline-flex items-center gap-2 px-6 py-3 text-white text-sm font-semibold rounded-full transition hover:-translate-y-px"
                style={{
                  background: "#015C92",
                  boxShadow: "0 4px 16px rgba(1,92,146,0.35)",
                }}
              >
                <Search size={15} />
                View Our Hospital
              </button>

              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-full border transition hover:bg-white"
                  style={{
                    background: "rgba(255,255,255,0.75)",
                    borderColor: "rgba(42,143,160,0.3)",
                    color: "#1a3a4a",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  Create patient account
                </Link>
              )}
            </div>
          </div>

          {/* Right column — doctor image */}
          <div className="relative z-10 flex justify-center items-end">
            <div className="relative" style={{ width: 320 }}>

                
              
              <div
                className="mx-auto flex items-center justify-center"
                style={{
                  width: 300,
                  height: 340,
                  borderRadius: "60% 60% 0 0",
                  background:
                    "linear-gradient(160deg,rgba(255,255,255,0.45),rgba(58,168,184,0.2))",
                  border: "1px solid rgba(255,255,255,0.5)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <div className="fflex flex-col items-center gap-2 text-[#53A7D8]/50">
                  <Stethoscope size={48} strokeWidth={1.2} />
                  <span className="text-xs font-medium text-center leading-relaxed">
                    Add doctor image here
                  </span>
                </div>
              </div>

              {/* Floating search badge */}
              <div
                className="absolute flex items-center gap-3 px-3 py-2.5 rounded-2xl"
                style={{
                  bottom: 64,
                  left: -20,
                  background: "rgba(255,255,255,0.88)",
                  backdropFilter: "blur(16px)",
                  border: "0.5px solid rgba(255,255,255,0.6)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "#53A7D8" }}
                >
                  <Search size={14} color="white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 leading-tight">
                    Search the Medical
                  </p>
                  <p className="text-[10px] text-slate-500">
                    With more Care Options
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ───────────────────────────────────────────────────── */}
      <div
        className="grid grid-cols-2 md:grid-cols-4"
        style={{
          background: "rgba(255,255,255,0.80)",
          backdropFilter: "blur(12px)",
          borderTop: "0.5px solid rgba(255,255,255,0.6)",
          borderBottom: "0.5px solid rgba(42,143,160,0.08)",
        }}
      >
        {STATS.map(({ value, label }, i) => (
          <div
            key={label}
            className="py-5 text-center"
            style={{
              borderRight:
                i < STATS.length - 1
                  ? "0.5px solid rgba(42,143,160,0.12)"
                  : "none",
            }}
          >
            <p className="text-2xl font-extrabold" style={{ color: "#53A7D8" }}>
              {value}
            </p>
            <p className="text-xs font-medium mt-0.5" style={{ color: "#53A7D8" }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* ── SEARCH BAR ────────────────────────────────────────────────────── */}
      <div className="px-4 md:px-10 py-5" style={{ background: "#2D82B5" }}>
        <div
          className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 overflow-hidden rounded-xl"
          style={{
            background: "rgba(255,255,255,0.12)",
            border: "0.5px solid rgba(255,255,255,0.2)",
          }}
        >
          {/* Department */}
          <div className="relative border-b sm:border-b-0 sm:border-r border-white/15">
            <select
              value={searchDept}
              onChange={(e) => setSearchDept(e.target.value)}
              className="w-full bg-transparent text-sm font-medium px-4 py-4 outline-none appearance-none cursor-pointer"
              style={{ color: searchDept ? "white" : "rgba(255,255,255,0.65)" }}
            >
              <option value="" disabled>Select Department</option>
              {departments.map((d) => (
                <option
                  key={d.id}
                  value={String(d.id)}
                  style={{ background: "#53A7D8", color: "white" }}
                >
                  {d.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              color="rgba(255,255,255,0.55)"
            />
          </div>

          {/* Doctor */}
          <div className="relative border-b sm:border-b-0 sm:border-r border-white/15">
            <select
              value={searchDoctor}
              onChange={(e) => setSearchDoctor(e.target.value)}
              className="w-full bg-transparent text-sm font-medium px-4 py-4 outline-none appearance-none cursor-pointer"
              style={{ color: searchDoctor ? "white" : "rgba(255,255,255,0.65)" }}
            >
              <option value="" disabled style={{ background: "#BCE6FF" }}>Select Doctor</option>
              <option value="any" style={{ background: "#53A7D8", color: "white" }}>Any Doctor</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              color="rgba(255,255,255,0.55)"
            />
          </div>

          {/* Date */}
          <div className="relative border-b sm:border-b-0 sm:border-r border-white/15">
            <select
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="w-full bg-transparent text-sm font-medium px-4 py-4 outline-none appearance-none cursor-pointer"
              style={{ color: searchDate ? "white" : "rgba(255,255,255,0.65)" }}
            >
              <option value="" disabled style={{ background: "#BCE6FF" }}>Select Date</option>
              <option value="today"    style={{ background: "#53A7D8", color: "white" }}>Today</option>
              <option value="tomorrow" style={{ background: "#53A7D8", color: "white" }}>Tomorrow</option>
              <option value="week"     style={{ background: "#53A7D8", color: "white" }}>This Week</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              color="rgba(255,255,255,0.55)"
            />
          </div>

          {/* Location */}
          <div className="relative border-b sm:border-b-0 sm:border-r border-white/15">
            <select
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="w-full bg-transparent text-sm font-medium px-4 py-4 outline-none appearance-none cursor-pointer"
              style={{ color: searchLocation ? "white" : "rgba(255,255,255,0.65)" }}
            >
              <option value="" disabled style={{ background: "#BCE6FF" }}>Select Location</option>
              <option value="colombo" style={{ background: "#53A7D8", color: "white" }}>Colombo</option>
              <option value="kandy"   style={{ background: "#53A7D8", color: "white" }}>Kandy</option>
              <option value="galle"   style={{ background: "#53A7D8", color: "white" }}>Galle</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              color="rgba(255,255,255,0.55)"
            />
          </div>

          {/* Search button */}
          <button
            onClick={handleSearch}
            className="flex items-center justify-center gap-2 px-6 py-4 text-white text-sm font-semibold transition hover:bg-white/25"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <Search size={15} />
            Search
          </button>
        </div>
      </div>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 md:px-10" style={{ background: " #BCE6FF" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold mb-2" style={{ color: "#0f2d3a" }}>
              Everything you need
            </h2>
            <p className="text-sm" style={{ color: "#5a8090" }}>
              Streamlined healthcare at your fingertips
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-7 transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  border: "0.5px solid rgba(42,143,160,0.10)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "linear-gradient(135deg,#e8f4f8,#d4edf5)" }}
                >
                  <Icon size={22} color="#88CDF6" strokeWidth={1.8} />
                </div>
                <h3 className="font-bold text-sm mb-2" style={{ color: "#0f2d3a" }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#5a8090" }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEPARTMENTS ───────────────────────────────────────────────────── */}
      <section
        id="departments"
        className="py-16 px-4 md:px-10 bg-white"
        style={{ borderTop: "0.5px solid rgba(42,143,160,0.08)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-7 flex-wrap gap-4">
            <div>
              <h2
                className="text-xl font-extrabold flex items-center gap-2"
                style={{ color: "#0f2d3a" }}
              >
                <Building2 size={22} color="#2a8fa0" />
                Our departments
              </h2>
              <p className="text-sm mt-1" style={{ color: "#6a8a98" }}>
                Browse specialists across every department
              </p>
            </div>
            <Link
              to="/channeling"
              className="text-sm font-semibold flex items-center gap-1 transition hover:underline"
              style={{ color: "#2a8fa0" }}
            >
              View all doctors <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {departments.length === 0
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-20 rounded-xl animate-pulse"
                    style={{ background: "#BCE6FF" }}
                  />
                ))
              : departments.map((d) => (
                  <Link
                    key={d.id}
                    to={`/channeling?department=${d.id}`}
                    className="block p-5 rounded-xl transition-all duration-150 hover:-translate-y-px"
                    style={{
                      background: "#BCE6FF",
                      border: "0.5px solid rgba(42,143,160,0.12)",
                    }}
                  >
                    <h3 className="font-semibold text-sm" style={{ color: "#0f2d3a" }}>
                      {d.name}
                    </h3>
                    <p
                      className="text-xs mt-1 line-clamp-2"
                      style={{ color: "#6a8a98" }}
                    >
                      {d.description || "Specialist care available"}
                    </p>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section
        className="py-16 px-4 text-center text-white"
        style={{ background: "linear-gradient(135deg,#53A7D8,#88CDF6,#BCE6FF,#2D82B5)" }}
      >
        <h2 className="text-2xl font-extrabold mb-2">
          Ready to channel a doctor?
        </h2>
        <p className="text-sm opacity-80 mb-7">
          Sign in as a patient to book, or browse doctors publicly.
        </p>
        <button
          onClick={() => navigate("/channeling")}
          className="bg-white font-bold text-sm px-8 py-3 rounded-full transition hover:-translate-y-px"
          style={{
            color: "#015C9B",
            boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
          }}
        >
          Start channeling
        </button>
      </section>

      {/* ── Pulse keyframe ────────────────────────────────────────────────── */}
      <style>{`
        @keyframes hpPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.45); }
          50%       { box-shadow: 0 0 0 5px rgba(34,197,94,0); }
        }
      `}</style>
    </div>
  );
}