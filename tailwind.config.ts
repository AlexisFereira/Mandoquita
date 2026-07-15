import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],

  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2rem",
        "2xl": "5rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },

    extend: {
      colors: {
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          hover: "rgb(var(--primary-hover) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },
        background: "rgb(var(--background) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-muted": "rgb(var(--surface-muted) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        focus: "rgb(var(--focus) / <alpha-value>)",
        info: "rgb(var(--info) / <alpha-value>)",
        "inverse-surface": "rgb(var(--inverse-surface) / <alpha-value>)",
        "inverse-foreground": "rgb(var(--inverse-foreground) / <alpha-value>)",
        "inverse-muted": "rgb(var(--inverse-muted) / <alpha-value>)",
        "inverse-border": "rgb(var(--inverse-border) / <alpha-value>)",
      },

      fontFamily: {
        heading: ["var(--font-display)"],
        body: ["var(--font-sans)"],
      },

      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },

      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem",
      },

      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },

      transitionDuration: {
        fast: "150ms",
        DEFAULT: "220ms",
        slow: "320ms",
      },

      keyframes: {
        fadeUp: {
          from: {
            opacity: "0",
            transform: "translateY(12px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        fade: {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },

        scale: {
          from: {
            transform: "scale(.98)",
          },
          to: {
            transform: "scale(1)",
          },
        },
      },

      animation: {
        fade: "fade .25s ease-out",

        "fade-up": "fadeUp .35s ease-out",

        scale: "scale .25s ease-out",
      },
    },
  },

  plugins: [],
};

export default config;
