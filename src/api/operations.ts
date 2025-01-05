import { AxiosResponse } from "axios";
import { apiRespBaseType, axiosInstance } from "./axiosInstance";
import { opFetchGraphURL, opUpdateUserDataURL } from "./paths";

interface fetchGraphDataType extends apiRespBaseType {
  playlists?: {
    playlistID: string;
    playlistName: string;
  }[];
  links?: {
    from: string; // playlistID
    to: string; // playlistID
  }[];
}

interface updateUserDataType extends apiRespBaseType {
  removedLinks: boolean;
}

export const apiFetchGraph = async (): Promise<
  AxiosResponse<fetchGraphDataType, any>
> => {
  try {
    const response = await axiosInstance.get(opFetchGraphURL);
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const apiUpdateUserData = async (): Promise<
  AxiosResponse<updateUserDataType, any>
> => {
  try {
    const response = await axiosInstance.put(opUpdateUserDataURL);
    return response;
  } catch (error: any) {
    return error.response;
  }
};
