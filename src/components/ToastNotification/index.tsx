import { toast, type ToastContent } from "react-toastify";

export const showErrorToastNotification = (message: ToastContent): void => {
  toast.error(message || "Server Error");
};

export const showSuccessToastNotification = (message: ToastContent): void => {
  toast.success(message || "Success");
};

export const showWarnToastNotification = (message: ToastContent): void => {
  toast.warn(message || "Warning");
};

export const showInfoToastNotification = (message: ToastContent): void => {
  toast.info(message || "Info");
};
