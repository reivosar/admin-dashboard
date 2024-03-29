export const saveToken = (token: string) => {
  const now = new Date();
  const expiryTime = new Date(now.getTime() + 30 * 60000).getTime();
  localStorage.setItem("token", JSON.stringify({ token, expiryTime }));
};

export const getTokenData = () => {
  try {
    const tokenString = localStorage.getItem("token");
    if (!tokenString) {
      return null;
    }
    const tokenData = JSON.parse(tokenString);
    if (tokenData && new Date().getTime() <= tokenData.expiryTime) {
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
  const noAuthRequiredPages = ["/login"];
  const pathIsProtected = !noAuthRequiredPages.includes(pathname);
  return pathIsProtected && !getTokenData();
};

export const clearToken = () => {
  localStorage.removeItem("token");
};
