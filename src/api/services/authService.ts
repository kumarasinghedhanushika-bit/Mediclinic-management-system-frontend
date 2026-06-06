import API from "../api";
import { unwrap } from "../client";
import type { ApiResponse, LoginResponse, User } from "../../types";

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
  phone?: string;
  gender?: string;
}

export const authService = {
  register: (body: RegisterPayload) =>
    unwrap(API.post<ApiResponse<User>>("/auth/register", body)),

  login: (email: string, password: string) =>
    unwrap(API.post<ApiResponse<LoginResponse>>("/auth/login", { email, password })),

  refresh: (refreshToken: string) =>
    unwrap(
      API.post<ApiResponse<LoginResponse>>("/auth/refresh", { refreshToken })
    ),

  verifyEmail: (token: string) =>
  unwrap(
    API.get(`/auth/verify-email/${token}`)
  ),

  resendVerification: (email: string) =>
    API.post<ApiResponse<string>>("/auth/resend-verification", null, {
      params: { email },
    }),

  forgotPassword: (email: string) =>
    API.post<ApiResponse<string>>("/auth/forgot-password", null, {
      params: { email },
    }),

  verifyOtp: (email: string, otp: string) =>
    API.post<ApiResponse<string>>("/auth/verify-otp", null, {
      params: { email, otp },
    }),

  resetPassword: (email: string, newPassword: string) =>
    API.post<ApiResponse<string>>("/auth/reset-password", {
      email,
      newPassword,
    }),
};
