import { AxiosResponse } from "axios";
import { apiRespBaseType, axiosInstance } from "./axiosInstance";
import { authHealthCheckURL, authRefreshURL } from "./paths";

export const apiAuthCheck = async (): Promise<
  AxiosResponse<apiRespBaseType, any>
> => {
  try {
    const response = await axiosInstance.get(authHealthCheckURL);
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const apiAuthRefresh = async (): Promise<
  AxiosResponse<apiRespBaseType, any>
> => {
  try {
    const response = await axiosInstance.get(authRefreshURL);
    return response;
  } catch (error: any) {
    return error.response;
  }
};
