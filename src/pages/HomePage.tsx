import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Shield,
  Clock,
  ArrowRight,
  Building2,
  Search,
  ChevronDown,
  HeartPulse,
  BedDouble,
  Siren,
  ScanLine,
  FlaskConical,
  Pill,
  HandHeart,
  Phone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { publicService } from "../api";
import type { Department } from "../types";
import { useAuth } from "../context/AuthContext";

// ── Hero Slides ────────────────────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    image: "/dc2.jpg",
    badge: "Specialist Consultations",
    headline: "Premium Treatments for a",
    highlight: "Healthy",
    subline: "Lifestyle",
    desc: "Book specialist appointments online, track visits, pay securely, and access your medical records — all in one convenient portal.",
    stat: { value: "4.9★", label: "Patient Rating" },
    accent: "#88CDF6",
  },
  {
    image: "/dc.jpg",
    badge: "24/7 Emergency Care",
    headline: "Always Here When",
    highlight: "You Need",
    subline: "Us Most",
    desc: "Our emergency department is staffed around the clock with experienced physicians and cutting-edge equipment.",
    stat: { value: "24/7", label: "Emergency" },
    accent: "#F6D888",
  },
  {
    image: "/medi1.jpg",
    badge: "Advanced Radiology",
    headline: "Clarity Through",
    highlight: "Precise",
    subline: "Imaging",
    desc: "State-of-the-art MRI, CT, and X-ray facilities with rapid results delivered directly to your care team.",
    stat: { value: "500+", label: "Scans/Month" },
    accent: "#A8F6C0",
  },
  {
    image: "/medi2.jpg",
    badge: "Expert Surgical Teams",
    headline: "Trusted Hands for",
    highlight: "Safer",
    subline: "Outcomes",
    desc: "Board-certified surgeons performing minimally invasive procedures with faster recovery times.",
    stat: { value: "98%", label: "Success Rate" },
    accent: "#F6A8C0",
  },
  {
    image: "/chaild.jpg",
    badge: "Paediatric Care",
    headline: "Gentle Care for",
    highlight: "Little",
    subline: "Ones",
    desc: "Dedicated paediatric specialists providing compassionate, child-friendly healthcare from birth through adolescence.",
    stat: { value: "5000+", label: "Children Treated" },
    accent: "#C0A8F6",
  },
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

