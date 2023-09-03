/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-color": "#61677A",
        "secondary-color": "#D8D9DA",
      },
    },
  },
  plugins: [],
};
