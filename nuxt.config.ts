// https://v3.nuxtjs.org/api/configuration/nuxt.config
import publicConfig from './config.public';
// import eslintPlugin from 'vite-plugin-eslint';

const cssFiles = [
  '@fortawesome/fontawesome-svg-core/styles.css',
  'leaflet/dist/leaflet.css'
];

if (process.env.MODE !== 'test') cssFiles.push('@/assets/styles/app.scss');

export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/apollo', '@pinia/nuxt'],

  runtimeConfig: {
    public: publicConfig()
  },

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

  css: cssFiles,

  tailwindcss: {
    exposeConfig: true
  },

  vite: {
    // plugins: [eslintPlugin()]
  },

  ssr: false,

  build: {
    transpile: [
      '@fortawesome/vue-fontawesome',
      '@fortawesome/fontawesome-svg-core',
      '@fortawesome/free-regular-svg-icons',
      '@fortawesome/free-brands-svg-icons',
      '@vuepic/vue-datepicker'
    ]
  },

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

  typescript: {
    tsConfig: {
      types: ['node', '@types/lodash']
    }
  }
});
