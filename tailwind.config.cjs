module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Poppins"', '"Segoe UI"', "sans-serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        accent: "#f97316",
        success: "#10b981",
        warning: "#facc15",
        danger: "#ef4444",
      },
      boxShadow: {
        soft: "0 20px 50px -20px rgba(79, 70, 229, 0.4)",
        card: "0 16px 30px -12px rgba(15, 23, 42, 0.25)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(99, 102, 241, 0.45)" },
          "50%": { boxShadow: "0 0 0 12px rgba(99, 102, 241, 0)" },
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
