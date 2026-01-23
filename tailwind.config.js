/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-color": "#2563eb",
        "primary-dark": "#1e40af",
        "secondary-color": "#10b981",
        "accent-color": "#f59e0b",
        "text-primary": "#1f2937",
        "text-secondary": "#6b7280",
        "bg-primary": "#ffffff",
        "bg-secondary": "#f9fafb",
        "bg-hover": "#f3f4f6",
        "border-color": "#e5e7eb",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "Fira Sans",
          "Droid Sans",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      transitionDuration: {
        200: "200ms",
        300: "300ms",
        400: "400ms",
        500: "500ms",
      },
      transformOrigin: {
        center: "center",
        top: "top",
        bottom: "bottom",
      },
      backdropBlur: {
        sm: "4px",
        md: "8px",
      },
    },
  },
  plugins: [],
};
