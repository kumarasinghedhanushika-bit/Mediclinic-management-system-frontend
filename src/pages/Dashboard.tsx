import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import { roleMenus } from "../utils/roleConfig";
import { useAuth } from "../context/AuthContext";
import type { Role, User } from "../types";

import AdminHome from "./section/admin/AdminHome";
import ManageStaff from "./section/admin/ManageStaff";
import ManageUsers from "./section/admin/ManageUsers";
import ManageDoctors from "./section/admin/ManageDoctors";
import ManageDepartments from "./section/admin/ManageDepartments";
import DoctorHome from "./section/doctor/DoctorHome";
import ReceptionHome from "./section/receptionist/ReceptionHome";
import WalkInRegister from "./section/receptionist/WalkInRegister";
import CreateAppointment from "./section/receptionist/CreateAppointment";
import PatientsList from "./section/receptionist/PatientsList";
import PatientHome from "./section/patient/PatientHome";
import BookAppointment from "./section/patient/BookAppointment";
import NurseHome from "./section/nurse/NurseHome";
import PharmacyHome from "./section/pharmacy/PharmacyHome";
import LabHome from "./section/lab/LabHome";
import Appointments from "./section/shared/Appointments";
import Profile from "./section/shared/Profile";
import Settings from "./section/shared/Settings";
import Bills from "./section/shared/Bills";
import MedicalReports from "./section/shared/MedicalReports";

export default function Dashboard() {
  const { user, logout, refreshUser, loading } = useAuth();
  const [active, setActive] = useState("home");
  const [sidebarOpen, setSidebar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const section = (location.state as { section?: string })?.section;
    if (section) setActive(section);
  }, [location.state]);

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out");
    navigate("/login");
  };

  const onProfileUpdate = async () => {
    await refreshUser();
  };

  const renderSection = () => {
    const role = user?.role as Role | undefined;
    switch (active) {
      case "profile":
        return (
          <Profile
            user={user as User}
            onUpdate={onProfileUpdate}
          />
        );
      case "settings":
        return <Settings />;
      case "appointments":
        return <Appointments role={role} user={user} />;
      case "bills":
        return <Bills role={role} user={user} />;
      case "reports":
        return <MedicalReports role={role} user={user} />;

      case "home":
        if (role === "ADMIN") return <AdminHome user={user} />;
        if (role === "DOCTOR") return <DoctorHome user={user} />;
        if (role === "RECEPTIONIST") return <ReceptionHome user={user} />;
        if (role === "PATIENT")
          return <PatientHome user={user} onNavigate={setActive} />;
        if (role === "NURSE") return <NurseHome user={user} />;
        if (role === "PHARMACIST") return <PharmacyHome user={user} />;
        if (role === "LAB_TECHNICIAN") return <LabHome user={user} />;
        return (
          <div className="text-gray-400 text-sm">Dashboard</div>
        );

      case "staff":
        return <ManageStaff />;
      case "users":
        return <ManageUsers />;
      case "doctors":
        return <ManageDoctors />;
      case "departments":
        return <ManageDepartments />;
      case "walkin":
        return <WalkInRegister />;
      case "createAppt":
        return <CreateAppointment />;
      case "patients":
        return <PatientsList />;
      case "book":
        return <BookAppointment />;
      case "schedule":
        return <Appointments role="DOCTOR" user={user} />;
      case "pharmacy":
        return <PharmacyHome user={user} />;

      default:
        return (
          <div className="text-gray-400 text-sm py-8 text-center">
            Section not found
          </div>
        );
    }
  };

  const activeMenu = user?.role
    ? roleMenus[user.role]?.find((m) => m.key === active)
    : undefined;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebar(false)}
        />
      )}

      <aside className="hidden md:flex flex-col w-64 flex-shrink-0 h-full">
        <Sidebar
          user={user}
          active={active}
          onSelect={setActive}
          onLogout={handleLogout}
          onClose={() => setSidebar(false)}
          isMobile={false}
        />
      </aside>

      {sidebarOpen && (
        <aside className="fixed z-40 w-64 h-full md:hidden">
          <Sidebar
            user={user}
            active={active}
            onSelect={(k: string) => {
              setActive(k);
              setSidebar(false);
            }}
            onLogout={handleLogout}
            onClose={() => setSidebar(false)}
            isMobile
          />
        </aside>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          user={user}
          activeLabel={activeMenu?.label || "Dashboard"}
          onMenuOpen={() => setSidebar(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{renderSection()}</main>
      </div>
    </div>
  );
}
