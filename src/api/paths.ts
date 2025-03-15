export const backendDomain: string =
  process.env["REACT_APP_API_BASE_URL"] + "/";
export const spotifyPlaylistLinkPrefix = "https://open.spotify.com/playlist/";

export const authLoginURL = "api/auth/login";
export const authLoginFullURL: string = backendDomain + authLoginURL;
export const authLogoutURL = "api/auth/logout";
export const authLogoutFullURL: string = backendDomain + authLogoutURL;

export const authHealthCheckURL = "auth-health";
export const authRefreshURL = "api/auth/refresh";

export const opFetchGraphURL = "api/operations/fetch";
export const opUpdateUserDataURL = "api/operations/update";
export const opCreateLinkURL = "api/operations/link";
export const opDeleteLinkURL: "api/operations/link" = opCreateLinkURL;
export const opBackfillLinkURL = "api/operations/populate/link";
export const opBackfillChainURL = "api/operations/populate/chain";
export const opPruneLinkURL = "api/operations/prune/link";
export const opPruneChainURL = "api/operations/prune/chain";
