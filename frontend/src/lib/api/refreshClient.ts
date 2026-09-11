import axios from 'axios';
import { env } from '../env';

/**
 * Dedicated Axios client exclusively for token refresh calls.
 * Does NOT attach auth headers or response interceptors to prevent infinite retry loops.
 */
export const refreshClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  withCredentials: true, // Needed for HttpOnly refresh cookie
  headers: {
    'Content-Type': 'application/json',
  },
});
