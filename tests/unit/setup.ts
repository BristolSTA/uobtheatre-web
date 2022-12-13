// // @ts-nocheck
// import 'regenerator-runtime/runtime';
// import path from 'path';
// import Vue from 'vue';
// import config from '~~/config.public';
// import FiltersPlugin from '~/plugins/vue-filters';
// global.fetch = require('cross-fetch');

// // Load test .env
// require('dotenv').config({ path: path.resolve(process.cwd(), '.env.test') });

// // Load globally required stubs & plugins
// Vue.component('FontAwesomeIcon', {
//   template: '<a></a>',
// });

// FiltersPlugin(
//   {
//     $config: config(),
//   },
//   () => {}
// );

import { config } from '@vue/test-utils';
import { vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';

vi.stubGlobal('useRoute', () => ({}));
vi.stubGlobal('useRouter', () => ({}));
config.global.plugins = [createTestingPinia()];
config.global.stubs = { 'font-awesome-icon': true };
