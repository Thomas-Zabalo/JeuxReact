// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Inclure vos fichiers source
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",  // Inclure les composants de flowbite-react
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin'),  // Utiliser le plugin Flowbite
  ],
}
