import API from "../api";
import { unwrap } from "../client";
import type {
  ApiResponse,
  Appointment,
  Doctor,
  User,
} from "../../types";
import type { CreateAppointmentPayload } from "./appointmentService";
import type { RegisterPayload } from "./authService";
import type { Patient } from "../../types";

export const receptionService = {
  registerWalkIn: (body: RegisterPayload) =>
    unwrap(
      API.post<ApiResponse<User>>("/reception/walk-in/register", {
        ...body,
        role: "PATIENT",
      })
    ),

  getPatients: () =>
    unwrap(API.get<ApiResponse<Patient[]>>("/reception/patients")),

  getPatient: (id: string) =>
    unwrap(API.get<ApiResponse<Patient>>(`/reception/patients/${id}`)),

  updatePatient: (id: string, body: Patient) =>
    unwrap(API.put<ApiResponse<Patient>>(`/reception/patients/${id}`, body)),

  getDoctors: () =>
    unwrap(API.get<ApiResponse<Doctor[]>>("/reception/doctors")),

  getDoctorSchedule: (doctorId: string) =>
    unwrap(
      API.get<ApiResponse<Appointment[]>>(
        `/reception/doctors/${doctorId}/schedule`
      )
    ),

  createAppointment: (body: CreateAppointmentPayload) =>
    unwrap(
      API.post<ApiResponse<Appointment>>("/reception/appointments", body)
    ),

  getTodayAppointments: () =>
    unwrap(
      API.get<ApiResponse<Appointment[]>>("/reception/appointments/today")
    ),

  getAppointments: () =>
    unwrap(API.get<ApiResponse<Appointment[]>>("/reception/appointments")),
};
