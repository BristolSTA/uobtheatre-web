import { config } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { NuxtLinkStub } from './stubs';

// Globally use a pinia mock
config.global.plugins = [createTestingPinia()];

// Globally stub the font awesome icon component
config.global.stubs = {
  'font-awesome-icon': true
};

// Globally register some fake Nuxt components
config.global.components = {
  NuxtLink: NuxtLinkStub
};
