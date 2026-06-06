import API from "../api";
import { unwrap } from "../client";
import type { ApiResponse, Patient } from "../../types";

export const patientService = {
  getAll: () => unwrap(API.get<ApiResponse<Patient[]>>("/patients")),

  /** Resolve MongoDB patient document id from auth user id */
  findIdByUserId: async (userId: string): Promise<string | null> => {
    const patients = await patientService.getAll();
    return patients.find((p) => p.userId === userId)?.id ?? null;
  },

  getById: (id: string) =>
    unwrap(API.get<ApiResponse<Patient>>(`/patients/${id}`)),

  create: (body: Patient) =>
    unwrap(API.post<ApiResponse<Patient>>("/patients", body)),

  update: (id: string, body: Patient) =>
    unwrap(API.put<ApiResponse<Patient>>(`/patients/${id}`, body)),

  delete: (id: string) =>
    unwrap(API.delete<ApiResponse<void>>(`/patients/${id}`)),
};
