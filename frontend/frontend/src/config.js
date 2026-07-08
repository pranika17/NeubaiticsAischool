const configuredApiBaseUrl = process.env.REACT_APP_API_BASE_URL;
const configuredSiteUrl = process.env.REACT_APP_SITE_URL;
const configuredAdminUrl = process.env.REACT_APP_ADMIN_URL;

const defaultSiteUrl =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000"
    : window.location.origin;

const normalizedSiteUrl = (configuredSiteUrl || defaultSiteUrl).replace(/\/+$/, "");
const normalizedApiBase = (configuredApiBaseUrl || normalizedSiteUrl).replace(/\/+$/, "");

export const baseUrl = normalizedApiBase.endsWith("/api")
  ? normalizedApiBase
  : `${normalizedApiBase}/api`;

export const siteUrl = `${normalizedSiteUrl}/`;
export const adminUrl = configuredAdminUrl || `${normalizedSiteUrl}/admin/login/?next=/admin/`;

const svgToDataUri = (svg) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

export const defaultAvatarUrl = svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">
    <rect width="320" height="320" rx="28" fill="#102331"/>
    <circle cx="160" cy="122" r="54" fill="#5fd7ff"/>
    <path d="M68 270c12-54 52-82 92-82s80 28 92 82" fill="#5fd7ff"/>
  </svg>
`);

export const defaultCourseImageUrl = svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420">
    <rect width="640" height="420" rx="26" fill="#0e1f2d"/>
    <rect x="54" y="58" width="532" height="304" rx="18" fill="#17354a" stroke="#59dfff" stroke-width="4"/>
    <circle cx="170" cy="170" r="44" fill="#59dfff" opacity="0.85"/>
    <path d="M120 300l92-88 74 66 110-110 124 132H120z" fill="#59dfff" opacity="0.72"/>
    <text x="320" y="386" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#c8f6ff">Course Image</text>
  </svg>
`);

export const resolveMediaUrl = (value, fallback = "") => {
  const raw = String(value || "").trim();
  if (!raw) return fallback;
  if (
    /(^|\/)(default-course\.png|default-avatar\.png)$/i.test(raw) ||
    /\/media\/course_imgs\/default-course\.png$/i.test(raw) ||
    /\/media\/.*\/default-avatar\.png$/i.test(raw)
  ) {
    return fallback;
  }
  if (/^https?:\/\//i.test(raw) || raw.startsWith("blob:") || raw.startsWith("data:")) {
    return raw;
  }

  const normalizedPath = raw.replace(/^\/+/, "");
  return `${siteUrl}${normalizedPath}`;
};
