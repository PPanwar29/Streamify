// Get environment variables, supporting both build-time and runtime
export const getEnvVar = (key) => {
  // First try build-time environment variable (Vite)
  if (import.meta.env[key]) {
    return import.meta.env[key];
  }
  
  // Fallback to runtime environment variable (window.ENV_CONFIG)
  if (typeof window !== 'undefined' && window.ENV_CONFIG && window.ENV_CONFIG[key]) {
    const value = window.ENV_CONFIG[key];
    // Replace placeholder with actual value if it's a placeholder
    if (value === `__${key}__`) {
      return null; // Placeholder not replaced
    }
    return value;
  }
  
  return null;
};

// Specific getters for commonly used environment variables
export const STREAM_API_KEY = getEnvVar('VITE_STREAM_API_KEY'); 