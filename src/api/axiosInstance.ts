import axios, { type AxiosInstance } from "axios";
import { backendDomain } from "./paths.ts";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: backendDomain,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface apiRespBaseType {
  message?: string;
  errors?: any[];
}
