module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: [],
  theme: {
    fontFamily: {
      body: ['Montserrat', 'sans-serif'],
      mono: ['"Roboto Mono"', 'monospace'],
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
          lighter: '#908e89',
          lightest: '#cecdca',
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
          light: '#ffb833',
        },
      },
      opacity: {
        40: '0.4',
      },
      fontSize: {
        h1: '2.5rem',
        h2: '2rem',
        h3: '1.5rem',
        h4: '1.25rem',
      },
      minWidth: {
        '1/2': '50%',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['checked', 'odd', 'even'],
      flexDirection: ['odd'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
