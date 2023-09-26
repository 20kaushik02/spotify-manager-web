import { useContext } from "react";
import { RefreshAuthContext } from "../App";
import { showErrorToastNotification, showSuccessToastNotification } from "../components/ToastNotification";
import LocalStorage from "../utils/localStorageHelper";

const refreshAuth = useContext(RefreshAuthContext);

if (resp === undefined) {
	showErrorToastNotification(<p>Please try again after sometime</p>);
	return;
} else {
	if (resp.status === 200) {
		showSuccessToastNotification(<p>{resp.data.message}</p>);
		// proceed with data
	} else if (resp.status >= 400 && resp.status < 500) {
		if (resp.data.auth === false) {
			LocalStorage.clear();
			refreshAuth();
		}
		showErrorToastNotification(<p>{resp.data.message}</p>);
		return;
	} else if (resp.status >= 500 && resp.status < 600) {
		showErrorToastNotification(<p>{resp.data.message}</p>);
		return;
	}
}