import { get, post } from "@/utils/api";
import { isPathProtected } from "../utils/authConfig";

export const checkAuthStatus = async (): Promise<boolean> => {
  try {
    const response = await get("/api/auth");
    return response.result;
  } catch (error) {
    return false;
  }
};

export const shouldRedirectToLogin = (pathname: string) => {
  const pathIsProtected = isPathProtected(pathname);
  return pathIsProtected && !checkAuthStatus();
};

export const forceLogout = async (): Promise<void> => {
  await post("/api/logout", {});
};
