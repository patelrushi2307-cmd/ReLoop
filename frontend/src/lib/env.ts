import { z } from 'zod';

const frontendEnvSchema = z.object({
  VITE_API_BASE_URL: z.string().url().default('http://localhost:5000/api/v1'),
  VITE_SOCKET_URL: z.string().url().default('http://localhost:5000'),
});

const parseFrontendEnv = () => {
  const result = frontendEnvSchema.safeParse({
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    VITE_SOCKET_URL: import.meta.env.VITE_SOCKET_URL,
  });

  if (!result.success) {
    console.warn('Frontend environment variables fallback used:', result.error.format());
    return {
      VITE_API_BASE_URL: 'http://localhost:5000/api/v1',
      VITE_SOCKET_URL: 'http://localhost:5000',
    };
  }

  return result.data;
};

export const env = parseFrontendEnv();
