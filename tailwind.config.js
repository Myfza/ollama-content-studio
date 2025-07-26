/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--color-border)", /* white/10 */
        input: "var(--color-input)", /* gray-900 */
        ring: "var(--color-ring)", /* orange-600 */
        background: "var(--color-background)", /* gray-950 */
        foreground: "var(--color-foreground)", /* gray-50 */
        primary: {
          DEFAULT: "var(--color-primary)", /* gray-900 */
          foreground: "var(--color-primary-foreground)", /* gray-50 */
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", /* gray-800 */
          foreground: "var(--color-secondary-foreground)", /* gray-50 */
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", /* red-500 */
          foreground: "var(--color-destructive-foreground)", /* white */
        },
        muted: {
          DEFAULT: "var(--color-muted)", /* gray-800 */
          foreground: "var(--color-muted-foreground)", /* gray-400 */
        },
        accent: {
          DEFAULT: "var(--color-accent)", /* orange-600 */
          foreground: "var(--color-accent-foreground)", /* white */
        },
        popover: {
          DEFAULT: "var(--color-popover)", /* gray-800 */
          foreground: "var(--color-popover-foreground)", /* gray-50 */
        },
        card: {
          DEFAULT: "var(--color-card)", /* gray-900 */
          foreground: "var(--color-card-foreground)", /* gray-50 */
        },
        success: {
          DEFAULT: "var(--color-success)", /* green-500 */
          foreground: "var(--color-success-foreground)", /* white */
        },
        warning: {
          DEFAULT: "var(--color-warning)", /* yellow-400 */
          foreground: "var(--color-warning-foreground)", /* black */
        },
        error: {
          DEFAULT: "var(--color-error)", /* red-500 */
          foreground: "var(--color-error-foreground)", /* white */
        },
        surface: "var(--color-surface)", /* gray-900 */
        "text-primary": "var(--color-text-primary)", /* gray-50 */
        "text-secondary": "var(--color-text-secondary)", /* gray-400 */
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Noto Serif', 'serif'],
        caption: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
      },
      animation: {
        "pulse-subtle": "pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 1.5s infinite",
        "typing-cursor": "typing-cursor 1s infinite",
      },
      keyframes: {
        "pulse-subtle": {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.7",
          },
        },
        "shimmer": {
          "0%": {
            "background-position": "-200px 0",
          },
          "100%": {
            "background-position": "calc(200px + 100%) 0",
          },
        },
        "typing-cursor": {
          "0%, 50%": {
            opacity: "1",
          },
          "51%, 100%": {
            opacity: "0",
          },
        },
      },
      transitionDuration: {
        '150': '150ms',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      zIndex: {
        '100': '100',
        '110': '110',
        '200': '200',
        '1000': '1000',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}