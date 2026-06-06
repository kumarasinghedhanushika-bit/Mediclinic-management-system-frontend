import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Stethoscope,
  Shield,
  Clock,
  ArrowRight,
  Building2,
} from "lucide-react";
import { publicService } from "../api";
import type { Department } from "../types";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    publicService.getDepartments()
      .then((data) => setDepartments(data.slice(0, 6)))
      .catch(() => {});
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,#14b8a6,transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 relative">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-6 border border-teal-500/30">
              <Stethoscope size={14} /> Doctor Channeling System
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              Your health, managed with care & clarity
            </h1>
            <p className="mt-5 text-lg text-slate-300 leading-relaxed">
              Book specialist appointments online, track visits, pay securely, and access medical records in one portal.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() =>
                  navigate(isAuthenticated ? "/dashboard" : "/channeling")
                }
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/30 transition"
              >
                Book a Doctor <ArrowRight size={18} />
              </button>
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/20 font-semibold rounded-xl transition"
                >
                  Create patient account
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">
          Everything you need
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Calendar,
              title: "Online booking",
              desc: "Choose department, doctor, date & time slot in seconds.",
            },
            {
              icon: Shield,
              title: "Secure payments",
              desc: "Pay consultation fees via PayHere with encrypted checkout.",
            },
            {
              icon: Clock,
              title: "Real-time schedule",
              desc: "Staff and doctors see live appointment status updates.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                <Icon size={24} />
              </div>
              <h3 className="font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="departments" className="bg-white border-y border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="text-teal-600" size={28} />
                Our departments
              </h2>
              <p className="text-slate-500 mt-1 text-sm">
                Browse specialists across every department
              </p>
            </div>
            <Link
              to="/channeling"
              className="text-sm font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              View all doctors <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.length === 0
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-24 rounded-xl bg-slate-100 animate-pulse"
                  />
                ))
              : departments.map((d) => (
                  <Link
                    key={d.id}
                    to={`/channeling?department=${d.id}`}
                    className="p-5 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/50 transition group"
                  >
                    <h3 className="font-semibold text-slate-900 group-hover:text-teal-700">
                      {d.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                      {d.description || "Specialist care available"}
                    </p>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Ready to channel a doctor?</h2>
        <p className="text-slate-500 mt-2 mb-6">
          Sign in as a patient to book, or browse doctors publicly.
        </p>
        <button
          onClick={() => navigate("/channeling")}
          className="px-8 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition"
        >
          Start channeling
        </button>
      </section>
    </div>
  );
}
