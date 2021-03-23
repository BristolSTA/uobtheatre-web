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
  let userDetailsComponent, server;
  beforeAll(async () => {
    server = await executeWithServer(null, false);
  });
  afterAll(() => {
    server.shutdown();
  });

  beforeEach(() => {
    userDetailsComponent = mount(
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
    expect(userDetailsComponent.text()).to.contain('Joe');
    expect(userDetailsComponent.text()).to.contain('Bloggs');
    expect(userDetailsComponent.text()).to.contain('joe.bloggs@example.org');
  });

  it('shows can start editing', async () => {
    let button = userDetailsComponent.find('button');
    expect(button.text()).to.contain('Edit Details');

    await button.trigger('click');

    expect(userDetailsComponent.vm.editing).to.be.true;
    expect(userDetailsComponent.findAllComponents(TextInput)).length(2);
  });

  describe('while editing', () => {
    beforeEach(async () => {
      await userDetailsComponent.setData({
        editing: true,
      });
    });
    it('can update their name', async () => {
      let swalToastStub = jest.spyOn(swalToast, 'fire');
      let firstNameInput = userDetailsComponent.find('input');
      let lastNameInput = userDetailsComponent.findAll('input').at(1);

      expect(firstNameInput.element.value).to.eq('Joe');
      expect(lastNameInput.element.value).to.eq('Bloggs');

      firstNameInput.setValue('Joes');
      lastNameInput.setValue('Blogger');

      userDetailsComponent.find('form').trigger('submit');

      await waitFor(() => swalToastStub.mock.calls.length);

      expect(swalToastStub.mock.calls).length(1);
    });
    it('can cancel update', async () => {
      await userDetailsComponent.findAll('button').at(3).trigger('click');
      expect(userDetailsComponent.findAllComponents(TextInput)).length(0);
      expect(userDetailsComponent.vm.editing).to.be.false;
    });
    it('can update their email', async () => {
      await userDetailsComponent.findAll('button').at(0).trigger('click');
      expect(userDetailsComponent.findComponent(ChangeEmail).exists()).to.be
        .true;
    });
    it('can update their password', async () => {
      await userDetailsComponent.findAll('button').at(1).trigger('click');
      expect(userDetailsComponent.findComponent(ChangePassword).exists()).to.be
        .true;
    });
  });
});
