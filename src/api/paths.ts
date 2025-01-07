export const backendDomain = process.env.REACT_APP_API_BASE_URL + "/";

export const authLoginURL = backendDomain + "api/auth/login"
export const authLogoutURL = backendDomain + "api/auth/logout"

export const authHealthCheckURL = "auth-health";
export const authRefreshURL = "api/auth/refresh";

export const opFetchGraphURL = "api/operations/fetch";
export const opUpdateUserDataURL = "api/operations/update";
export const opCreateLinkURL = "api/operations/link";
export const opDeleteLinkURL = opCreateLinkURL;
