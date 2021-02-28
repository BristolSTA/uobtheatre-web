import { shallowMount } from '@vue/test-utils';
import { expect } from 'chai';

import { authService } from '@/services';
import { swal, swalToast } from '@/utils';
import ForgotPassword from '@/views/auth/ForgotPassword.vue';

import {
  executeWithServer,
  generateMountOptions,
  mountWithRouterMock,
} from '../../helpers';

describe('Forgot Password', function () {
  let forgotPasswordComponent, server;

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
    forgotPasswordComponent = shallowMount(
      ForgotPassword,
      generateMountOptions(['router'], {
        mocks: {
          $route: {
            query: {},
          },
        },
      })
    );

    // Call guard
    ForgotPassword.beforeRouteEnter.call(
      forgotPasswordComponent.vm,
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
    forgotPasswordComponent = generateMountOptions(['router'], {
      mocks: {
        $route: {
          query: {},
        },
      },
    });

    // Call guard
    ForgotPassword.beforeRouteEnter.call(
      forgotPasswordComponent.vm,
      undefined,
      undefined,
      next
    );

    // Should have no params
    expect(next.mock.calls[0]).to.be.empty;
  });

  describe('without reset token', () => {
    let swalStub = jest.spyOn(swal, 'fire');
    beforeEach(async () => {
      jest.spyOn(authService, 'requestPasswordReset');
      forgotPasswordComponent = await mountWithRouterMock(ForgotPassword, {
        mocks: {
          $route: {
            query: {},
          },
        },
      });
    });

    it('shows email address input form', () => {
      expect(forgotPasswordComponent.find('input#email').exists()).to.be.true;
    });

    it('can request reset', async () => {
      let requestResetStub = jest
        .spyOn(forgotPasswordComponent.vm, 'requestReset')
        .mockImplementation(() => {});

      await forgotPasswordComponent
        .find('input#email')
        .setValue('joe.bloggs@example.org');
      forgotPasswordComponent.find('form').trigger('submit');

      expect(requestResetStub.mock.calls).length(1);
      requestResetStub.mockRestore();

      await forgotPasswordComponent.vm.requestReset();

      expect(authService.requestPasswordReset.mock.calls).length(1);
      expect(authService.requestPasswordReset.mock.calls[0][0]).to.include({
        email: 'joe.bloggs@example.org',
      });
      expect(swalStub.mock.calls).length(1);
    });
  });

  describe('with invalid reset token', () => {
    let resetStub = jest.spyOn(authService, 'resetPassword');
    beforeEach(async () => {
      resetStub.mockClear();
      forgotPasswordComponent = await mountWithRouterMock(ForgotPassword, {
        mocks: {
          $route: {
            query: {
              resetToken: '123',
            },
          },
        },
      });
    });

    it('shows error message when resetting', async () => {
      await forgotPasswordComponent
        .find('input#newPassword1')
        .setValue('example1234');
      await forgotPasswordComponent
        .find('input#newPassword2')
        .setValue('example1234');

      await forgotPasswordComponent.vm.resetPassword();
      await forgotPasswordComponent.vm.$nextTick();

      expect(forgotPasswordComponent.text()).to.contain(
        'Invalid Password Reset Token'
      );
    });
  });

  describe('with reset token', () => {
    let swalToastStub = jest.spyOn(swalToast, 'fire');
    let resetStub = jest.spyOn(authService, 'resetPassword');
    let routerPushFake;
    beforeEach(async () => {
      resetStub.mockClear();
      swalToastStub.mockClear();
      forgotPasswordComponent = await mountWithRouterMock(ForgotPassword, {
        mocks: {
          $router: {
            push: (routerPushFake = jest.fn()),
          },
          $route: {
            query: {
              resetToken: '1234abcd',
            },
          },
        },
      });
    });

    it('shows errors', async () => {
      await forgotPasswordComponent
        .find('input#newPassword1')
        .setValue('example1234');
      await forgotPasswordComponent
        .find('input#newPassword2')
        .setValue('example123');

      await forgotPasswordComponent.vm.resetPassword();

      expect(forgotPasswordComponent.text()).to.contain(
        'Your confirmed password does not match!'
      );
    });

    it('can reset password', async () => {
      let resetStub = jest
        .spyOn(forgotPasswordComponent.vm, 'resetPassword')
        .mockImplementation(() => {});

      await forgotPasswordComponent
        .find('input#newPassword1')
        .setValue('example1234');
      await forgotPasswordComponent
        .find('input#newPassword2')
        .setValue('example1234');
      forgotPasswordComponent.find('form').trigger('submit');

      expect(resetStub.mock.calls).length(1);
      resetStub.mockRestore();

      await forgotPasswordComponent.vm.resetPassword();

      expect(authService.resetPassword.mock.calls).length(1);
      expect(authService.resetPassword.mock.calls[0][0]).to.include({
        token: '1234abcd',
        password: 'example1234',
        confirmedPassword: 'example1234',
      });
      expect(swalToastStub.mock.calls).length(1);
      expect(routerPushFake.mock.calls).length(1);
      expect(routerPushFake.mock.calls[0][0]).to.include({ name: 'login' });
    });
  });
});
