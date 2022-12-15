import { config } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';

// Globally use a pinia mock
config.global.plugins = [createTestingPinia()];

// Globally stub the font awesome icon component
config.global.stubs = { 'font-awesome-icon': true };
