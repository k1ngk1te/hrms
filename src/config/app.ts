export const CSRF_TOKEN = "csrftoken"
export const CSRF_HEADER_KEY = "X-CSRFToken"
export const DATA_LIFETIME = import.meta.env.VITE_DATA_LIFETIME ? parseInt(import.meta.env.VITE_DATA_LIFETIME) : 60;
export const DEFAULT_PAGINATION_SIZE = 100;
export const NODE_ENV = import.meta.env.DEV ? "development" : "production";