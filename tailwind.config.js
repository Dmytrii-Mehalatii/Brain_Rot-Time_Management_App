/** @type {import('tailwindcss').Config} */

// colors.ts is an ES module; depending on the loader it arrives as the module namespace or the default export.
const colorsModule = require("./constants/colors");
const colors = colorsModule.default ?? colorsModule;

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
    },
  },
  plugins: [],
};
