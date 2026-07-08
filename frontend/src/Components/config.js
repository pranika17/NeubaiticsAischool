// src/config.js
const configuredBaseUrl = process.env.REACT_APP_API_BASE_URL;
const defaultHost =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000"
    : "https://unsoaped-convolvulaceous-angelo.ngrok-free.dev";

const normalizedBaseUrl = (configuredBaseUrl || defaultHost).replace(/\/+$/, "");

export const baseUrl = normalizedBaseUrl.endsWith("/api")
  ? normalizedBaseUrl
  : `${normalizedBaseUrl}/api`;
