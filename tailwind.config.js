/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-color": "#1F2937",
        "secondary-color": "#D8D9DA",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
