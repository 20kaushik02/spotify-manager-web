import { useContext } from "react";
import { RefreshAuthContext } from "../App";
import { showErrorToastNotification, showSuccessToastNotification } from "../components/ToastNotification";
import LocalStorage from "../utils/localStorageHelper";

const refreshAuth = useContext(RefreshAuthContext);

if (resp === undefined) {
  showErrorToastNotification("Please try again after sometime");
  return;
} else {
  if (resp.status === 200) {
    showSuccessToastNotification(resp.data.message);
    // proceed with data
  } else if (resp.status >= 400 && resp.status < 500) {
    if (resp.data.auth === false) {
      LocalStorage.clear();
      refreshAuth();
    }
    showErrorToastNotification(resp.data.message);
    return;
  } else if (resp.status >= 500 && resp.status < 600) {
    showErrorToastNotification(resp.data.message);
    return;
  }
}
