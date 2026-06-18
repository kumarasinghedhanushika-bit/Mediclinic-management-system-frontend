import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Search, Stethoscope, Calendar, Clock, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { publicService } from "../api";
import type { Department, Doctor, TimeSlot } from "../types";
import { useAuth } from "../context/AuthContext";

export default function ChannelingPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [search, setSearch] = useState("");
  const [departmentId, setDepartmentId] = useState(params.get("department") || "");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [date, setDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    publicService.getDepartments().then(setDepartments);
  }, []);

  useEffect(() => {
    publicService.getDoctors(departmentId || undefined).then(setDoctors);
  }, [departmentId]);

  const loadSlots = async (doc: Doctor, d: string) => {
    setSelectedDoctor(doc);
    setDate(d);
    setSelectedTime("");
    if (!d) return;
    setLoadingSlots(true);
    try {
      setSlots(await publicService.getDoctorSlots(doc.id, d));
    } catch {
      setSlots([]);
      toast.error("Could not load slots");
    } finally {
      setLoadingSlots(false);
    }
  };

  const doctorLabel = (d: Doctor) =>
    d.doctorName || `Dr. ${d.firstName || ""} ${d.lastName || ""}`.trim();

  const filtered = doctors.filter((d) => {
    const name = doctorLabel(d).toLowerCase();
    const spec = (d.specialization || "").toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || spec.includes(q);
  });

  const handleBook = () => {
    if (!isAuthenticated) {
      toast("Please sign in to book an appointment", { icon: "🔐" });
      navigate("/login", { state: { from: "/dashboard" } });
      return;
    }
    navigate("/dashboard", { state: { section: "book" } });
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <style>{`
        .chan-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #020b18 0%, #041225 40%, #061a35 70%, #0a2347 100%);
          position: relative;
          overflow: hidden;
        }
        .chan-page::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 40% at 20% 30%, rgba(0,120,255,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 50% 35% at 80% 70%, rgba(0,200,180,0.12) 0%, transparent 55%),
            radial-gradient(ellipse 40% 30% at 60% 10%, rgba(30,80,200,0.15) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }
        .chan-content {
          position: relative;
          z-index: 1;
          max-width: 1280px;
          margin: 0 auto;
          padding: 2.5rem 1.5rem 4rem;
        }

        /* Grid dots overlay */
        .chan-page::after {
          content: '';
          position: fixed;
          inset: 0;
          background-image: radial-gradient(circle, rgba(0,150,255,0.08) 1px, transparent 1px);
          background-size: 36px 36px;
          pointer-events: none;
          z-index: 0;
        }

        /* Header */
        .chan-header {
          margin-bottom: 2.5rem;
        }
        .chan-header-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(0,140,255,0.15);
          border: 1px solid rgba(0,180,255,0.3);
          border-radius: 999px;
          padding: 4px 14px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #5ecfff;
          margin-bottom: 0.75rem;
        }
        .chan-title {
          font-size: 2.25rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.02em;
          line-height: 1.15;
          text-shadow: 0 0 40px rgba(0,160,255,0.4);
        }
        .chan-title span {
          background: linear-gradient(90deg, #00d4ff, #0088ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .chan-subtitle {
          color: rgba(160,200,240,0.7);
          margin-top: 0.4rem;
          font-size: 0.95rem;
        }

        /* Glass card base */
        .glass-card {
          background: rgba(5,25,60,0.55);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(0,150,255,0.2);
          border-radius: 16px;
          box-shadow:
            0 4px 24px rgba(0,0,0,0.4),
            inset 0 1px 0 rgba(255,255,255,0.06);
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        
              <div className="doctor-image-overlay">
              <h2>Your Health</h2>
              <p>Professional Medical Care & Online Channeling</p>
              </div>
            </div>
          </div>

        /* Filters sidebar */
        .chan-filters {
          width: 280px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .filter-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #5ecfff;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .filter-label::before {
          content: '';
          display: inline-block;
          width: 3px;
          height: 10px;
          background: linear-gradient(180deg, #00d4ff, #0055ff);
          border-radius: 2px;
        }
        .chan-select {
          width: 100%;
          padding: 10px 36px 10px 12px;
          background: rgba(0,30,80,0.6);
          border: 1px solid rgba(0,150,255,0.25);
          border-radius: 10px;
          color: #cce4ff;
          font-size: 14px;
          appearance: none;
          -webkit-appearance: none;
          cursor: pointer;
          outline: none;
          transition: border-color 0.2s;
        }
        .chan-select:focus {
          border-color: rgba(0,200,255,0.6);
          box-shadow: 0 0 0 3px rgba(0,150,255,0.15);
        }
        .select-wrap {
          position: relative;
        }
        .select-wrap .select-icon {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #5ecfff;
          pointer-events: none;
        }
        .chan-search-input {
          width: 100%;
          padding: 10px 12px 10px 38px;
          background: rgba(0,30,80,0.6);
          border: 1px solid rgba(0,150,255,0.25);
          border-radius: 10px;
          color: #cce4ff;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .chan-search-input::placeholder { color: rgba(140,180,230,0.4); }
        .chan-search-input:focus {
          border-color: rgba(0,200,255,0.6);
          box-shadow: 0 0 0 3px rgba(0,150,255,0.15);
        }
        .search-wrap {
          position: relative;
        }
        .search-icon {
          position: absolute;
          left: 11px;
          top: 50%;
          transform: translateY(-50%);
          color: #5ecfff;
          pointer-events: none;
        }

        /* Doctor cards */
        .doctor-grid {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
          align-content: start;
        }
        .doctor-card {
          padding: 20px;
          cursor: default;
          position: relative;
          overflow: hidden;
        }
        .doctor-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,200,255,0.5), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .doctor-card:hover::before,
        .doctor-card.selected::before {
          opacity: 1;
        }
        .doctor-card.selected {
          border-color: rgba(0,200,255,0.5);
          box-shadow:
            0 4px 32px rgba(0,150,255,0.25),
            inset 0 1px 0 rgba(255,255,255,0.08),
            0 0 0 1px rgba(0,200,255,0.15);
        }
        .doctor-card:hover:not(.selected) {
          border-color: rgba(0,150,255,0.4);
        }
        .doc-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(0,100,200,0.5), rgba(0,200,255,0.3));
          border: 2px solid rgba(0,200,255,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          color: #00d4ff;
          flex-shrink: 0;
          box-shadow: 0 0 16px rgba(0,180,255,0.3);
          text-shadow: 0 0 8px rgba(0,220,255,0.6);
        }
        .doc-name {
          font-weight: 600;
          font-size: 15px;
          color: #e8f4ff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .doc-spec {
          font-size: 13px;
          color: #00c8ff;
          margin-top: 2px;
        }
        .doc-dept {
          font-size: 11px;
          color: rgba(140,180,230,0.55);
          margin-top: 2px;
        }
        .doc-fee {
          font-size: 14px;
          font-weight: 600;
          color: #5ecfff;
          margin-top: 10px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .doc-fee-label {
          font-size: 11px;
          color: rgba(120,170,220,0.5);
          font-weight: 400;
        }

        /* Date input area */
        .availability-label {
          font-size: 11px;
          color: rgba(140,180,230,0.6);
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 14px;
          margin-bottom: 6px;
        }
        .chan-date-input {
          width: 100%;
          padding: 9px 12px;
          background: rgba(0,20,60,0.7);
          border: 1px solid rgba(0,150,255,0.2);
          border-radius: 8px;
          color: #b0d4f5;
          font-size: 13px;
          outline: none;
          cursor: pointer;
          transition: border-color 0.2s;
          box-sizing: border-box;
          color-scheme: dark;
        }
        .chan-date-input:focus {
          border-color: rgba(0,200,255,0.5);
        }

        

        /* Slot panel */
        .slot-panel {
          width: 300px;
          flex-shrink: 0;
          padding: 20px;
          position: sticky;
          top: 24px;
          height: fit-content;
        }
        .slot-panel-header {
          margin-bottom: 16px;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(0,150,255,0.15);
        }
        .slot-panel-name {
          font-size: 15px;
          font-weight: 600;
          color: #e8f4ff;
        }
        .slot-panel-date {
          font-size: 12px;
          color: #5ecfff;
          margin-top: 4px;
        }
        .slot-section-title {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(100,160,220,0.6);
          margin-bottom: 10px;
        }
        .slots-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        .slot-btn {
          padding: 8px 4px;
          font-size: 11px;
          font-weight: 500;
          border-radius: 8px;
          border: 1px solid rgba(0,150,255,0.25);
          background: rgba(0,30,80,0.5);
          color: #90c0e8;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3px;
          transition: all 0.15s;
        }
        .slot-btn:hover:not(:disabled) {
          border-color: rgba(0,200,255,0.5);
          background: rgba(0,60,140,0.5);
          color: #00d4ff;
        }
        .slot-btn.active {
          background: linear-gradient(135deg, #0066cc, #00a8e8);
          border-color: #00c8ff;
          color: #fff;
          box-shadow: 0 0 12px rgba(0,180,255,0.4);
        }
        .slot-btn:disabled {
          background: rgba(0,20,50,0.3);
          border-color: rgba(0,80,150,0.1);
          color: rgba(80,120,170,0.35);
          cursor: not-allowed;
        }
        .book-btn {
          width: 100%;
          margin-top: 16px;
          padding: 12px;
          background: linear-gradient(135deg, #0055cc 0%, #0099dd 100%);
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          letter-spacing: 0.02em;
          transition: opacity 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(0,100,220,0.4);
          position: relative;
          overflow: hidden;
        }
        .book-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%);
          pointer-events: none;
        }
        .book-btn:hover {
          opacity: 0.92;
          box-shadow: 0 6px 28px rgba(0,120,255,0.55);
        }
        .register-hint {
          text-align: center;
          margin-top: 12px;
          font-size: 12px;
          color: rgba(120,170,220,0.5);
        }
        .register-hint a {
          color: #00c8ff;
          text-decoration: none;
        }
        .register-hint a:hover { text-decoration: underline; }

        /* Glow orbs decorative */
        .orb {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
          filter: blur(80px);
          opacity: 0.25;
        }
        .orb-1 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, #0066ff, transparent 70%);
          top: -100px; left: -100px;
        }
        .orb-2 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, #00c8aa, transparent 70%);
          bottom: 5%; right: 5%;
        }
        .orb-3 {
          width: 250px; height: 250px;
          background: radial-gradient(circle, #0044cc, transparent 70%);
          top: 40%; left: 50%;
        }

        /* Empty state */
        .empty-state {
          grid-column: 1/-1;
          text-align: center;
          padding: 60px 20px;
          color: rgba(120,170,220,0.4);
          font-size: 15px;
        }

        /* Loading text */
        .loading-text {
          text-align: center;
          padding: 32px;
          color: rgba(140,190,240,0.5);
          font-size: 14px;
        }

        
        /* Divider line decoration in slot panel */
        .slot-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,180,255,0.3), transparent);
          margin: 14px 0;
        }

        @media (max-width: 1024px) {
          .chan-layout { flex-direction: column; }
          .chan-filters { width: 100%; }
          .slot-panel { width: 100%; position: static; }
        }
      `}</style>

      <div className="chan-page">
        {/* Decorative orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div className="chan-content">
          {/* Header */}
          <div className="chan-header">
            <div className="chan-header-badge">
              <Stethoscope size={12} />
              Medical Services
            </div>
            <h1 className="chan-title">
              Doctor <span>Channeling</span>
            </h1>
            <p className="chan-subtitle">
              Browse specialists, check availability and book your visit
            </p>
          </div>

          {/* Main layout */}
          <div className="chan-layout" style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
          
                 {/* LEFT IMAGE */}
                <div className="doctor-image-panel">
                  <img
                    src="/mendoctor.png"
                    alt="Doctor"
                    className="doctor-side-image"
                  />
                </div>


            {/* Filters */}
            <aside className="chan-filters">
              <div className="glass-card" style={{ padding: "18px" }}>
                <div className="filter-label">Department</div>
                <div className="select-wrap">
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="chan-select"
                  >
                    <option value="">All departments</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="select-icon" />
                </div>
              </div>

              <div className="glass-card" style={{ padding: "18px" }}>
                <div className="filter-label">Search</div>
                <div className="search-wrap">
                  <Search size={14} className="search-icon" />
                  <input
                    placeholder="Doctor or specialty…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="chan-search-input"
                  />
                </div>
              </div>

              {/* Stats decoration */}
              <div className="glass-card" style={{ padding: "16px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <div style={{ fontSize: "22px", fontWeight: 700, color: "#00d4ff", textShadow: "0 0 12px rgba(0,200,255,0.5)" }}>
                      {doctors.length}
                    </div>
                    <div style={{ fontSize: "10px", color: "rgba(140,180,230,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>Doctors</div>
                  </div>
                  <div style={{ width: 1, height: 36, background: "rgba(0,150,255,0.2)" }} />
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <div style={{ fontSize: "22px", fontWeight: 700, color: "#5ecfff", textShadow: "0 0 12px rgba(0,180,255,0.4)" }}>
                      {departments.length}
                    </div>
                    <div style={{ fontSize: "10px", color: "rgba(140,180,230,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>Depts</div>
                  </div>
                  <div style={{ width: 1, height: 36, background: "rgba(0,150,255,0.2)" }} />
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <div style={{ fontSize: "22px", fontWeight: 700, color: "#80e8c8", textShadow: "0 0 12px rgba(0,220,180,0.4)" }}>
                      {filtered.length}
                    </div>
                    <div style={{ fontSize: "10px", color: "rgba(140,180,230,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>Results</div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Doctor cards */}
            <div className="doctor-grid">
              {filtered.length === 0 ? (
                <div className="empty-state">No doctors found</div>
              ) : (
                filtered.map((d) => (
                  <div
                    key={d.id}
                    className={`glass-card doctor-card ${selectedDoctor?.id === d.id ? "selected" : ""}`}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                      <div className="doc-avatar">
                        {doctorLabel(d).charAt(3) || "D"}
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div className="doc-name">{doctorLabel(d)}</div>
                        <div className="doc-spec">{d.specialization}</div>
                        <div className="doc-dept">{d.departmentName}</div>
                        <div className="doc-fee">
                          LKR {d.consultationFee?.toFixed(2) ?? "—"}
                          <span className="doc-fee-label">/ visit</span>
                        </div>
                      </div>
                    </div>

                    <div className="availability-label">
                      <Calendar size={11} />
                      Check availability
                    </div>
                    <input
                      type="date"
                      min={today}
                      className="chan-date-input"
                      onChange={(e) => loadSlots(d, e.target.value)}
                    />
                  </div>
                ))
              )}
            </div>

            {/* Slot panel */}
            {selectedDoctor && date && (
              <aside className="glass-card slot-panel">
                <div className="slot-panel-header">
                  <div className="slot-panel-name">{doctorLabel(selectedDoctor)}</div>
                  <div className="slot-panel-date">{date}</div>
                </div>

                {loadingSlots ? (
                  <div className="loading-text">Loading slots…</div>
                ) : slots.length === 0 ? (
                  <div className="loading-text">No slots available</div>
                ) : (
                  <>
                    <div className="slot-section-title">
                      <Clock size={10} style={{ display: "inline", marginRight: 4 }} />
                      Available times
                    </div>
                    <div className="slots-grid">
                      {slots.map((s) => (
                        <button
                          key={s.time}
                          disabled={!s.available}
                          onClick={() => setSelectedTime(s.time)}
                          className={`slot-btn ${selectedTime === s.time ? "active" : ""}`}
                        >
                          {s.time}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {selectedTime && (
                  <>
                    <div className="slot-divider" />
                    <div style={{ background: "rgba(0,40,100,0.4)", borderRadius: 8, padding: "10px 12px", border: "1px solid rgba(0,150,255,0.2)", marginTop: 2 }}>
                      <div style={{ fontSize: 11, color: "rgba(140,180,230,0.5)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>Selected</div>
                      <div style={{ fontSize: 14, color: "#00d4ff", fontWeight: 600 }}>{selectedTime}</div>
                    </div>
                    <button onClick={handleBook} className="book-btn">
                      {isAuthenticated ? "Continue booking →" : "Sign in to book →"}
                    </button>
                  </>
                )}

                {!isAuthenticated && (
                  <p className="register-hint">
                    <Link to="/register">Register</Link> for a free patient account
                  </p>
                )}
              </aside>
            )}
          </div>
        </div>
      </div>
    </>
  );
}