module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: [],
  theme: {
    fontFamily: {
      body: ['Montserrat', 'sans-serif'],
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
      },
    },
    extend: {
      colors: {
        'sta-gray': {
          DEFAULT: '#2B303A',
          dark: '#23272A',
          light: '#3D434E',
          lighter: '#8D8B86',
        },
        'sta-rouge': {
          DEFAULT: '#FF6978',
          dark: '#CC3645',
        },
        'sta-green': {
          DEFAULT: '#4B8F8C',
          dark: '#185C59',
        },
        'sta-orange': {
          DEFAULT: '#FF9F1C',
          dark: '#CC6C00',
        },
      },
      opacity: {
        40: '0.4',
      },
      fontSize: {
        h1: '3rem',
        h2: '2rem',
        h3: '1rem',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['checked', 'odd', 'even'],
    },
  },
  plugins: [],
};
