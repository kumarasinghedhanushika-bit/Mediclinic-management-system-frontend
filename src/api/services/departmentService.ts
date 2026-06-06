import API from "../api";
import { unwrap } from "../client";
import type { ApiResponse, Department } from "../../types";

export const departmentService = {
  getAll: () => unwrap(API.get<ApiResponse<Department[]>>("/departments")),

  getById: (id: string) =>
    unwrap(API.get<ApiResponse<Department>>(`/departments/${id}`)),

  create: (body: { name: string; description?: string }) =>
    unwrap(API.post<ApiResponse<Department>>("/departments", body)),

  update: (id: string, body: { name: string; description?: string }) =>
    unwrap(API.put<ApiResponse<Department>>(`/departments/${id}`, body)),

  delete: (id: string) =>
    unwrap(API.delete<ApiResponse<void>>(`/departments/${id}`)),
};
