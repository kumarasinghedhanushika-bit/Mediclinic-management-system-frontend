import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  ClipboardList,
  FlaskConical,
  Pill,
  CreditCard,
  UserPlus,
  Stethoscope,
  FileText,
  Settings,
  User,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "../types";

export interface MenuItem {
  key: string;
  label: string;
  icon: LucideIcon;
}

export const roleMenus: Record<Role, MenuItem[]> = {
  ADMIN: [
    { key: "home", label: "Dashboard", icon: LayoutDashboard },
    { key: "staff", label: "Register Staff", icon: UserPlus },
    { key: "users", label: "Manage Users", icon: Users },
    { key: "doctors", label: "Doctors", icon: Stethoscope },
    { key: "departments", label: "Departments", icon: Building2 },
    { key: "appointments", label: "Appointments", icon: Calendar },
    { key: "bills", label: "Billing", icon: CreditCard },
    { key: "pharmacy", label: "Pharmacy", icon: Pill },
    { key: "reports", label: "Med Reports", icon: FileText },
    { key: "profile", label: "Profile", icon: User },
    { key: "settings", label: "Settings", icon: Settings },
  ],
  DOCTOR: [
    { key: "home", label: "Dashboard", icon: LayoutDashboard },
    { key: "schedule", label: "My Schedule", icon: Calendar },
    { key: "appointments", label: "Appointments", icon: ClipboardList },
    { key: "reports", label: "Med Reports", icon: FileText },
    { key: "profile", label: "Profile", icon: User },
    { key: "settings", label: "Settings", icon: Settings },
  ],
  RECEPTIONIST: [
    { key: "home", label: "Dashboard", icon: LayoutDashboard },
    { key: "walkin", label: "Walk-in", icon: UserPlus },
    { key: "createAppt", label: "Create Appt", icon: Calendar },
    { key: "appointments", label: "Appointments", icon: Calendar },
    { key: "patients", label: "Patients", icon: Users },
    { key: "bills", label: "Billing", icon: CreditCard },
    { key: "profile", label: "Profile", icon: User },
    { key: "settings", label: "Settings", icon: Settings },
  ],
  PATIENT: [
    { key: "home", label: "Dashboard", icon: LayoutDashboard },
    { key: "book", label: "Book Appt", icon: Calendar },
    { key: "appointments", label: "My Appointments", icon: ClipboardList },
    { key: "reports", label: "My Reports", icon: FileText },
    { key: "bills", label: "My Bills", icon: CreditCard },
    { key: "profile", label: "Profile", icon: User },
    { key: "settings", label: "Settings", icon: Settings },
  ],
  NURSE: [
    { key: "home", label: "Dashboard", icon: LayoutDashboard },
    { key: "appointments", label: "Appointments", icon: Calendar },
    { key: "patients", label: "Patients", icon: Users },
    { key: "reports", label: "Reports", icon: FileText },
    { key: "profile", label: "Profile", icon: User },
    { key: "settings", label: "Settings", icon: Settings },
  ],
  PHARMACIST: [
    { key: "home", label: "Dashboard", icon: LayoutDashboard },
    { key: "pharmacy", label: "Medicines", icon: Pill },
    { key: "profile", label: "Profile", icon: User },
    { key: "settings", label: "Settings", icon: Settings },
  ],
  LAB_TECHNICIAN: [
    { key: "home", label: "Dashboard", icon: LayoutDashboard },
    { key: "reports", label: "Lab Reports", icon: FlaskConical },
    { key: "profile", label: "Profile", icon: User },
    { key: "settings", label: "Settings", icon: Settings },
  ],
};

export const roleColors: Record<
  Role,
  { bg: string; text: string; dot: string }
> = {
  ADMIN: { bg: "bg-rose-100", text: "text-rose-700", dot: "bg-rose-500" },
  DOCTOR: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
  RECEPTIONIST: {
    bg: "bg-teal-100",
    text: "text-teal-700",
    dot: "bg-teal-500",
  },
  PATIENT: {
    bg: "bg-violet-100",
    text: "text-violet-700",
    dot: "bg-violet-500",
  },
  NURSE: { bg: "bg-pink-100", text: "text-pink-700", dot: "bg-pink-500" },
  PHARMACIST: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  LAB_TECHNICIAN: {
    bg: "bg-cyan-100",
    text: "text-cyan-700",
    dot: "bg-cyan-500",
  },
};
