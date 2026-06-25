import { LogOut, X, ChevronRight } from "lucide-react";
import { roleMenus, roleColors } from "../../utils/roleConfig";
import type { Role, User } from "../../types";
import { Link } from "react-router-dom";

interface SidebarProps {
  user: User | null;
  active: string;
  onSelect: (key: string) => void;
  onLogout: () => void;
  onClose: () => void;
  isMobile: boolean;
}

export default function Sidebar({
  user,
  active,
  onSelect,
  onLogout,
  onClose,
  isMobile,
}: SidebarProps) {
  const role = (user?.role || "PATIENT") as Role;
  const menu = roleMenus[role] || roleMenus.PATIENT;
  const colors = roleColors[role] || roleColors.PATIENT;

  return (
    <div
      className="relative flex flex-col h-full overflow-hidden
        bg-white/30 backdrop-blur-2xl backdrop-saturate-150
        border-r border-white/40
        shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_8px_32px_rgba(31,38,135,0.15)]"
    >
      {/* Ambient gradient blobs for the glass sheen */}
      <div className="pointer-events-none absolute -top-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-br from-purple-300/40 via-fuchsia-200/30 to-transparent blur-2xl" />
      <div className="pointer-events-none absolute bottom-0 -right-20 w-56 h-56 rounded-full bg-gradient-to-tr from-teal-200/40 via-cyan-200/30 to-transparent blur-2xl" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-5 py-4 border-b border-white/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center
            bg-gradient-to-br from-teal-500/90 to-cyan-500/90
            shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_2px_8px_rgba(13,148,136,0.4)]
            border border-white/30">
            <span className="text-white font-bold text-sm">MC</span>
          </div>
          <div>
            <Link to="/" className="group inline-block cursor-pointer">
              <p className="text-sm font-bold text-gray-900 leading-none transition-all duration-300 group-hover:text-cyan-700 group-hover:scale-105">
                MediClinic
              </p>
            </Link>
            <p className="text-[10px] text-gray-500">Healthcare Portal</p>
          </div>
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/40 border border-white/50 backdrop-blur-md hover:bg-white/60 transition-colors"
          >
            <X size={18} className="text-gray-600" />
          </button>
        )}
      </div>

      {/* User card */}
      {user && (
        <div
          className="relative z-10 mx-3 mt-4 p-3 rounded-xl
            bg-white/40 backdrop-blur-md border border-white/50
            shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_4px_16px_rgba(31,38,135,0.08)]"
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-full ${colors.bg} flex items-center justify-center font-bold text-sm ${colors.text} flex-shrink-0
                border border-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]`}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${colors.bg} ${colors.text} border border-white/40`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                {role}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="relative z-10 flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menu.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group border
                ${
                  isActive
                    ? "bg-gradient-to-r from-teal-500/90 to-cyan-500/80 text-white border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_4px_14px_rgba(13,148,136,0.35)]"
                    : "text-gray-600 border-transparent hover:bg-white/40 hover:backdrop-blur-md hover:border-white/40 hover:text-gray-900"
                }`}
            >
              <Icon
                size={17}
                className={
                  isActive
                    ? "text-white"
                    : "text-gray-400 group-hover:text-gray-600"
                }
              />
              <span className="flex-1 text-left">{label}</span>
              {isActive && <ChevronRight size={14} className="text-white/70" />}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="relative z-10 px-3 pb-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
            text-red-500 bg-white/30 border border-white/40 backdrop-blur-md
            hover:bg-red-50/60 hover:border-red-200/60 transition-colors"
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </div>
  );
}