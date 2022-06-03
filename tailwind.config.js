module.exports = {
  content: ["./src/**/*"],
  mode: "jit",
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {
      borderRadius: {
        round: "100%",
      },
      colors: {
        primary: {
          100: "#6565cd",
          200: "#5252c7",
          300: "#3e3ec1",
          400: "#252574",
          500: "#1f1f60",
          600: "#19194d",
          700: "#13133a",
          800: "#0c0c27",
          900: "#060613",
        },
        secondary: {
          100: "#ffa366",
          200: "#ff944d",
          300: "#ff8533",
          400: "#ff751a",
          500: "#ff6600",
          600: "#e65c00",
          700: "#cc5200",
          800: "#b34700",
          900: "#993d00",
        },
      },
      screens: {
        'xs': '400px',
        'sm': '580px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px'
      },
    },
    fontSize: {
      tiny: "0.5rem",
      xs: ".625rem",
      sm: ".75rem",
      base: ".875rem",
      lg: "1rem",
      xl: "1.125rem",
      "2xl": "1.25rem",
      "3xl": "1.5rem",
      "4xl": "1.875rem",
      "5xl": "2.25rem",
      "6xl": "3rem",
      "7xl": "4rem",
      "8xl": "5rem",
    },
  },
  variants: {
    animation: ["responsive", "motion-safe", "motion-reduce"],
    backgroundColor: ["responsive", "odd", "hover", "focus", "even"],
    borderWidth: ["responsive", "hover", "focus"],
    fontSize: ["responsive", "hover", "focus"],
    extend: {},
    position: ["responsive"],
  },
  plugins: [],
};
