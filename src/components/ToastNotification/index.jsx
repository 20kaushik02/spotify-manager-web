import { toast } from "react-toastify";

export const showErrorToastNotification = (message) => {
  toast.error(message || "Server Error");
};

export const showSuccessToastNotification = (message) => {
  toast.success(message || "Success");
};

export const showWarnToastNotification = (message) => {
  toast.warn(message || "Warning");
};

export const showInfoToastNotification = (message) => {
  toast.info(message || "Info");
};
