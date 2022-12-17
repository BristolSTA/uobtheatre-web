import { mount } from '@vue/test-utils';
import { expect } from 'vitest';

import TextInput from '@/components/ui/Input/UiInputText.vue';
import { fakeValidationErrors } from '#testSupport/fixtures/instances/FakeErrors';

describe('TextInput', () => {
  let component;
  const input = () => component.find('input');

  beforeEach(() => {
    component = mount(TextInput, {
      props: {
        name: 'An input',
        value: null
      }
    });
  });

  it('has correct elements', () => {
    expect(component.find('label').text()).to.contain('An input');
    const inputs = component.findAll('input');
    expect(inputs.length).to.eq(1);

    expect(inputs[0].attributes()).to.include({
      id: 'anInput',
      name: 'anInput',
      type: 'text'
    });
  });

  it('generates appropriate form id and name', async () => {
    await component.setProps({
      name: 'Email'
    });
    expect(input().attributes('id')).to.eq('email');
    expect(input().attributes('name')).to.eq('email');

    await component.setProps({
      name: 'A Seperated Label'
    });
    expect(input().attributes('id')).to.eq('aSeperatedLabel');
    expect(input().attributes('name')).to.eq('aSeperatedLabel');
  });

  it('can set an autocomplete value', async () => {
    await component.setProps({
      autocomplete: 'current-password none'
    });
    expect(input().attributes('autocomplete')).to.eq('current-password none');
  });

  it('can set its type', async () => {
    await component.setProps({
      type: 'password'
    });
    expect(input().attributes('type')).to.eq('password');
  });

  it('sets its initial value', async () => {
    await component.setProps({
      modelValue: 'Hello world'
    });
    await component.vm.$nextTick();
    expect(input().element.value).to.eq('Hello world');
  });

  it('outputs text input event', () => {
    expect(component.emitted().input).to.not.be.ok;
    input().trigger('input');
    expect(component.emitted().input).to.be.ok;
  });

  it('can display its errors', async () => {
    expect(component.text()).not.to.contain('An error on the anInput field');

    await component.setProps({
      errors: fakeValidationErrors(['anInput'])
    });

    expect(component.text()).to.contain('An error on the anInput field');

    // Check behavior on typing
    input().trigger('input');
    await component.vm.$forceUpdate();
    expect(component.text()).not.to.contain('An error on the anInput field');
  });
});
