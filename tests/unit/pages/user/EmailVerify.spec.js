import { expect } from 'vitest';
import { mount } from '#testSupport/helpers';

import {
  GenericApolloResponse,
  GenericMutationResponse,
  GenericErrorsResponse
} from '#testSupport/helpers/api';
import EmailVerify from '@/pages/user/email-verify/[token]/index.vue';
import { flushPromises } from '@vue/test-utils';

describe('Email Verify', function () {
  let component;

  const mountComponent = (apolloyResponseInner) => {
    component = mount(EmailVerify, {
      apollo: {
        mutationResponses: [
          GenericApolloResponse('verifyAccount', apolloyResponseInner)
        ]
      },
      routeInfo: {
        params: {
          token: '1234abcd'
        }
      }
    });
  };

  it('verifies an account with valid token', async () => {
    mountComponent(GenericMutationResponse());

    expect(component.text()).to.contain('Verifying email');

    await flushPromises();

    const router = useRouter();
    expect(router.replace).toHaveBeenCalledWith('/login');
  });

  it('shows error with invalid token', async () => {
    mountComponent(GenericErrorsResponse());

    await flushPromises();
    expect(component.text()).to.contain('There was an error');
  });
});
