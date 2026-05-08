const AUTH_KEY = "admin_token";

export const API_KEY_HEADER = "x-api-key" as const;

export const getAdminToken = (): string | null =>
  localStorage.getItem(AUTH_KEY);

export const setAdminToken = (token: string): void =>
  localStorage.setItem(AUTH_KEY, token);

export const clearAdminToken = (): void =>
  localStorage.removeItem(AUTH_KEY);

export const isAuthenticated = (): boolean =>
  Boolean(getAdminToken());

/** Returns headers with the stored API token for authenticated requests. */
export const authHeaders = (): Record<string, string> => {
  const token = getAdminToken();
  return token ? { [API_KEY_HEADER]: token } : {};
};
