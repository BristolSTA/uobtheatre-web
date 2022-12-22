import { expect, vi } from 'vitest';
import { mount } from '#testSupport/helpers';

import ChangePassword from '@/components/user/ChangePassword.vue';
import NonFieldError from '~~/components/ui/UiNonFieldError.vue';
import GenericApolloResponse from '#testSupport/fixtures/support/GenericApolloResponse';
import GenericMutationResponse from '#testSupport/fixtures/support/GenericMutationResponse';
import GenericError from '#testSupport/fixtures/support/GenericError';
import GenericErrorsResponse from '#testSupport/fixtures/support/GenericErrorsResponse';
import { swalToast } from '~/utils/alerts';
import { flushPromises } from '@vue/test-utils';

describe('Change Password', () => {
  it('can update their password', async () => {
    const component = await mount(ChangePassword, {
      shallow: false,
      apollo: {
        mutationResponses: [
          GenericApolloResponse('passwordChange', GenericMutationResponse())
        ]
      }
    });
    const stub = vi.spyOn(swalToast, 'fire');
    const inputs = component.findAll('input');
    inputs.at(0).setValue('oldPassword');
    inputs.at(1).setValue('newPassword');
    inputs.at(2).setValue('newPassword');
    await component.find('form').trigger('submit');

    await component.vm.$nextTick();
    expect(stub.mock.calls).length(1);

    expect(component.emitted('cancel')).length(1);
  });

  it('can show errors', async () => {
    const component = await mount(ChangePassword, {
      shallow: false,
      apollo: {
        mutationResponses: [
          GenericApolloResponse(
            'passwordChange',
            GenericErrorsResponse(GenericError('Passwords dont match'))
          )
        ]
      }
    });
    expect(component.findComponent(NonFieldError).exists()).to.be.true;

    const inputs = component.findAll('input');
    inputs.at(0).setValue('oldPassword');
    inputs.at(1).setValue('newPassword');
    inputs.at(2).setValue('newPasswordDoesntMatch');
    await component.find('form').trigger('submit');

    await flushPromises();

    expect(component.text()).to.contain('Passwords dont match');
  });
});
