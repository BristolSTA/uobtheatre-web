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
        default: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
      },
    },
    extend: {
      colors: {
        'sta-gray': {
          default: '#2B303A',
          dark: '#23272A',
          light: '#3D434E',
        },
        'sta-rouge': {
          default: '#FF6978',
          dark: '#CC3645',
        },
        'sta-green': {
          default: '#4B8F8C',
          dark: '#185C59',
        },
        'sta-orange': {
          default: '#FF9F1C',
          dark: '#CC6C00',
        },
      },
      opacity: {
        40: '0.4',
      },
      fontSize: {
        h1: '3rem',
      },
    },
  },
  variants: {},
  plugins: [],
};
