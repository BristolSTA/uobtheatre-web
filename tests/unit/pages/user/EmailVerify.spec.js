import { expect } from 'vitest';
import { mount } from '#testSupport/helpers';

import {
  GenericApolloResponse,
  GenericMutationResponse,
  GenericErrorsResponse
} from '#testSupport/helpers/api';
import { flushPromises } from '@vue/test-utils';

import EmailChangeActivate from '@/pages/user/email-verify/[token]/index.vue';

describe('Email Change Activate', function () {
  let component;

  const mountComponent = async (apolloResponses) => {
    component = await mount(EmailChangeActivate, {
      shallow: false,
      apollo: {
        mutationResponses: apolloResponses
      },
      routeInfo: {
        params: {
          token: '1234abcd'
        }
      }
    });
  };

  it('adds secondary email with valid token', async () => {
    await mountComponent([
      GenericApolloResponse('verifySecondaryEmail', GenericMutationResponse())
    ]);

    expect(component.text()).to.contain('Adding email');

    await flushPromises();
    await component.vm.$nextTick();

    expect(component.text()).to.contain('Complete email change');
    expect(component.findAll('input')).length(1);
  });

  it('shows error with invalid token', async () => {
    await mountComponent([
      GenericApolloResponse('verifySecondaryEmail', GenericErrorsResponse())
    ]);

    await flushPromises();
    await component.vm.$nextTick();

    expect(component.text()).to.contain('There was an error');
  });

  describe('with added secondary email', () => {
    let replaceStub;
    beforeEach(async () => {
      await mountComponent([
        GenericApolloResponse(
          'verifySecondaryEmail',
          GenericMutationResponse()
        ),
        GenericApolloResponse('swapEmails', GenericMutationResponse()),
        GenericApolloResponse('removeSecondaryEmail', GenericMutationResponse())
      ]);

      await flushPromises();
      await component.vm.$nextTick();
    });

    it('can enter password to swap', async () => {
      component.find('input').setValue('mypassword');
      await component.find('form').trigger('submit');

      await flushPromises();
      await component.vm.$nextTick();

      const router = useRouter();
      expect(router.replace).toHaveBeenCalledWith('/user');
    });
  });
});
