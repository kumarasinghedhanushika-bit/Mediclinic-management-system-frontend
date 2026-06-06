import API from "../api";
import { unwrap } from "../client";
import type { ApiResponse } from "../../types";

export const fileService = {
  uploadProfile: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return unwrap(
      API.post<ApiResponse<string>>("/files/upload/profile", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    );
  },

  uploadReport: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return unwrap(
      API.post<ApiResponse<string>>("/files/upload/report", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    );
  },

  uploadLabReport: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return unwrap(
      API.post<ApiResponse<string>>("/files/upload/lab-report", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    );
  },

  uploadPrescription: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return unwrap(
      API.post<ApiResponse<string>>("/files/upload/prescription", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    );
  },

  delete: (url: string) =>
    unwrap(API.delete<ApiResponse<void>>("/files", { params: { url } })),
};
