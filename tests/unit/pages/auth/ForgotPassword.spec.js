import { expect, vi } from 'vitest';
import { mount } from '#testSupport/helpers';

import ForgotPassword from '@/pages/login/forgot/index.vue';
import ForgotPasswordWithToken from '@/pages/login/forgot/[token]/index.vue';
import { swal, swalToast } from '@/utils/alerts';
import useAuthStore from '@/store/auth';
import ValidationError from '~~/errors/ValidationError';

describe('Request Password Reset Page', function () {
  let forgotPasswordComponent, swalStub;

  describe('without reset token', () => {
    beforeEach(async () => {
      swalStub = vi.spyOn(swal, 'fire');
      forgotPasswordComponent = await mount(ForgotPassword, { shallow: false });
    });

    afterEach(() => {
      swalStub.mockClear();
    });

    it('shows email address input form', () => {
      expect(forgotPasswordComponent.find('input#email').exists()).to.be.true;
    });

    it('can request reset', async () => {
      const authStore = useAuthStore();

      await forgotPasswordComponent
        .find('input#email')
        .setValue('joe.bloggs@example.org');

      await forgotPasswordComponent.find('form').trigger('submit');

      expect(authStore.requestPasswordReset).toHaveBeenCalledWith(
        'joe.bloggs@example.org'
      );
      expect(swalStub).toHaveBeenCalledOnce();
    });
  });
});

describe('Reset Password Page', () => {
  let component;
  describe('with invalid reset token', () => {
    beforeEach(async () => {
      component = await mount(ForgotPasswordWithToken, {
        shallow: false,
        routeInfo: {
          params: {
            resetToken: '123'
          }
        },
        preMount: () => {
          const authStore = useAuthStore();
          authStore.resetPassword.mockRejectedValueOnce(
            new ValidationError('Invalid Password Reset Token')
          );
        }
      });
    });

    it('shows error message when resetting', async () => {
      await component.find('input#new_password1').setValue('example1234');
      await component.find('input#new_password2').setValue('example1234');

      await component.find('form').trigger('submit');
      await component.vm.$nextTick();

      expect(component.text()).to.contain('Invalid Password Reset Token');
    });
  });

  describe('with reset token', () => {
    let swalToastStub;

    beforeEach(async () => {
      swalToastStub = vi.spyOn(swalToast, 'fire');
      component = await mount(ForgotPasswordWithToken, {
        shallow: false,
        routeInfo: {
          params: {
            token: '1234abcd'
          }
        }
      });
    });

    afterEach(() => {
      swalToastStub.mockClear();
    });

    it('shows errors', async () => {
      const authStore = useAuthStore();
      authStore.resetPassword.mockRejectedValueOnce(
        new ValidationError('Your confirmed password does not match!')
      );

      await component.find('input#new_password1').setValue('example1234');
      await component.find('input#new_password2').setValue('example123');

      await component.find('form').trigger('submit');
      await component.vm.$nextTick();

      expect(component.text()).to.contain(
        'Your confirmed password does not match!'
      );
    });

    it('can reset password', async () => {
      await component.find('input#new_password1').setValue('example1234');
      await component.find('input#new_password2').setValue('example1234');

      await component.find('form').trigger('submit');

      const authStore = useAuthStore();
      expect(authStore.resetPassword).toHaveBeenCalledWith(
        '1234abcd',
        'example1234',
        'example1234'
      );
      expect(swalToastStub).toHaveBeenCalledOnce();
      const router = useRouter();
      expect(router.replace).toHaveBeenCalledWith('/login');
    });
  });
});
