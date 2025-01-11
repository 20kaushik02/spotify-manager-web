import axios from "axios";
import { backendDomain } from "./paths";

export const axiosInstance = axios.create({
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
