// https://v3.nuxtjs.org/api/configuration/nuxt.config
import publicConfig from './config.public';
import eslintPlugin from 'vite-plugin-eslint';

// Define CSS Files to Bundle
const cssFiles = [
  '@fortawesome/fontawesome-svg-core/styles.css',
  'leaflet/dist/leaflet.css'
];

// If we are NOT testing (cypress), we push the app styles
if (process.env.MODE !== 'test') cssFiles.push('@/assets/styles/app.scss');

export default defineNuxtConfig({
  // Define aliases
  alias: {
    '#testSupport': 'tests/unit/support',
    '#testSupport/*': 'tests/unit/support/*'
  },

  // Define third party plugins/modules we are using
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/apollo', '@pinia/nuxt'],

  // Define the runtime config
  runtimeConfig: {
    public: publicConfig()
  },
  // Define app confiugration
  app: {
    head: {
      title: 'UOB Theatre | The Home Of Bristol Student Theatre',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'og:title',
          name: 'og:title',
          content: 'UOB Theatre'
        },
        {
          hid: 'og:site_name',
          name: 'og:site_name',
          content: 'UOB Theatre'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content:
            'From Aristophanes to Ayckbourn, from Puccini to pantomime, Bristol Student Theatre has it all. Find out about our performances, buy tickets, discover our societies and how to get involved, and sign up to our newsletter to stay updated with all the latest shows.'
        },
        {
          hid: 'description',
          name: 'description',
          content:
            'From Aristophanes to Ayckbourn, from Puccini to pantomime, Bristol Student Theatre has it all. Find out about our performances, buy tickets, discover our societies and how to get involved, and sign up to our newsletter to stay updated with all the latest shows.'
        },
        {
          name: 'keywords',
          content:
            'bristol,student,theatre,performing,arts,university,winston,bristol su'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap'
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@360;600&display=swap'
        }
      ]
    }
  },

  // Set the CSS Files
  css: cssFiles,

  // Tailwind module configuration
  tailwindcss: {
    exposeConfig: true
  },

  // Vite configuration
  vite: {
    plugins: [eslintPlugin()]
  },

  // Disable Server-Side-Rendering
  ssr: false,

  // Configure Build Options
  build: {
    transpile: [
      '@fortawesome/vue-fontawesome',
      '@fortawesome/fontawesome-svg-core',
      '@fortawesome/free-regular-svg-icons',
      '@fortawesome/free-brands-svg-icons',
      '@vuepic/vue-datepicker'
    ]
  },

  // Configure Apollo (GraphQL) module
  apollo: {
    authType: 'JWT',
    tokenStorage: 'localStorage',
    clients: {
      default: {
        tokenName: publicConfig().auth.cookieName,
        httpEndpoint: publicConfig().api.graphqlEndpointInternal,
        browserHttpEndpoint: publicConfig().api.graphqlEndpoint
      }
    }
  },

  // Configure Typescript
  typescript: {
    tsConfig: {
      types: ['node', '@types/lodash'],
      exclude: ['../graphql/codegen/operations.ts']
    }
  },

  sourcemap: {
    client: true
  }
});
