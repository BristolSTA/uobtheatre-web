import { mount } from '@vue/test-utils';
import { expect } from 'chai';

import { authService } from '@/services';
import { swalToast } from '@/utils';
import ActivateAccount from '@/views/auth/ActivateAccount.vue';

import { executeWithServer, waitFor } from '../../helpers';

describe('Activate Account', function () {
  let component, server;

  let loggedInSpy = jest.spyOn(authService, 'isLoggedIn');

  beforeAll(async () => {
    server = await executeWithServer(() => {}, false);
  });

  afterAll(() => {
    server.shutdown();
  });

  it('redirects if user is already authenticated', async () => {
    // Mock Auth service
    loggedInSpy.mockReturnValueOnce(true);

    let next = jest.fn();

    // Call guard
    ActivateAccount.beforeRouteEnter.call(
      undefined,
      undefined,
      undefined,
      next
    );

    // Should redirect to named "home" route
    expect(next.mock.calls[0][0].name).equal('home');
  });

  it('doesnt redirect if not logged in', async () => {
    // Mock Auth service
    loggedInSpy.mockReturnValueOnce(false);

    let next = jest.fn();

    // Call guard
    ActivateAccount.beforeRouteEnter.call(
      undefined,
      undefined,
      undefined,
      next
    );

    // Should have no params
    expect(next.mock.calls[0]).to.be.empty;
  });

  it('activates account with valid token', async () => {
    let routerPushFake;
    let activateAccountStub = jest.spyOn(authService, 'activateAccount');
    let swalToastStub = jest.spyOn(swalToast, 'fire');
    component = mount(ActivateAccount, {
      propsData: {
        activationToken: '1234abcd',
      },
      mocks: {
        $router: {
          push: (routerPushFake = jest.fn()),
        },
      },
    });

    expect(component.text()).to.contain('Activating your account');
    expect(component.text()).not.to.contain('error');

    return waitFor(() => routerPushFake.mock.calls.length > 0).then(() => {
      expect(activateAccountStub.mock.calls).length(1);
      expect(activateAccountStub.mock.calls[0][0]).includes({
        token: '1234abcd',
      });

      expect(swalToastStub.mock.calls).length(1);

      expect(routerPushFake.mock.calls).length(1);
      expect(routerPushFake.mock.calls[0][0]).includes({
        name: 'login',
      });
    });
  });

  it('shows error with invalid token', async () => {
    component = mount(ActivateAccount, {
      propsData: {
        activationToken: 'invalidCode',
      },
    });

    return waitFor(() => component.vm.error).then(() => {
      expect(component.text()).to.contain('There was an error');
    });
  });
});
