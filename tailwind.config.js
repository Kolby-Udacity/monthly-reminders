module.exports = {
  purge: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/features/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      light: '#F9FAFB',
      dark: '#262727',
      red: '#E85454',
      blue: '#5D71BE',
      green: '#5DBE78',
      white: '#FFFFFF',
      black: '#000000',
      gray: '#dddddd',
    },
    extend: {
      width: {
        150: '600px',
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      boxShadow: ['active'],
    },
  },
  plugins: [],
};
