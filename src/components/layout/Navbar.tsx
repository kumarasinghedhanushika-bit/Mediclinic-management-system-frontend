import { Link, useNavigate } from "react-router-dom";
import { Activity, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const links = [
    { to: "/", label: "Home" },
    { to: "/channeling", label: "Doctor Channeling" },
    { to: "/channeling#departments", label: "Departments" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/25">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">
              Medi<span className="text-teal-600">Clinic</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-slate-500">
                  Hi, {user?.firstName || "User"}
                </span>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-4 py-2 text-sm font-semibold text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 transition"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-semibold text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-teal-600 transition"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 shadow-md shadow-teal-600/25 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-2">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block px-2 py-2 text-sm font-medium text-slate-700"
              >
                {l.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/dashboard");
                  }}
                  className="block w-full text-left px-2 py-2 text-sm font-medium text-teal-700"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-2 py-2 text-sm font-medium text-red-600"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="block px-2 py-2 text-sm font-medium"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="block px-2 py-2 text-sm font-medium text-teal-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
