import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { createApi, type BaseQueryFn } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { toast } from "sonner";
import { tagTypesList } from "../tag-type";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api/v1",
  withCredentials: true,
});

const axiosBaseQuery: BaseQueryFn<string | AxiosRequestConfig, unknown, { status: number; data: any }> =
  async (args, api, extraOptions) => {
    try {
      // Access Redux state to get token
      const token = (api.getState() as RootState).auth.token;

      if (typeof args === "string") {
        args = { url: args };
      }

      const config: AxiosRequestConfig = {
        ...args,
        headers: {
          ...(args.headers || {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      };

      const result = await axiosInstance.request(config);
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;

      const status = err.response?.status || 500;
      const data = err.response?.data || err.message;

      // Show toast based on error status
      if (status === 401) {
        toast.error("Your session has expired. Please log in again.");
      } else if (status === 404) {
        toast.error("Response not found");
      } else {
        toast.error(
          typeof data === "object" && data && "message" in data
            ? (data as { message?: string }).message
            : "An unexpected error occurred."
        );
      }

      return { error: { status, data } };
    }
  };

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery,
  tagTypes: tagTypesList,
  endpoints: () => ({}),
});
