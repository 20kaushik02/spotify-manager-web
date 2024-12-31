import { toast, type ToastContent } from "react-toastify";

export const showErrorToastNotification = (message: ToastContent) => {
  toast.error(message || "Server Error");
};

export const showSuccessToastNotification = (message: ToastContent) => {
  toast.success(message || "Success");
};

export const showWarnToastNotification = (message: ToastContent) => {
  toast.warn(message || "Warning");
};

export const showInfoToastNotification = (message: ToastContent) => {
  toast.info(message || "Info");
};
