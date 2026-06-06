import API from "../api";
import { unwrap } from "../client";
import type { ApiResponse, PharmacyMedicine } from "../../types";

export interface PharmacyMedicinePayload {
  medicineName: string;
  genericName?: string;
  category?: string;
  manufacturer?: string;
  quantity: number;
  lowStockThreshold?: number;
  unitPrice: number;
  expiryDate?: string;
  active?: boolean;
}

export const pharmacyService = {
  getAll: () =>
    unwrap(API.get<ApiResponse<PharmacyMedicine[]>>("/pharmacy/medicines")),

  getById: (id: string) =>
    unwrap(
      API.get<ApiResponse<PharmacyMedicine>>(`/pharmacy/medicines/${id}`)
    ),

  search: (q: string) =>
    unwrap(
      API.get<ApiResponse<PharmacyMedicine[]>>("/pharmacy/medicines/search", {
        params: { q },
      })
    ),

  lowStock: () =>
    unwrap(
      API.get<ApiResponse<PharmacyMedicine[]>>("/pharmacy/medicines/low-stock")
    ),

  create: (body: PharmacyMedicinePayload) =>
    unwrap(API.post<ApiResponse<PharmacyMedicine>>("/pharmacy/medicines", body)),

  update: (id: string, body: PharmacyMedicinePayload) =>
    unwrap(
      API.put<ApiResponse<PharmacyMedicine>>(`/pharmacy/medicines/${id}`, body)
    ),

  delete: (id: string) =>
    unwrap(API.delete<ApiResponse<void>>(`/pharmacy/medicines/${id}`)),

  adjustStock: (id: string, change: number) =>
    unwrap(
      API.patch<ApiResponse<PharmacyMedicine>>(
        `/pharmacy/medicines/${id}/stock`,
        null,
        { params: { change } }
      )
    ),
};
