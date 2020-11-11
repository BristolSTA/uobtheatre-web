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
    extend: {
      colors: {
        sta: {
          gray: {
            regular: '#2B303A',
            dark: '#23272A',
            light: '#707070',
          },
          rouge: '#FF6978',
          green: '#FF6978',
          orange: '#FF9F1C',
        },
      },
    },
  },
  variants: {},
  plugins: [],
};
