import { AxiosRequestConfig, AxiosResponse } from "axios";

import { apiRespBaseType } from "../../api/axiosInstance";
import {
  showErrorToastNotification,
  showWarnToastNotification,
} from "../ToastNotification";

const maxRetries = 3;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// TODO: refreshAuth fn needs to be prop drilled (well, it's not really 'drilling', but still it's a single level)
// because hooks (namely, useContext) can't be used outside functional components
// so find a better way to pass refreshAuth

type APIWrapperProps<T extends apiRespBaseType> = {
  apiFn(
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T, any>>;
  refreshAuth: () => Promise<boolean>;
  data?: any;
  config?: AxiosRequestConfig;
};

const APIWrapper = async <T extends apiRespBaseType>({
  apiFn,
  refreshAuth,
  data,
  config,
}: APIWrapperProps<T>) => {
  for (let i = 1; i <= maxRetries + 1; i++) {
    const apiResp = await apiFn(data, config);

    if (apiResp === undefined) {
      showErrorToastNotification("Please try again after sometime");
    } else if (apiResp.status === 200) {
      return apiResp;
    } else if (apiResp.status === 401) {
      showWarnToastNotification("Session expired, refreshing...");
      if (!(await refreshAuth())) {
        showErrorToastNotification("Session invalid.");
        return;
      }
    } else {
      showErrorToastNotification(apiResp.data.message);
    }
    await sleep(i * i * 1000);
  }
  showErrorToastNotification("Please try again after sometime");
  return;
};

export default APIWrapper;
