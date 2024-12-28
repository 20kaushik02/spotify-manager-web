import { axiosInstance } from "./axiosInstance";

const authHealthCheckURL = "auth-health";
const authRefreshURL = "api/auth/refresh";

export const apiAuthCheck = async () => {
	try {
		const response = await axiosInstance.get(authHealthCheckURL);
		return response;
	} catch (error) {
		return error.response;
	}
}

export const apiAuthRefresh = async () => {
	try {
		const response = await axiosInstance.get(authRefreshURL);
		return response;
	} catch (error) {
		return error.response;
	}
}