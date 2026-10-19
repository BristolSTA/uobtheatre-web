import { mount } from '@vue/test-utils';
import { expect, it } from 'vitest';
import SensitiveText from '@/components/ui/SensitiveText.vue';

describe('SensitiveText', () => {
  it('marks content for Sentry masking', () => {
    const wrapper = mount(SensitiveText, {
      slots: { default: 'private value' }
    });

    expect(wrapper.classes()).toContain('sentry-mask');
    expect(wrapper.text()).toBe('private value');
  });
});
