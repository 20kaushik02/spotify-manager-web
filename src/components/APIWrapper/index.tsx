import type { AxiosRequestConfig, AxiosResponse } from "axios";

import type { apiRespBaseType } from "../../api/axiosInstance.ts";
import {
  showErrorToastNotification,
  showWarnToastNotification,
} from "../ToastNotification/index.tsx";

const maxRetries = 3;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// TODO: refreshAuth fn needs to be prop drilled (well, it's not really 'drilling', but still it's a single level)
// because hooks (namely, useContext) can't be used outside functional components
// so find a better way to pass refreshAuth

type APIWrapperProps<B, T extends apiRespBaseType> = {
  apiFn(data?: B, config?: AxiosRequestConfig): Promise<AxiosResponse<T, any>>;
  refreshAuth: () => Promise<boolean>;
  data?: B;
  config?: AxiosRequestConfig;
};

const APIWrapper = async <B, T extends apiRespBaseType>({
  apiFn,
  refreshAuth,
  data,
  config,
}: APIWrapperProps<B, T>): Promise<AxiosResponse<T, any> | null> => {
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
  return apiResp ?? null;
};

export default APIWrapper;
