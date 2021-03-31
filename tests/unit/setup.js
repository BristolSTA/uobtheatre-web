import 'regenerator-runtime/runtime'
import path from 'path'
import Vue from 'vue'
global.fetch = require('cross-fetch')

// Load test .env
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.test') })

// Load globally required stubs & plugins
Vue.component('FontAwesomeIcon', {
  template: '<a></a>',
})
import('@/plugins/vue-filters')
