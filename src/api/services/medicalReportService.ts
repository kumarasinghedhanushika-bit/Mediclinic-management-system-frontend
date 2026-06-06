import API from "../api";
import { unwrap } from "../client";
import type { ApiResponse, MedicalReport } from "../../types";

export interface MedicalReportPayload {
  patientId: string;
  reportType: string;
  diagnosis?: string;
  notes?: string;
}

export const medicalReportService = {
  getAll: () =>
    unwrap(API.get<ApiResponse<MedicalReport[]>>("/medical-reports")),

  getById: (id: string) =>
    unwrap(API.get<ApiResponse<MedicalReport>>(`/medical-reports/${id}`)),

  byPatient: (patientId: string) =>
    unwrap(
      API.get<ApiResponse<MedicalReport[]>>(
        `/medical-reports/patient/${patientId}`
      )
    ),

  create: (report: MedicalReportPayload, file?: File) => {
    const fd = new FormData();
    fd.append("report", JSON.stringify(report));
    if (file) fd.append("file", file);
    return unwrap(
      API.post<ApiResponse<MedicalReport>>("/medical-reports", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    );
  },

  createJson: (body: MedicalReportPayload) =>
    unwrap(
      API.post<ApiResponse<MedicalReport>>("/medical-reports/json", body)
    ),

  update: (id: string, report: MedicalReportPayload, file?: File) => {
    const fd = new FormData();
    fd.append("report", JSON.stringify(report));
    if (file) fd.append("file", file);
    return unwrap(
      API.put<ApiResponse<MedicalReport>>(`/medical-reports/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    );
  },

  download: (id: string) =>
    API.get(`/medical-reports/${id}/download`, { responseType: "blob" }),

  delete: (id: string) =>
    unwrap(API.delete<ApiResponse<void>>(`/medical-reports/${id}`)),
};
