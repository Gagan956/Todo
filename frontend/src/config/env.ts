export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
  },
  app: {
    name: 'Todo App',
    version: '1.0.0',
    environment: import.meta.env.MODE || 'development',
  },
  features: {
    enableEmail: import.meta.env.VITE_ENABLE_EMAIL === 'true',
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  },
} as const;

// Validate required environment variables
export const validateEnvironment = (): string[] => {
  const errors: string[] = [];

  if (!import.meta.env.VITE_API_URL) {
    console.warn('⚠️ VITE_API_URL is not set, using default: http://localhost:5000/api');
  }

  return errors;
};

// Export validated config
export const getValidatedConfig = () => {
  const errors = validateEnvironment();
  if (errors.length > 0) {
    console.warn('Environment configuration warnings:', errors);
  }
  return config;
};