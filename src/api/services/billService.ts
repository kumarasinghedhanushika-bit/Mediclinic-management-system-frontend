import API from "../api";
import { unwrap } from "../client";
import type { ApiResponse, Bill } from "../../types";

export const billService = {
  getAll: () => unwrap(API.get<ApiResponse<Bill[]>>("/bills")),

  getById: (id: string) => unwrap(API.get<ApiResponse<Bill>>(`/bills/${id}`)),

  byPatient: (patientId: string) =>
    unwrap(API.get<ApiResponse<Bill[]>>(`/bills/patient/${patientId}`)),

  byAppointment: (appointmentId: string) =>
    unwrap(
      API.get<ApiResponse<Bill[]>>(`/bills/appointment/${appointmentId}`)
    ),

  create: (body: Bill) =>
    unwrap(API.post<ApiResponse<Bill>>("/bills", body)),
  
};
