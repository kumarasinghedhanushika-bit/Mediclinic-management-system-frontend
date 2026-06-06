import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../types";

/** Extract `data` from standard backend ApiResponse wrapper */
export async function unwrap<T>(
  promise: Promise<AxiosResponse<ApiResponse<T>>>
): Promise<T> {
  const res = await promise;
  return res.data.data;
}

export async function unwrapMessage(
  promise: Promise<AxiosResponse<ApiResponse<unknown>>>
): Promise<string> {
  const res = await promise;
  return res.data.message;
}
