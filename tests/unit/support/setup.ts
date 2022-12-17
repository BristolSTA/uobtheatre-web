import { config } from '@vue/test-utils';
import { NuxtLinkStub } from './stubs';
import { vi } from 'vitest';

// Stub out the "defineNuxtComponent" composabel
vi.stubGlobal('defineNuxtComponent', (opts: any) => opts);

// Globally stub the font awesome icon component
config.global.stubs = {
  'font-awesome-icon': true
};

// Globally register some fake Nuxt components
config.global.components = {
  NuxtLink: NuxtLinkStub
};
