import { Menu, Bell } from "lucide-react";
import { roleColors } from "../../utils/roleConfig";
import type { Role, User } from "../../types";

interface HeaderProps {
  user: User | null;
  onMenuOpen: () => void;
  activeLabel: string;
}

export default function Header({ user, onMenuOpen, activeLabel }: HeaderProps) {
  const role = (user?.role || "PATIENT") as Role;
  const colors = roleColors[role] || roleColors.PATIENT;

  return (
    <div
      className="relative h-14 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10
        bg-white/40 backdrop-blur-2xl backdrop-saturate-150
        border-b border-white/50
        shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_4px_20px_rgba(59,130,246,0.08)]
        overflow-hidden"
    >
      {/* ambient glass sheen */}
      <div className="pointer-events-none absolute -top-10 left-1/3 w-40 h-40 rounded-full bg-gradient-to-br from-sky-300/30 via-blue-200/20 to-transparent blur-2xl" />

      <div className="relative z-10 flex items-center gap-3">
        <button
          onClick={onMenuOpen}
          className="md:hidden p-1.5 rounded-lg bg-white/40 border border-white/50 backdrop-blur-md
            hover:bg-sky-100/60 hover:border-sky-200/60 active:scale-90
            transition-all duration-200"
        >
          <Menu size={20} className="text-gray-600 hover:text-sky-600 transition-colors duration-200" />
        </button>
        <div>
          <h2 className="text-sm font-semibold text-gray-900 animate-[fadeIn_0.4s_ease-out]">
            {activeLabel}
          </h2>
          <p className="text-xs text-gray-500 hidden md:block">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-2">
        <button
          className="relative p-2 rounded-lg bg-white/40 border border-white/50 backdrop-blur-md
            hover:bg-sky-100/60 hover:border-sky-200/60 hover:scale-105 active:scale-95
            transition-all duration-200"
        >
          <Bell size={18} className="text-gray-500 hover:text-sky-600 transition-colors duration-200" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-500 rounded-full animate-pulse
            shadow-[0_0_6px_rgba(14,165,233,0.8)]" />
        </button>

        <div
          className={`w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center font-semibold text-xs ${colors.text} flex-shrink-0
            border border-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_2px_8px_rgba(59,130,246,0.15)]
            hover:scale-110 transition-transform duration-200 cursor-pointer`}
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt=""
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`
          )}
        </div>
      </div>
    </div>
  );
}