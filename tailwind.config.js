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
        // Fliq brand colors - updated to match brand palette
        brand: {
          green: '#6CC04A',
          greenDark: '#57A73D',
          black: '#000000',
          white: '#FFFFFF',
          gray: '#666666',
          lightGray: '#B5B5B5',
          bgGray: '#F5F5F5',
          border: '#E5E5E5',
        },
        // Legacy colors for backwards compatibility
        'fliq-green': '#6CC04A',
        'fliq-dark': '#000000',
        'fliq-gray': '#666666', 
        'fliq-light-gray': '#B5B5B5',
        'fliq-bg-gray': '#F5F5F5',
        'fliq-border': '#E5E5E5',
      },
    },
  },
  plugins: [],
}
