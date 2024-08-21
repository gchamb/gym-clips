/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "egoist-black": "#151515",
        "egoist-red": "#A91D3A",
        "egoist-white": "#EEEEEE",
      },
      backgroundColor: {
        "egoist-black": "#151515",
        "egoist-red": "#A91D3A",
        "egoist-white": "#EEEEEE",
      },
    },
  },
  plugins: [],
};
