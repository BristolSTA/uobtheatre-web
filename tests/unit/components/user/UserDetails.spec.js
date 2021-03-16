import { mount } from '@vue/test-utils';
import { expect } from 'chai';

import TextInput from '@/components/ui/TextInput.vue';
import ChangeEmail from '@/components/user/ChangeEmail.vue';
import ChangePassword from '@/components/user/ChangePassword.vue';
import UserDetails from '@/components/user/UserDetails.vue';
import { swalToast } from '@/utils';

import {
  executeWithServer,
  generateMountOptions,
  waitFor,
} from '../../helpers';

describe('User Details', () => {
  let component, server;
  beforeAll(async () => {
    server = await executeWithServer(null, false);
  });
  afterAll(() => {
    server.shutdown();
  });

  beforeEach(() => {
    component = mount(
      UserDetails,
      generateMountOptions(['apollo'], {
        propsData: {
          user: {
            firstName: 'Joe',
            lastName: 'Bloggs',
            email: 'joe.bloggs@example.org',
          },
        },
      })
    );
  });

  it('shows user details when not editing', () => {
    expect(component.text()).to.contain('Joe');
    expect(component.text()).to.contain('Bloggs');
    expect(component.text()).to.contain('joe.bloggs@example.org');
  });

  it('shows can start editing', async () => {
    let button = component.find('button');
    expect(button.text()).to.contain('Edit Details');

    await button.trigger('click');

    expect(component.vm.editing).to.be.true;
    expect(component.findAllComponents(TextInput)).length(2);
  });

  describe('while editing', () => {
    beforeEach(async () => {
      await component.setData({
        editing: true,
      });
    });
    it('can update their name', async () => {
      let swalToastStub = jest.spyOn(swalToast, 'fire');
      let firstNameInput = component.find('input');
      let lastNameInput = component.findAll('input').at(1);

      expect(firstNameInput.element.value).to.eq('Joe');
      expect(lastNameInput.element.value).to.eq('Bloggs');

      firstNameInput.setValue('Joes');
      lastNameInput.setValue('Blogger');

      component.find('form').trigger('submit');

      await waitFor(() => swalToastStub.mock.calls.length);

      expect(swalToastStub.mock.calls).length(1);
    });
    it('can cancel update', async () => {
      await component.findAll('button').at(3).trigger('click');
      expect(component.findAllComponents(TextInput)).length(0);
      expect(component.vm.editing).to.be.false;
    });
    it('can update their email', async () => {
      await component.findAll('button').at(0).trigger('click');
      expect(component.findComponent(ChangeEmail).exists()).to.be.true;
    });
    it('can update their password', async () => {
      await component.findAll('button').at(1).trigger('click');
      expect(component.findComponent(ChangePassword).exists()).to.be.true;
    });
  });
});
