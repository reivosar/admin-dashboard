import { isPathProtected } from "./authConfig";

const LOCAL_STRAGE_ITEM_KEY = "admin-dashboard-data";

export const saveToken = (tokenString: string) => {
  clearToken();
  const now = new Date();
  const expiryTime = new Date(now.getTime() + 30 * 60000).getTime();
  localStorage.setItem(
    LOCAL_STRAGE_ITEM_KEY,
    JSON.stringify({ token: tokenString, expired_at: expiryTime })
  );
};

export const getTokenData = () => {
  try {
    const tokenString = localStorage.getItem(LOCAL_STRAGE_ITEM_KEY);
    if (!tokenString) {
      return null;
    }
    const tokenData = JSON.parse(tokenString);
    if (tokenData && new Date().getTime() <= tokenData.expired_at) {
      return tokenData;
    }
  } catch (error) {
    return null;
  }
  return null;
};

export const refreshTokenExpiry = () => {
  const tokenData = getTokenData();
  if (tokenData) {
    saveToken(tokenData.token);
  }
};

export const shouldRedirectToLogin = (pathname: string) => {
  const pathIsProtected = isPathProtected(pathname);
  return pathIsProtected && !getTokenData();
};

export const clearToken = () => {
  localStorage.removeItem(LOCAL_STRAGE_ITEM_KEY);
};
