export type Role =
  | "ADMIN"
  | "DOCTOR"
  | "RECEPTIONIST"
  | "PHARMACIST"
  | "PATIENT"
  | "LAB_TECHNICIAN"
  | "NURSE";

export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface ApiResponse<T> {
  message: string;
  error: boolean;
  success: boolean;
  data: T;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  gender?: string;
  avatar?: string;
  role: Role;
  status?: UserStatus;
  emailVerified?: boolean;
  accountLocked?: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  role: Role;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
}

export interface Doctor {
  id: string;
  userId?: string;
  doctorName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  specialization?: string;
  departmentId?: string;
  departmentName?: string;
  licenseNumber?: string;
  experienceYears?: number;
  availableDays?: string[];
  consultationStartTime?: string;
  consultationEndTime?: string;
  slotDurationMinutes?: number;
  consultationFee?: number;
  active?: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  appointmentNumber?: string;
  patientId?: string;
  patientName?: string;
  patientEmail?: string;
  patientPhone?: string;
  doctorId?: string;
  doctorName?: string;
  departmentId?: string;
  departmentName?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  appointmentDateTime?: string;
  reason?: string;
  status: AppointmentStatus;
  notes?: string;
  consultationFee?: number;
  createdAt?: string;
}

export interface Bill {
  id: string;
  orderId?: string;
  patientId?: string;
  appointmentId?: string;
  amount?: number;
  currency?: string;
  description?: string;
  items?: string;
  paymentStatus?: PaymentStatus;
  createdAt?: string;
  paidAt?: string;
}

export interface PharmacyMedicine {
  id: string;
  medicineName: string;
  genericName?: string;
  category?: string;
  manufacturer?: string;
  quantity?: number;
  lowStockThreshold?: number;
  unitPrice?: number;
  expiryDate?: string;
  active?: boolean;
  lowStock?: boolean;
}

export interface MedicalReport {
  id: string;
  patientId?: string;
  doctorId?: string;
  labTechnicianId?: string;
  reportType?: string;
  diagnosis?: string;
  notes?: string;
  reportFileUrl?: string;
  createdDate?: string;
  updatedAt?: string;
}

export interface Patient {
  id: string;
  userId?: string;
  patientNumber?: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  allergies?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  address?: string;
  medicalHistory?: string;
  chronicDiseases?: string[];
}

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

export interface PayHereCheckout {
  sandbox: boolean;
  checkoutUrl: string;
  merchantId: string;
  orderId: string;
  amount: string;
  currency: string;
  hash: string;
  returnUrl: string;
  cancelUrl: string;
  notifyUrl: string;
  items?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  billId?: string;
}
