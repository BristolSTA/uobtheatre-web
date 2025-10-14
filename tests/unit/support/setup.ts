import { config } from '@vue/test-utils';
import { NuxtLinkStub } from './stubs';
import { vi } from 'vitest';
import path from 'path';

// Loads testing environment settings
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.test') });

// Stub out the "defineNuxtComponent" composable (this has to be done here to pre-empt any imports)
vi.stubGlobal('defineNuxtComponent', (opts: any) => opts);
vi.stubGlobal('definePageMeta', vi.fn());

// Stub out "defineAppConfig" for helpers/mount.ts
vi.stubGlobal('defineAppConfig', (options: any) => options);

// Globally stub the font awesome icon component
config.global.stubs = {
  'font-awesome-icon': true,
  Head: true,
  Title: true,
  Meta: true,
  LayoutSiteMessageModal: true,
  UModal: {
    name: 'UModalStub',
    props: {
      open: { type: Boolean, default: false },
      dismissible: { type: Boolean, default: true },
      close: { type: Boolean, default: true }
    },
    emits: ['update:open', 'after:leave'],
    template: `
      <div class="u-modal-stub" v-if="open">
        <slot name="content" />
      </div>
      `
  }
};

// Globally register some fake Nuxt components
config.global.components = {
  NuxtLink: NuxtLinkStub
};
