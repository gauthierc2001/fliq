/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Fliq brand colors
        'fliq-green': '#57C84D',
        'fliq-dark': '#0F0F0F',
        'fliq-gray': '#555555', 
        'fliq-light-gray': '#B5B5B5',
        'fliq-bg-gray': '#F5F5F5',
        'fliq-border': '#E5E5E5',
      },
    },
  },
  plugins: [],
}
