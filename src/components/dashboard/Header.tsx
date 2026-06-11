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
    <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuOpen}
          className="md:hidden p-1.5 rounded-lg hover:bg-gray-100"
        >
          
          <Menu size={20} className="text-gray-600" />
        </button>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{activeLabel}</h2>
          <p className="text-xs text-gray-400 hidden md:block">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg hover:bg-gray-100">
          <Bell size={18} className="text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div
          className={`w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center font-semibold text-xs ${colors.text} flex-shrink-0`}
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
