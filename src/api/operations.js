import { axiosInstance } from "./axiosInstance";
import { opFetchGraphURL } from "./paths";

export const apiFetchGraph = async () => {
  try {
    const response = await axiosInstance.get(opFetchGraphURL);
    return response;
  } catch (error) {
    return error.response;
  }
}
