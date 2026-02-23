interface EnvConfig {
  apiUrl: string;
  appName: string;
  appVersion: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

/**
 * Get environment variable with fallback
 */
const getEnvVar = (key: string, fallback: string = ''): string => {
  return import.meta.env[key] || fallback;
};

/**
 * Environment configuration object
 */
export const env: EnvConfig = {
  // API URL - configurable for local/production
  apiUrl: getEnvVar('VITE_API_URL', 'http://localhost:8000/api'),

  // App metadata
  appName: getEnvVar('VITE_APP_NAME', 'SoftPoint'),
  appVersion: getEnvVar('VITE_APP_VERSION', '1.0.0'),

  // Environment checks
  isDevelopment: getEnvVar('VITE_ENV', 'development') === 'development',
  isProduction: getEnvVar('VITE_ENV', 'development') === 'production',
};

/**
 * Log configuration on startup (only in development)
 */
if (env.isDevelopment) {
  console.log('Environment Configuration:', {
    apiUrl: env.apiUrl,
    appName: env.appName,
    environment: env.isDevelopment ? 'development' : 'production',
  });
}

export default env;