import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Utility function
export async function apiRequest<T = unknown>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response: AxiosResponse<T> = await api.request({
      method,
      url,
      data,
      ...config,
    });

    return response.data;
  } catch (error: unknown) {
    console.error("API Request Error:", error);
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message || "Unknown Error";
    }
    throw error instanceof Error ? error.message : "Unknown Error";
  }
}
