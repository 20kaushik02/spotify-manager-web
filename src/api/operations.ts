import { AxiosResponse } from "axios";
import { apiRespBase, axiosInstance } from "./axiosInstance";
import { opFetchGraphURL } from "./paths";

interface fetchGraphDataType extends apiRespBase {
  playlists?: {
    playlistID: string;
    playlistName: string;
  }[];
  links?: {
    from: string; // playlistID
    to: string; // playlistID
  }[];
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
