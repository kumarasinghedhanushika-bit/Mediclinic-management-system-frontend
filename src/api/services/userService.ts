import API from "../api";
import { unwrap } from "../client";
import type { ApiResponse, Role, User, UserStatus } from "../../types";

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ProfileUpdatePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: string;
}

export const userService = {
  me: () => unwrap(API.get<ApiResponse<User>>("/user/me")),

updateProfile: (data: ProfileUpdatePayload, avatarFile?: File) => {
    const fd = new FormData();

    fd.append("user", JSON.stringify(data));

    if (avatarFile) {
      fd.append("avatarFile", avatarFile);
    }

    return unwrap(
      API.put<ApiResponse<User>>("/user/update", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    );},

  changePassword: (body: ChangePasswordPayload) =>
    unwrap(API.post<ApiResponse<string>>("/user/change-password", body)),

  deleteAccount: () => unwrap(API.delete<ApiResponse<string>>("/user/delete")),

  logout: () => unwrap(API.post<ApiResponse<string>>("/user/logout")),

  getAll: () => unwrap(API.get<ApiResponse<User[]>>("/user/all")),

  registerStaff: (body: {
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
  }) => unwrap(API.post<ApiResponse<User>>("/user/register/staff", body)),

  changeRole: (email: string, newRole: Role) =>
    unwrap(
      API.put<ApiResponse<string>>("/user/role-change", null, {
        params: { email, newRole },
      })
    ),

  changeStatus: (email: string, newStatus: UserStatus) =>
    unwrap(
      API.put<ApiResponse<string>>("/user/status-change", null, {
        params: { email, newStatus },
      })
    ),
};
