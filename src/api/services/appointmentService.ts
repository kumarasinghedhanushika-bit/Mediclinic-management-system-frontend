import API from "../api";
import { unwrap } from "../client";
import type { ApiResponse, Appointment, AppointmentStatus } from "../../types";

export interface BookAppointmentPayload {
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  notes?: string;
}

export interface CreateAppointmentPayload {
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  notes?: string;
}

export interface ReschedulePayload {
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
}

export const appointmentService = {
  book: (body: BookAppointmentPayload) =>
    unwrap(API.post<ApiResponse<Appointment>>("/appointments/book", body)),

  my: () => unwrap(API.get<ApiResponse<Appointment[]>>("/appointments/my")),

  getAll: () => unwrap(API.get<ApiResponse<Appointment[]>>("/appointments")),

  getById: (id: string) =>
    unwrap(API.get<ApiResponse<Appointment>>(`/appointments/${id}`)),

  byPatient: (patientId: string) =>
    unwrap(
      API.get<ApiResponse<Appointment[]>>(
        `/appointments/patient/${patientId}`
      )
    ),

  byDoctor: (doctorId: string) =>
    unwrap(
      API.get<ApiResponse<Appointment[]>>(
        `/appointments/doctor/${doctorId}`
      )
    ),

  doctorSchedule: () =>
    unwrap(
      API.get<ApiResponse<Appointment[]>>("/appointments/doctor/schedule")
    ),

  create: (body: CreateAppointmentPayload) =>
    unwrap(API.post<ApiResponse<Appointment>>("/appointments", body)),

  update: (id: string, body: CreateAppointmentPayload) =>
    unwrap(API.put<ApiResponse<Appointment>>(`/appointments/${id}`, body)),

  cancel: (id: string) =>
    unwrap(API.put<ApiResponse<Appointment>>(`/appointments/${id}/cancel`)),

  reschedule: (id: string, body: ReschedulePayload) =>
    unwrap(
      API.put<ApiResponse<Appointment>>(`/appointments/${id}/reschedule`, body)
    ),

    getByNumber: (appointmentNumber: string) =>
  unwrap(
    API.get<ApiResponse<Appointment>>(
      `/appointments/number/${appointmentNumber}`
    )
  ),

  confirm: (id: string) =>
    unwrap(API.put<ApiResponse<Appointment>>(`/appointments/${id}/confirm`)),

  updateStatus: (id: string, status: AppointmentStatus, notes?: string) =>
    unwrap(
      API.patch<ApiResponse<Appointment>>(`/appointments/${id}/status`, {
        status,
        notes,
      })
    ),
};
