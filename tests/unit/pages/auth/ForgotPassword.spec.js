import { expect } from 'chai';

import {
  generateApolloMock,
  generateMountOptions,
  mountWithRouterMock,
} from '../../helpers';
import GenericApolloResponse from '../../fixtures/support/GenericApolloResponse';
import GenericMutationResponse from '../../fixtures/support/GenericMutationResponse';
import GenericErrorsResponse from '../../fixtures/support/GenericErrorsResponse';
import GenericError from '../../fixtures/support/GenericError';
import ForgotPassword from '@/pages/login/forgot/index.vue';
import { swal, swalToast } from '@/utils';
import { authService } from '@/services';

describe('Forgot Password', function () {
  let forgotPasswordComponent;

  it('redirects if user is already authenticated', () => {
    expect(ForgotPassword.middleware).to.include('not-authed');
  });

  describe('without reset token', () => {
    const swalStub = jest.spyOn(swal, 'fire');
    beforeEach(async () => {
      jest.spyOn(authService, 'requestPasswordReset');
      forgotPasswordComponent = await mountWithRouterMock(
        ForgotPassword,
        generateMountOptions(['apollo'], {
          mocks: {
            $route: {
              query: {},
            },
          },
          apollo: {
            mutationCallstack: [
              GenericApolloResponse(
                'sendPasswordResetEmail',
                GenericMutationResponse()
              ),
            ],
          },
        })
      );
    });

    it('shows email address input form', () => {
      expect(forgotPasswordComponent.find('input#email').exists()).to.be.true;
    });

    it('can request reset', async () => {
      const requestResetStub = jest
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
      expect(authService.requestPasswordReset.mock.calls[0][1]).to.include({
        email: 'joe.bloggs@example.org',
      });
      expect(swalStub.mock.calls).length(1);
    });
  });

  describe('with invalid reset token', () => {
    beforeEach(async () => {
      forgotPasswordComponent = await mountWithRouterMock(
        ForgotPassword,
        generateMountOptions(['apollo'], {
          mocks: {
            $route: {
              query: {
                resetToken: '123',
              },
            },
          },
          apollo: {
            mutationCallstack: [
              GenericApolloResponse(
                'passwordReset',
                GenericErrorsResponse(
                  GenericError('Invalid Password Reset Token')
                )
              ),
            ],
          },
        })
      );
    });

    it('shows error message when resetting', async () => {
      await forgotPasswordComponent
        .find('input#new_password1')
        .setValue('example1234');
      await forgotPasswordComponent
        .find('input#new_password2')
        .setValue('example1234');

      await forgotPasswordComponent.vm.resetPassword();
      await forgotPasswordComponent.vm.$nextTick();

      expect(forgotPasswordComponent.text()).to.contain(
        'Invalid Password Reset Token'
      );
    });
  });

  describe('with reset token', () => {
    const swalToastStub = jest.spyOn(swalToast, 'fire');
    const resetStub = jest.spyOn(authService, 'resetPassword');
    let routerPushFake;
    beforeEach(async () => {
      resetStub.mockClear();
      swalToastStub.mockClear();
      forgotPasswordComponent = await mountWithRouterMock(
        ForgotPassword,
        generateMountOptions(['apollo'], {
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
          apollo: {
            mutationCallstack: [
              GenericApolloResponse(
                'passwordReset',
                GenericErrorsResponse(
                  GenericError('Your confirmed password does not match!')
                )
              ),
            ],
          },
        })
      );
    });

    it('shows errors', async () => {
      await forgotPasswordComponent
        .find('input#new_password1')
        .setValue('example1234');
      await forgotPasswordComponent
        .find('input#new_password2')
        .setValue('example123');

      await forgotPasswordComponent.vm.resetPassword();

      expect(forgotPasswordComponent.text()).to.contain(
        'Your confirmed password does not match!'
      );
    });

    it('can reset password', async () => {
      const resetStub = jest
        .spyOn(forgotPasswordComponent.vm, 'resetPassword')
        .mockImplementation(() => {});

      forgotPasswordComponent.vm.$apollo = generateApolloMock({
        mutationCallstack: [
          GenericApolloResponse('passwordReset', GenericMutationResponse()),
        ],
      });

      await forgotPasswordComponent
        .find('input#new_password1')
        .setValue('example1234');
      await forgotPasswordComponent
        .find('input#new_password2')
        .setValue('example1234');
      forgotPasswordComponent.find('form').trigger('submit');

      expect(resetStub.mock.calls).length(1);
      resetStub.mockRestore();

      await forgotPasswordComponent.vm.resetPassword();

      expect(authService.resetPassword.mock.calls).length(1);
      expect(authService.resetPassword.mock.calls[0][1]).to.include({
        token: '1234abcd',
        password: 'example1234',
        confirmedPassword: 'example1234',
      });
      expect(swalToastStub.mock.calls).length(1);
      expect(routerPushFake.mock.calls).length(1);
      expect(routerPushFake.mock.calls[0][0]).to.eq('/login');
    });
  });
});
