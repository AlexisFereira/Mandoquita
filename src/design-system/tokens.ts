export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface SemanticColorPalette {
  primary: ColorScale;
  secondary: ColorScale;
  success: ColorScale;
  danger: ColorScale;
  warning: ColorScale;
  info: ColorScale;
  neutral: ColorScale;
  background: string;
  surface: string;
  foreground: string;
  muted: string;
  border: string;
}

export interface TypographyScale {
  heading: {
    fontFamily: string;
    sizes: {
      sm: { fontSize: string; lineHeight: string; fontWeight: number };
      md: { fontSize: string; lineHeight: string; fontWeight: number };
      lg: { fontSize: string; lineHeight: string; fontWeight: number };
      xl: { fontSize: string; lineHeight: string; fontWeight: number };
    };
  };
  body: {
    fontFamily: string;
    sizes: {
      sm: { fontSize: string; lineHeight: string; fontWeight: number };
      md: { fontSize: string; lineHeight: string; fontWeight: number };
      lg: { fontSize: string; lineHeight: string; fontWeight: number };
    };
  };
  caption: {
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    fontWeight: number;
  };
}

export interface DesignTokens {
  colors: {
    light: SemanticColorPalette;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    "2xl": number;
  };
  typography: TypographyScale;
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  radii: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  layout: {
    containers: {
      sm: number;
      md: number;
      lg: number;
      xl: number;
      wide: number;
    };
    breakpoints: {
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
  };
}

export const SEMANTIC_THEME_TOKENS = {
  light: {
    primaryAction: "#A8583D",
    primaryActionForeground: "#FFFFFF",
  },
} as const;

const LIGHT_COLORS: SemanticColorPalette = {
  primary: {
    50: "#FDF7F4",
    100: "#F6ECE7",
    200: "#EDD6CB",
    300: "#DEB29D",
    400: "#D08A6B",
    500: "#C46A4A",
    600: "#A8583D",
    700: "#874632",
    800: "#653426",
    900: "#47241B",
    950: "#331812",
  },
  secondary: {
    50: "#F7FAFC",
    100: "#EDF2F7",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
    950: "#020617",
  },
  success: {
    50: "#F0FDF4",
    100: "#DCFCE7",
    200: "#BBF7D0",
    300: "#86EFAC",
    400: "#4ADE80",
    500: "#22C55E",
    600: "#16A34A",
    700: "#15803D",
    800: "#166534",
    900: "#14532D",
    950: "#052E16",
  },
  danger: {
    50: "#FEF2F2",
    100: "#FEE2E2",
    200: "#FECACA",
    300: "#FCA5A5",
    400: "#F87171",
    500: "#EF4444",
    600: "#DC2626",
    700: "#B91C1C",
    800: "#991B1B",
    900: "#7F1D1D",
    950: "#450A0A",
  },
  warning: {
    50: "#FFFBEB",
    100: "#FEF3C7",
    200: "#FDE68A",
    300: "#FCD34D",
    400: "#FBBF24",
    500: "#F59E0B",
    600: "#D97706",
    700: "#B45309",
    800: "#92400E",
    900: "#78350F",
    950: "#451A03",
  },
  info: {
    50: "#EFF6FF",
    100: "#DBEAFE",
    200: "#BFDBFE",
    300: "#93C5FD",
    400: "#60A5FA",
    500: "#3B82F6",
    600: "#2563EB",
    700: "#1D4ED8",
    800: "#1E40AF",
    900: "#1E3A8A",
    950: "#172554",
  },
  neutral: {
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#EAEAEA",
    300: "#D6D6D6",
    400: "#B5B5B5",
    500: "#8B8B8B",
    600: "#666666",
    700: "#444444",
    800: "#2B2B2B",
    900: "#181818",
    950: "#111111",
  },
  background: "#FAFAFA",
  surface: "#FFFFFF",
  foreground: "#181818",
  muted: "#6B7280",
  border: "#EAEAEA",
};

export const DESIGN_TOKENS = {
  colors: {
    light: LIGHT_COLORS,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    "2xl": 48,
  },
  typography: {
    heading: {
      fontFamily: 'Manrope, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      sizes: {
        sm: { fontSize: "1.125rem", lineHeight: "1.3", fontWeight: 600 },
        md: { fontSize: "1.5rem", lineHeight: "1.25", fontWeight: 700 },
        lg: { fontSize: "2rem", lineHeight: "1.15", fontWeight: 700 },
        xl: { fontSize: "2.5rem", lineHeight: "1.1", fontWeight: 800 },
      },
    },
    body: {
      fontFamily: 'Inter, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      sizes: {
        sm: { fontSize: "0.875rem", lineHeight: "1.5", fontWeight: 400 },
        md: { fontSize: "1rem", lineHeight: "1.55", fontWeight: 400 },
        lg: { fontSize: "1.125rem", lineHeight: "1.6", fontWeight: 400 },
      },
    },
    caption: {
      fontFamily: 'Inter, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      fontSize: "0.75rem",
      lineHeight: "1.4",
      fontWeight: 500,
    },
  },
  shadows: {
    sm: "0 1px 2px rgba(31, 26, 23, 0.08)",
    md: "0 8px 24px rgba(31, 26, 23, 0.1)",
    lg: "0 18px 48px rgba(31, 26, 23, 0.14)",
  },
  radii: {
    sm: "10px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  layout: {
    containers: {
      sm: 640,
      md: 768,
      lg: 1120,
      xl: 1280,
      wide: 1400,
    },
    breakpoints: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
} as const satisfies DesignTokens;

export const designTokens = DESIGN_TOKENS;

export type DesignTokenSet = DesignTokens;
