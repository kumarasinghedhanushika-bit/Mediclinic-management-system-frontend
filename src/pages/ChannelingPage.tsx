import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Search, Stethoscope, Calendar, Clock } from "lucide-react";
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
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          <Stethoscope className="text-teal-600" />
          Doctor channeling
        </h1>
        <p className="text-slate-500 mt-1">
          Browse doctors, check availability, and book your visit
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters */}
        <aside className="lg:w-72 space-y-4 flex-shrink-0">
          <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Department
            </label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="mt-2 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              <option value="">All departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm relative">
            <Search
              className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              placeholder="Search doctor or specialty…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        </aside>

        {/* Doctor list */}
        <div className="flex-1 grid md:grid-cols-2 gap-4 content-start">
          {filtered.length === 0 ? (
            <p className="col-span-2 text-center text-slate-400 py-12">
              No doctors found
            </p>
          ) : (
            filtered.map((d) => (
              <div
                key={d.id}
                className={`bg-white rounded-xl border p-5 shadow-sm transition ${
                  selectedDoctor?.id === d.id
                    ? "border-teal-400 ring-2 ring-teal-100"
                    : "border-slate-100 hover:border-teal-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {doctorLabel(d).charAt(3) || "D"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900 truncate">
                      {doctorLabel(d)}
                    </h3>
                    <p className="text-sm text-teal-600">{d.specialization}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {d.departmentName}
                    </p>
                    <p className="text-sm font-medium text-slate-700 mt-2">
                      LKR {d.consultationFee?.toFixed(2) ?? "—"}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                    <Calendar size={12} /> Check availability
                  </label>
                  <input
                    type="date"
                    min={today}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                    onChange={(e) => loadSlots(d, e.target.value)}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Slot panel */}
        {selectedDoctor && date && (
          <aside className="lg:w-80 bg-white rounded-xl border border-slate-100 p-5 shadow-sm h-fit sticky top-24">
            <h3 className="font-semibold text-slate-900">{doctorLabel(selectedDoctor)}</h3>
            <p className="text-sm text-slate-500 mt-1">{date}</p>
            {loadingSlots ? (
              <p className="text-sm text-slate-400 py-6 text-center">Loading slots…</p>
            ) : slots.length === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center">No slots available</p>
            ) : (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {slots.map((s) => (
                  <button
                    key={s.time}
                    disabled={!s.available}
                    onClick={() => setSelectedTime(s.time)}
                    className={`px-2 py-1.5 text-xs rounded-lg border font-medium transition ${
                      selectedTime === s.time
                        ? "bg-teal-600 text-white border-teal-600"
                        : s.available
                          ? "bg-white border-slate-200 hover:border-teal-400"
                          : "bg-slate-50 text-slate-300 cursor-not-allowed"
                    }`}
                  >
                    <Clock size={10} className="inline mr-0.5" />
                    {s.time}
                  </button>
                ))}
              </div>
            )}
            {selectedTime && (
              <button
                onClick={handleBook}
                className="w-full mt-4 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition"
              >
                {isAuthenticated ? "Continue booking" : "Sign in to book"}
              </button>
            )}
            {!isAuthenticated && (
              <p className="text-xs text-slate-400 mt-3 text-center">
                <Link to="/register" className="text-teal-600 hover:underline">
                  Register
                </Link>{" "}
                for a free patient account
              </p>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
