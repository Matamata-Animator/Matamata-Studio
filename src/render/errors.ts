export function simplifyError(error: string) {
  if (error.includes("Exception: Make sure Docker Desktop is running")) {
    return "Make sure Docker Desktop is running";
  }

  return error;
}
