export const backendDomain = process.env.REACT_APP_API_BASE_URL + "/";
export const spotifyPlaylistLinkPrefix = "https://open.spotify.com/playlist/";

export const authLoginURL = "api/auth/login";
export const authLoginFullURL = backendDomain + authLoginURL;
export const authLogoutURL = "api/auth/logout";
export const authLogoutFullURL = backendDomain + authLogoutURL;

export const authHealthCheckURL = "auth-health";
export const authRefreshURL = "api/auth/refresh";

export const opFetchGraphURL = "api/operations/fetch";
export const opUpdateUserDataURL = "api/operations/update";
export const opCreateLinkURL = "api/operations/link";
export const opDeleteLinkURL = opCreateLinkURL;
export const opBackfillLinkURL = "api/operations/populate/link";
export const opPruneLinkURL = "api/operations/prune/link";
