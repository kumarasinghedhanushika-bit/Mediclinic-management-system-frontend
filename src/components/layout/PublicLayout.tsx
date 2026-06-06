import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-slate-900 text-slate-300 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-lg font-semibold text-white mb-2">MediClinic Hospital</p>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Modern hospital management & doctor channeling — book appointments, manage care, and pay securely online.
          </p>
          <p className="text-xs text-slate-500 mt-6">
            &copy; {new Date().getFullYear()} MediClinic. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
