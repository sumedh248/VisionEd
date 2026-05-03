const LOCAL_ORIGINS = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

const FALLBACK_APP_ORIGIN = "https://visionedd-frontend.onrender.com";

export const APP_ORIGIN =
  import.meta.env.VITE_APP_ORIGIN ||
  (typeof window !== "undefined" && window.location?.origin
    ? window.location.origin
    : FALLBACK_APP_ORIGIN);

export const getAppRedirectUrl = (path = "/") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const origin = LOCAL_ORIGINS.has(APP_ORIGIN) ? APP_ORIGIN : FALLBACK_APP_ORIGIN;
  return `${origin}${normalizedPath}`;
};
