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
  let apiResp;
  for (let i = 1; i <= maxRetries + 1; i++) {
    apiResp = await apiFn(data, config);

    if (apiResp === undefined) {
      showErrorToastNotification("Please try again after sometime");
    } else if (apiResp.status >= 200 && apiResp.status < 300) {
      break;
    } else if (apiResp.status === 401) {
      showWarnToastNotification("Session expired, refreshing...");
      if (!(await refreshAuth())) {
        showErrorToastNotification("Session invalid.");
        break;
      }
    } else if (apiResp.status >= 400 && apiResp.status < 500) {
      showErrorToastNotification(apiResp.data.message);
      break; // no retry on 4XX
    } else {
      showErrorToastNotification(apiResp.data.message);
    }
    await sleep(i * i * 1000);
  }
  return apiResp;
};

export default APIWrapper;