// ── Services strip ─────────────────────────────────────────────────────────────
const SERVICES = [
  { icon: HeartPulse, label: "Specialist Clinics" },
  { icon: BedDouble, label: "In-Patient Care" },
  { icon: Siren, label: "24/7 Emergency" },
  { icon: ScanLine, label: "Radiology" },
  { icon: FlaskConical, label: "Laboratory" },
  { icon: Pill, label: "Pharmacy" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);

  // Search bar state
  const [searchDept, setSearchDept] = useState("");
  const [searchDoctor, setSearchDoctor] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  // Carousel state
  const [activeSlide, setActiveSlide] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    publicService
      .getDepartments()
      .then((data) => setDepartments(data.slice(0, 6)))
      .catch(() => {});
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      goToSlide((activeSlide + 1) % HERO_SLIDES.length, "next");
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlide, isPaused]);

  const goToSlide = useCallback(
    (index: number, dir: "next" | "prev") => {
      if (animating) return;
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setActiveSlide(index);
        setAnimating(false);
      }, 400);
    },
    [animating]
  );

  const handlePrev = () => {
    const prev = (activeSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;
    goToSlide(prev, "prev");
  };

  const handleNext = () => {
    const next = (activeSlide + 1) % HERO_SLIDES.length;
    goToSlide(next, "next");
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchDept) params.set("department", searchDept);
    if (searchDoctor) params.set("doctor", searchDoctor);
    navigate(`/channeling${params.toString() ? `?${params}` : ""}`);
  };

  const slide = HERO_SLIDES[activeSlide];

  return (
    <div className="font-sans" style={{ background: "#F46AFE" }}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ minHeight: 580 }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background layer — slides behind everything */}
        {HERO_SLIDES.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              opacity: i === activeSlide ? 1 : 0,
              backgroundImage: `linear-gradient(120deg, rgba(6,32,56,0.90) 0%, rgba(1,92,146,0.82) 45%, rgba(83,167,216,0.60) 100%), url('${s.image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 0,
            }}
          />
        ))}

        {/* Nav bar */}
        <nav
          className="relative max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between py-5"
          style={{ zIndex: 20 }}
        >
          <Link to="/" className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" />
          </Link>
        </nav>

        {/* Content grid */}
        <div
          className="relative max-w-7xl mx-auto px-6 md:px-10 pt-6 pb-28 grid md:grid-cols-2 gap-8 items-center"
          style={{ zIndex: 10 }}
        >
          {/* ── LEFT: Text content — animates on slide change ── */}
          <div
            className="z-10"
            style={{
              opacity: animating ? 0 : 1,
              transform: animating
                ? `translateX(${direction === "next" ? "-24px" : "24px"})`
                : "translateX(0)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
          >
            <span
              className="inline-flex items-center gap-2 bg-white/95 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-800 mb-6"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.15)" }}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  background: slide.accent,
                  animation: "hpPulse 2s infinite",
                }}
              />
              {slide.badge}
            </span>

            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
              {slide.headline}
              <br />
              <span style={{ color: slide.accent }}>{slide.highlight}</span>{" "}
              {slide.subline}
            </h1>

            <p className="text-sm text-white/80 leading-relaxed max-w-md mb-8">
              {slide.desc}
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate(isAuthenticated ? "/dashboard" : "/aboutus")}
                className="inline-flex items-center gap-2 px-6 py-3 text-white text-sm font-semibold rounded-full transition hover:-translate-y-px"
                style={{
                  background: "#015C92",
                  boxShadow: "0 4px 16px rgba(1,92,146,0.45)",
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
                    background: "rgba(255,255,255,0.90)",
                    borderColor: "rgba(255,255,255,0.5)",
                    color: "#0f2d3a",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  Create patient account
                </Link>
              )}
            </div>

            {/* ── Slide dots + arrows ── */}
            <div className="flex items-center gap-4 mt-10">
              <button
                onClick={handlePrev}
                className="w-9 h-9 rounded-full flex items-center justify-center border border-white/30 text-white transition hover:bg-white/20"
                aria-label="Previous slide"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-2">
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(i, i > activeSlide ? "next" : "prev")}
                    aria-label={`Go to slide ${i + 1}`}
                    style={{
                      width: i === activeSlide ? 28 : 8,
                      height: 8,
                      borderRadius: 9999,
                      background:
                        i === activeSlide
                          ? slide.accent
                          : "rgba(255,255,255,0.35)",
                      transition: "width 0.35s ease, background 0.35s ease",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="w-9 h-9 rounded-full flex items-center justify-center border border-white/30 text-white transition hover:bg-white/20"
                aria-label="Next slide"
              >
                <ChevronRight size={16} />
              </button>

              <span className="text-xs text-white/50 ml-2 font-mono">
                {String(activeSlide + 1).padStart(2, "0")} /{" "}
                {String(HERO_SLIDES.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* ── RIGHT: Slideshow image cards ── */}
          <div className="relative z-10 hidden md:flex justify-end items-center">
            {/* Progress ring / slide counter badge */}
            <div
              className="relative"
              style={{ width: 340, height: 400 }}
            >
              {/* Main slide image card */}
              <div
                className="absolute inset-0 rounded-3xl overflow-hidden"
                style={{
                  boxShadow: "0 24px 64px rgba(0,0,0,0.40)",
                  border: "2px solid rgba(255,255,255,0.18)",
                }}
              >
                {HERO_SLIDES.map((s, i) => (
                  <img
                    key={i}
                    src={s.image}
                    alt={s.badge}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      opacity: i === activeSlide ? 1 : 0,
                      transform:
                        i === activeSlide
                          ? "scale(1)"
                          : direction === "next"
                          ? "scale(1.06)"
                          : "scale(0.96)",
                      transition: "opacity 0.65s ease, transform 0.65s ease",
                    }}
                  />
                ))}
                {/* Gradient overlay on card */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(6,32,56,0.72) 0%, transparent 55%)",
                  }}
                />
              </div>

              {/* Floating stat chip — bottom left of card */}
              <div
                className="absolute bottom-5 left-5 rounded-2xl px-4 py-3 flex items-center gap-3"
                style={{
                  background: "rgba(255,255,255,0.96)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
                  opacity: animating ? 0 : 1,
                  transform: animating ? "translateY(8px)" : "translateY(0)",
                  transition: "opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s",
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: slide.accent }}
                >
                  <HeartPulse size={16} color="#0f2d3a" />
                </div>
                <div>
                  <p className="text-base font-extrabold leading-none" style={{ color: "#0f2d3a" }}>
                    {slide.stat.value}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{slide.stat.label}</p>
                </div>
              </div>

              {/* Slide thumbnail strip — right edge */}
              <div
                className="absolute -right-16 top-1/2 -translate-y-1/2 flex flex-col gap-2"
              >
                {HERO_SLIDES.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(i, i > activeSlide ? "next" : "prev")}
                    aria-label={`Slide ${i + 1}`}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 10,
                      overflow: "hidden",
                      border: i === activeSlide
                        ? `2.5px solid ${slide.accent}`
                        : "2px solid rgba(255,255,255,0.25)",
                      opacity: i === activeSlide ? 1 : 0.55,
                      transform: i === activeSlide ? "scale(1.12)" : "scale(1)",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      padding: 0,
                      boxShadow: i === activeSlide
                        ? `0 0 0 2px ${slide.accent}40`
                        : "none",
                    }}
                  >
                    <img
                      src={s.image}
                      alt={s.badge}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar at very bottom of hero */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: 3, zIndex: 30, background: "rgba(255,255,255,0.12)" }}
        >
          <div
            style={{
              height: "100%",
              background: slide.accent,
              width: `${((activeSlide + 1) / HERO_SLIDES.length) * 100}%`,
              transition: "width 0.4s ease, background 0.4s ease",
            }}
          />
        </div>
      </section>

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
                <option key={d.id} value={String(d.id)} style={{ background: "#53A7D8", color: "white" }}>
                  {d.name}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" color="rgba(255,255,255,0.55)" />
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
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" color="rgba(255,255,255,0.55)" />
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
              <option value="today" style={{ background: "#53A7D8", color: "white" }}>Today</option>
              <option value="tomorrow" style={{ background: "#53A7D8", color: "white" }}>Tomorrow</option>
              <option value="week" style={{ background: "#53A7D8", color: "white" }}>This Week</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" color="rgba(255,255,255,0.55)" />
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
              <option value="kandy" style={{ background: "#53A7D8", color: "white" }}>Kandy</option>
              <option value="galle" style={{ background: "#53A7D8", color: "white" }}>Galle</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" color="rgba(255,255,255,0.55)" />
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

      {/* ── SERVICES STRIP ────────────────────────────────────────────────── */}
      <section className="py-14 px-4 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-7 flex-wrap gap-4">
            <h2 className="text-xl font-extrabold" style={{ color: "#0f2d3a" }}>
              Our Services
            </h2>
            <Link
              to="/channeling"
              className="text-sm font-semibold flex items-center gap-1 transition hover:underline"
              style={{ color: "#2a8fa0" }}
            >
              View all services <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {SERVICES.map(({ icon: Icon, label }) => (
              <button
                key={label}
                onClick={() => navigate("/channeling")}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl transition hover:-translate-y-0.5 text-center"
                style={{ background: "#F0F8FD", border: "0.5px solid rgba(42,143,160,0.10)" }}
              >
                <span
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#e8f4f8,#d4edf5)" }}
                >
                  <Icon size={20} color="#015C92" strokeWidth={1.8} />
                </span>
                <span className="text-xs font-semibold" style={{ color: "#0f2d3a" }}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 md:px-10" style={{ background: "#BCE6FF" }}>
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
                style={{ border: "0.5px solid rgba(42,143,160,0.10)" }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "linear-gradient(135deg,#e8f4f8,#d4edf5)" }}
                >
                  <Icon size={22} color="#015C92" strokeWidth={1.8} />
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
                    <p className="text-xs mt-1 line-clamp-2" style={{ color: "#6a8a98" }}>
                      {d.description || "Specialist care available"}
                    </p>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section
        className="py-16 px-4 text-center text-white relative overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(120deg, rgba(6,32,56,0.88) 0%, rgba(1,92,146,0.80) 45%, rgba(83,167,216,0.55) 100%), url('/hero-hospital.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10 max-w-2xl mx-auto">
          <span
            className="inline-flex items-center gap-2 bg-white/15 rounded-full px-3 py-1.5 text-xs font-semibold mb-4"
            style={{ backdropFilter: "blur(6px)" }}
          >
            <HandHeart size={14} />
            Need Medical Help?
          </span>
          <h2 className="text-2xl font-extrabold mb-2">
            Ready to channel a doctor?
          </h2>
          <p className="text-sm opacity-85 mb-7">
            Sign in as a patient to book, or browse doctors publicly.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate("/channeling")}
              className="inline-flex items-center gap-2 bg-white font-bold text-sm px-8 py-3 rounded-full transition hover:-translate-y-px"
              style={{ color: "#015C9B", boxShadow: "0 6px 20px rgba(0,0,0,0.18)" }}
            >
              Booking Appointment
            </button>

            <a
              href="tel:+021123456789"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-full border border-white/40 text-white transition hover:bg-white/10"
            >
              <Phone size={15} />
              Call Us Now
            </a>
          </div>
        </div>
      </section>

      {/* ── Keyframes ─────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes hpPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.45); }
          50%       { box-shadow: 0 0 0 5px rgba(255,255,255,0); }
        }
      `}</style>
    </div>
  );
}