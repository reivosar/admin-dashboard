const noAuthRequiredPages = [
  "/login",
  "/error",
  "/activation",
  "/activation/success",
];

export function isPathProtected(pathname: string): boolean {
  return !noAuthRequiredPages.includes(pathname);
}
