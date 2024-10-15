import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.{js,jsx,ts,tsx}",
    "./public/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
};
