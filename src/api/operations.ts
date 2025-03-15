import type { AxiosResponse } from "axios";
import { type apiRespBaseType, axiosInstance } from "./axiosInstance.ts";
import {
  opBackfillChainURL,
  opBackfillLinkURL,
  opCreateLinkURL,
  opDeleteLinkURL,
  opFetchGraphURL,
  opPruneChainURL,
  opPruneLinkURL,
  opUpdateUserDataURL,
} from "./paths.ts";

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

type createLinkBodyType = {
  from: string; // playlistID
  to: string; // playlistID
};

interface createLinkDataType extends apiRespBaseType {}

type deleteLinkBodyType = createLinkBodyType;

interface deleteLinkDataType extends apiRespBaseType {}

type backfillLinkBodyType = createLinkBodyType;

interface backfillLinkDataType extends apiRespBaseType {
  toAddNum: number;
  addedNum: number;
  localNum: number;
}

type backfillChainBodyType = {
  root: string; // playlistID
};

interface backfillChainDataType extends backfillLinkDataType {}

type pruneLinkBodyType = createLinkBodyType;

interface pruneLinkDataType extends apiRespBaseType {
  toDelNum: number;
  deletedNum: number;
}

type pruneChainBodyType = backfillChainBodyType;

interface pruneChainDataType extends pruneLinkDataType {}

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

export const apiCreateLink = async (
  data: createLinkBodyType
): Promise<AxiosResponse<createLinkDataType, any>> => {
  try {
    const response = await axiosInstance.post(opCreateLinkURL, data);
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const apiDeleteLink = async (
  data: deleteLinkBodyType
): Promise<AxiosResponse<deleteLinkDataType, any>> => {
  try {
    const response = await axiosInstance.delete(opDeleteLinkURL, { data }); // axios delete method doesn't take body
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const apiBackfillLink = async (
  data: backfillLinkBodyType
): Promise<AxiosResponse<backfillLinkDataType, any>> => {
  try {
    const response = await axiosInstance.put(opBackfillLinkURL, data);
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const apiBackfillChain = async (
  data: backfillChainBodyType
): Promise<AxiosResponse<backfillChainDataType, any>> => {
  try {
    const response = await axiosInstance.put(opBackfillChainURL, data);
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const apiPruneLink = async (
  data: pruneLinkBodyType
): Promise<AxiosResponse<pruneLinkDataType, any>> => {
  try {
    const response = await axiosInstance.put(opPruneLinkURL, data);
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const apiPruneChain = async (
  data: pruneChainBodyType
): Promise<AxiosResponse<pruneChainDataType, any>> => {
  try {
    const response = await axiosInstance.put(opPruneChainURL, data);
    return response;
  } catch (error: any) {
    return error.response;
  }
};
