module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      light: '#F9FAFB',
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
