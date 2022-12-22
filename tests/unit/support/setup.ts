import { config } from '@vue/test-utils';
import { NuxtLinkStub } from './stubs';
import { vi } from 'vitest';
import path from 'path';

// Loads testing environment settings
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.test') });

// Stub out the "defineNuxtComponent" composable (this has to be done here to pre-empt any imports)
vi.stubGlobal('defineNuxtComponent', (opts: any) => opts);
vi.stubGlobal('definePageMeta', vi.fn());

// Globally stub the font awesome icon component
config.global.stubs = {
  'font-awesome-icon': true,
  Head: true,
  Title: true
};

// Globally register some fake Nuxt components
config.global.components = {
  NuxtLink: NuxtLinkStub
};
