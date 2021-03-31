import { DateTime } from 'luxon'
import Vue from 'vue'

import config from '@/config'

// Constants

Vue.prototype.$appName = config.application.name

// Filters

Vue.filter('dateFormat', (date, format) => {
  date = date instanceof DateTime ? date : DateTime.fromISO(date)
  return date.toFormat(format)
})

Vue.filter('truncate', (text, length, clamp) => {
  clamp = clamp || '...'
  const node = document.createElement('div')
  node.innerHTML = text
  const content = node.textContent
  return content.length > length ? content.slice(0, length) + clamp : content
})
