import Vue from 'vue'
import VueGtag from 'vue-gtag'

export default (context) => {
  Vue.use(VueGtag, {
    config: { id: context.$config.services.googleAnalytics.id }
  })
}
