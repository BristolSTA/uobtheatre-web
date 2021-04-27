import config from './config'
import FaIconSet from './plugins/fontawesome.config'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  publicRuntimeConfig: config(),

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'UOB Theatre',
    titleTemplate: '%s - UOB Theatre',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'og:title',
        name: 'og:title',
        content: 'UOB Theatre',
      },
      {
        hid: 'og:site_name',
        name: 'og:site_name',
        content: 'UOB Theatre',
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content:
          'From Aristophanes to Ayckbourn, from Puccini to pantomime, Bristol Student Theatre has it all. Find out about our performances, buy tickets, discover our societies and how to get involved, and sign up to our newsletter to stay updated with all the latest shows.',
      },
      {
        hid: 'description',
        name: 'description',
        content:
          'From Aristophanes to Ayckbourn, from Puccini to pantomime, Bristol Student Theatre has it all. Find out about our performances, buy tickets, discover our societies and how to get involved, and sign up to our newsletter to stay updated with all the latest shows.',
      },
      {
        name: 'keywords',
        content:
          'bristol,student,theatre,performing,arts,university,winston,bristol su',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap',
      },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@360;600&display=swap',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/styles/app.scss', 'leaflet/dist/leaflet.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/vue-filters.js',
    '~/plugins/initial-auth.js',
    '~/plugins/auth-helpers.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',

    // // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',

    // TailwindCSS
    '@nuxtjs/tailwindcss',

    // Font Awesome
    '@nuxtjs/fontawesome',

    // Mirage JS
    '~/modules/mirage',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',

    '@nuxtjs/apollo',
  ],

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Loading Bar
  loading: {
    color: '#FF9F1C',
    height: '5px',
  },

  // Initial SPA Loading Spinner
  loadingIndicator: {
    background: '#2B303A',
  },

  // ESLint
  eslint: {
    fix: true,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  // Apollo Configuration
  apollo: {
    clientConfigs: {
      default: '~/plugins/vue-apollo.config.js',
    },
    // Name of cookie to store token
    tokenName: config().auth.cookie,

    // Sets the authentication type for any authorized request.
    authenticationType: 'JWT',
  },

  // FontAwesome Configuration
  fontawesome: {
    icons: FaIconSet,
  },
}
