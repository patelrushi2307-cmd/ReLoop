/**
 * In-memory storage for short-lived JWT access token.
 * Access tokens are NEVER stored in localStorage or sessionStorage.
 */
let accessToken: string | null = null;

export const tokenStore = {
  getToken: (): string | null => accessToken,
  setToken: (token: string | null): void => {
    accessToken = token;
  },
  clearToken: (): void => {
    accessToken = null;
  },
};
