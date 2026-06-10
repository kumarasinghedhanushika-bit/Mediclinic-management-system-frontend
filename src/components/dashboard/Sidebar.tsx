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
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">MC</span>
          </div>
          <div>
            <Link to="/" className="text-sm font-bold text-gray-900">
              <p className="text-sm font-bold text-gray-900 leading-none">
                MediClinic
              </p>
            </Link>
            <p className="text-[10px] text-gray-400">Healthcare Portal</p>
          </div>
        </div>
        {isMobile && (
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X size={18} className="text-gray-500" />
          </button>
        )}
      </div>

      {user && (
        <div className="mx-3 mt-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-full ${colors.bg} flex items-center justify-center font-bold text-sm ${colors.text} flex-shrink-0`}
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
                className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${colors.bg} ${colors.text}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                {role}
              </span>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {menu.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
                ${
                  isActive
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
              {isActive && <ChevronRight size={14} className="text-white/60" />}
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
