import axios from "axios";
import { backendDomain } from "./paths";

export const axiosInstance = axios.create({
  baseURL: backendDomain,
  withCredentials: true,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json"
  },
});
