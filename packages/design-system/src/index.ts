export const mgdColors = {
  background: {
    app: "#050816",
    appSoft: "#070B1A",
    surface: "#0E1424",
    widget: "#131C30",
    widgetHover: "#1B2842",
    overlay: "rgba(5, 8, 22, .82)",
  },
  brand: {
    primary: "#6D5DFC",
    primaryHover: "#7B6DFF",
    primarySoft: "rgba(109, 93, 252, .14)",
    glow: "rgba(109, 93, 252, .28)",
  },
  semantic: {
    success: "#00D26A",
    warning: "#FFB547",
    danger: "#FF5C75",
    info: "#2F80FF",
  },
  border: {
    subtle: "rgba(255,255,255,.06)",
    default: "rgba(255,255,255,.10)",
    strong: "rgba(255,255,255,.18)",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "rgba(255,255,255,.72)",
    muted: "rgba(255,255,255,.46)",
    faint: "rgba(255,255,255,.32)",
  },
} as const;

export const mgdSpacing = {
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
  24: "96px",
} as const;

export const mgdRadius = {
  sm: "12px",
  md: "16px",
  lg: "20px",
  xl: "24px",
  widget: "28px",
  panel: "34px",
  full: "999px",
} as const;

export const mgdShadows = {
  widget: "0 24px 80px rgba(0,0,0,.28)",
  glow: "0 0 80px rgba(109,93,252,.20)",
  soft: "0 16px 50px rgba(0,0,0,.18)",
} as const;

export const mgdTypography = {
  fontFamily: "Inter, Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  hero: { fontSize: "clamp(40px, 7vw, 72px)", lineHeight: "1", letterSpacing: "-.055em" },
  h1: { fontSize: "clamp(32px, 5vw, 56px)", lineHeight: "1.05", letterSpacing: "-.045em" },
  h2: { fontSize: "clamp(24px, 3vw, 36px)", lineHeight: "1.12", letterSpacing: "-.035em" },
  body: { fontSize: "16px", lineHeight: "1.7" },
  small: { fontSize: "14px", lineHeight: "1.55" },
  eyebrow: { fontSize: "12px", letterSpacing: ".28em", textTransform: "uppercase" },
} as const;

export const mgdMotion = {
  fast: "150ms ease",
  default: "240ms ease",
  slow: "420ms cubic-bezier(.16, 1, .3, 1)",
} as const;

export const mgdTheme = {
  colors: mgdColors,
  spacing: mgdSpacing,
  radius: mgdRadius,
  shadows: mgdShadows,
  typography: mgdTypography,
  motion: mgdMotion,
} as const;

export type MGDTone = "neutral" | "success" | "warning" | "danger" | "info" | "primary";
