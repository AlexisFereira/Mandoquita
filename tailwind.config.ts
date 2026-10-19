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
          50: "var(--color-primary-50)",
          100: "var(--color-primary-100)",
          200: "var(--color-primary-200)",
          300: "var(--color-primary-300)",
          400: "var(--color-primary-400)",
          500: "var(--color-primary-500)",
          600: "var(--color-primary-600)",
          700: "var(--color-primary-700)",
          800: "var(--color-primary-800)",
          900: "var(--color-primary-900)",

          DEFAULT: "var(--color-primary-700)",
          hover: "var(--color-primary-800)",
          foreground: "var(--color-white)",
        },

        secondary: {
          50: "var(--color-secondary-50)",
          100: "var(--color-secondary-100)",
          200: "var(--color-secondary-200)",
          300: "var(--color-secondary-300)",
          400: "var(--color-secondary-400)",
          500: "var(--color-secondary-500)",
          600: "var(--color-secondary-600)",
          700: "var(--color-secondary-700)",
          800: "var(--color-secondary-800)",
          900: "var(--color-secondary-900)",

          DEFAULT: "var(--color-secondary-700)",
          foreground: "var(--color-white)",
        },

        neutral: {
          50: "var(--color-neutral-50)",
          100: "var(--color-neutral-100)",
          200: "var(--color-neutral-200)",
          300: "var(--color-neutral-300)",
          400: "var(--color-neutral-400)",
          500: "var(--color-neutral-500)",
          600: "var(--color-neutral-600)",
          700: "var(--color-neutral-700)",
          800: "var(--color-neutral-800)",
          900: "var(--color-neutral-900)",
        },

        background: "var(--background)",
        "background-muted": "var(--background-muted)",
        "background-accent": "var(--background-accent)",

        surface: {
          DEFAULT: "var(--surface)",
          card: "var(--surface-card)",
          muted: "var(--surface-muted)",
          hover: "var(--surface-hover)",
        },

        foreground: "var(--text-primary)",
        muted: "var(--text-muted)",
        border: "var(--border-default)",
        accent: "var(--color-secondary-500)",

        success: {
          DEFAULT: "var(--color-success-700)",
          50: "var(--color-success-50)",
          100: "var(--color-success-100)",
          500: "var(--color-success-500)",
          700: "var(--color-success-700)",
        },

        warning: {
          DEFAULT: "var(--color-warning-700)",
          50: "var(--color-warning-50)",
          100: "var(--color-warning-100)",
          500: "var(--color-warning-500)",
          700: "var(--color-warning-700)",
        },

        danger: {
          DEFAULT: "var(--color-error-700)",
          50: "var(--color-error-50)",
          100: "var(--color-error-100)",
          500: "var(--color-error-500)",
          700: "var(--color-error-700)",
        },

        info: {
          DEFAULT: "var(--color-info-700)",
          50: "var(--color-info-50)",
          100: "var(--color-info-100)",
          500: "var(--color-info-500)",
          700: "var(--color-info-700)",
        },

        focus: "var(--focus-ring)",

        "inverse-surface": "var(--color-neutral-900)",
        "inverse-foreground": "var(--color-white)",
        "inverse-muted": "var(--color-neutral-300)",
        "inverse-border": "var(--color-neutral-700)",
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
