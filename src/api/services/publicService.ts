import API from "../api";
import { unwrap } from "../client";
import type { ApiResponse, Department, Doctor, TimeSlot } from "../../types";

export const publicService = {
  getDepartments: () =>
    unwrap(API.get<ApiResponse<Department[]>>("/public/departments")),

  getDoctors: (departmentId?: string) =>
    unwrap(
      API.get<ApiResponse<Doctor[]>>("/public/doctors", {
        params: departmentId ? { departmentId } : undefined,
      })
    ),

  getDoctor: (id: string) =>
    unwrap(API.get<ApiResponse<Doctor>>(`/public/doctors/${id}`)),

  getDoctorSlots: (id: string, date: string) =>
    unwrap(
      API.get<ApiResponse<TimeSlot[]>>(`/public/doctors/${id}/slots`, {
        params: { date },
      })
    ),
};
