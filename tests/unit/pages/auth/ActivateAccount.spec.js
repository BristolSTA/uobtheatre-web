import { expect, vi } from 'vitest';
import MatchMediaMock from 'vitest-matchmedia-mock';

import { mount } from '#testSupport/helpers';

import ActivateAccount from '@/pages/login/activate/[token]/index.vue';
import { swalToast } from '@/utils/alerts';
import useAuthStore from '@/store/auth';
import ValidationError from '~~/errors/ValidationError';
import { flushPromises } from '@vue/test-utils';

describe('Activate Account', function () {
  let component;

  beforeEach(async () => {
    new MatchMediaMock();
  });

  it('activates account with valid token', async () => {
    const swalToastStub = vi.spyOn(swalToast, 'fire');
    component = await mount(ActivateAccount, {
      shallow: false,
      routeInfo: {
        params: {
          token: '1234abcd'
        }
      }
    });

    expect(component.text()).to.contain('Activating your account');
    expect(component.text()).not.to.contain('error');

    await component.vm.$nextTick();

    const authStore = useAuthStore();
    expect(authStore.activateAccount).toHaveBeenCalledWith('1234abcd');

    expect(swalToastStub.mock.calls).length(1);

    const router = useRouter();
    expect(router.push).toHaveBeenCalledWith('/login');
  });

  it('shows error with invalid token', async () => {
    component = await mount(ActivateAccount, {
      shallow: false,
      routeInfo: {
        params: {
          token: 'invalidCode'
        }
      },
      preMount: () => {
        const authStore = useAuthStore();
        authStore.activateAccount.mockRejectedValueOnce(
          new ValidationError('There was an error')
        );
      }
    });

    await flushPromises();
    await component.vm.$nextTick();
    expect(component.text()).to.contain('There was an error');
  });
});
