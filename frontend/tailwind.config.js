/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      md: "768px",
      lg: "976px",
      xl: "1300px",
    },

    fontFamily: {
      Poppins: ["Poppins", "sans-serif"],
    },

    extend: {
      colors: {
        Primary: "#00B207",
        SoftPrimary: "#84D187",
        HardPrimary: "#2C742F",
        Warning: "#FF8A00",
        Danger: "#EA4B48",
        White: "#FFFFFF",
        Gray900: "#1A1A1A",
        Gray800: "#333333",
        Gray700: "#4D4D4D",
        Gray600: "#666666",
        Gray500: "#808080",
        Gray400: "#999999",
        Gray300: "#B3B3B3",
        Gray200: "#CCCCCC",
        Gray100: "#E6E6E6",
        Gray50: "#F2F2F2",
        GreenGray900: "#002603",
        GreenGray800: "#173B1A",
        GreenGray700: "#2B572E",
        GreenGray600: "#406B42",
        GreenGray500: "#618062",
        GreenGray400: "#7A997C",
        GreenGray300: "#96B297",
        GreenGray200: "#B4CCB4",
        GreenGray100: "#DAE5DA",
        GreenGray50: "#EDF2EE",
    },
    },
  },
  plugins: [],
}


