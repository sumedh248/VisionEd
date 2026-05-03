const LOCAL_ORIGINS = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

const DEPLOYED_APP_ORIGINS = new Set([
  "https://visioned-frontend.onrender.com",
  "https://visionedd-frontend.onrender.com",
]);

const FALLBACK_APP_ORIGIN = "https://visioned-frontend.onrender.com";

export const APP_ORIGIN =
  (typeof window !== "undefined" && window.location?.origin
    ? window.location.origin
    : import.meta.env.VITE_APP_ORIGIN) || FALLBACK_APP_ORIGIN;

export const getAppRedirectUrl = (path = "/") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const origin = LOCAL_ORIGINS.has(APP_ORIGIN) || DEPLOYED_APP_ORIGINS.has(APP_ORIGIN)
    ? APP_ORIGIN
    : FALLBACK_APP_ORIGIN;
  return `${origin}${normalizedPath}`;
};
