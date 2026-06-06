import API from "../api";
import { unwrap } from "../client";
import type { ApiResponse, Doctor, TimeSlot } from "../../types";

export interface DoctorRequestPayload {
  userId: string;
  specialization: string;
  departmentId: string;
  licenseNumber: string;
  experienceYears?: number;
  availableDays?: string[];
  consultationStartTime?: string;
  consultationEndTime?: string;
  slotDurationMinutes?: number;
  consultationFee?: number;
  active?: boolean;
}

export const doctorService = {
  getAll: () => unwrap(API.get<ApiResponse<Doctor[]>>("/doctors")),

  getActive: () => unwrap(API.get<ApiResponse<Doctor[]>>("/doctors/active")),

  getByDepartment: (departmentId: string) =>
    unwrap(
      API.get<ApiResponse<Doctor[]>>(`/doctors/department/${departmentId}`)
    ),

  getMe: () => unwrap(API.get<ApiResponse<Doctor>>("/doctors/me")),

  getById: (id: string) => unwrap(API.get<ApiResponse<Doctor>>(`/doctors/${id}`)),

  getSlots: (id: string, date: string) =>
    unwrap(
      API.get<ApiResponse<TimeSlot[]>>(`/doctors/${id}/slots`, {
        params: { date },
      })
    ),

  create: (body: DoctorRequestPayload) =>
    unwrap(API.post<ApiResponse<Doctor>>("/doctors", body)),

  update: (id: string, body: DoctorRequestPayload) =>
    unwrap(API.put<ApiResponse<Doctor>>(`/doctors/${id}`, body)),

  delete: (id: string) =>
    unwrap(API.delete<ApiResponse<void>>(`/doctors/${id}`)),
};
