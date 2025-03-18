import type { AxiosResponse } from "axios";
import { type apiRespBaseType, axiosInstance } from "./axiosInstance.ts";
import { loadImportDataURL } from "./paths.ts";

interface importGraphDataType extends apiRespBaseType {}

export const apiImportGraph = async (
  data: File
): Promise<AxiosResponse<importGraphDataType, any>> => {
  try {
    const formData = new FormData();
    formData.append("dataFile", data);
    const response = await axiosInstance.put(loadImportDataURL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  } catch (error: any) {
    return error.response;
  }
};
