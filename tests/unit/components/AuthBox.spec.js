import { describe, expect, it, beforeEach } from 'vitest';
import MatchMediaMock from 'vitest-matchmedia-mock';
import UserAuthBox from '@/components/auth/AuthBox.vue';
import { mount } from '#testSupport/helpers';
import { NuxtLinkStub } from '#testSupport/stubs';
import { setCompositionData } from '#testSupport/helpers';
import useAuthStore from '@/store/auth';
import ValidationError from '~~/errors/ValidationError';
import { flushPromises } from '@vue/test-utils';
import UnverifiedLoginError from '~~/errors/auth/UnverifiedLoginError';

describe('AuthBox', async function () {
  let authBoxComponent;

  beforeEach(async () => {
    new MatchMediaMock();
  });

  it('can switch between login and signup', async () => {
    authBoxComponent = await mount(UserAuthBox, {
      routeInfo: {}
    });

    const buttons = authBoxComponent.findAll('div[role=navigation] button');
    expect(authBoxComponent.emitted('go-login')).to.be.undefined;
    expect(authBoxComponent.emitted('go-signup')).to.be.undefined;

    await buttons[0].trigger('click');
    expect(authBoxComponent.emitted('go-login')).to.be.ok;

    await buttons[1].trigger('click');
    expect(authBoxComponent.emitted('go-signup')).to.be.ok;

    expect(buttons[0].classes()).to.contain('bg-sta-orange');
    expect(buttons[1].classes()).to.contain('bg-gray-200');
    expect(authBoxComponent.text()).to.contain('Log In');

    await authBoxComponent.setProps({
      loginMode: false
    });

    expect(buttons[1].classes()).to.contain('bg-sta-orange');
    expect(buttons[0].classes()).to.contain('bg-gray-200');
    expect(authBoxComponent.text()).to.contain('Sign Up');
  });

  describe('Login Section', () => {
    beforeEach(async () => {
      authBoxComponent = await mount(UserAuthBox, {
        shallow: false,
        routeInfo: {
          query: {
            redirect: '/redirect/url'
          }
        }
      });
    });

    it('top nav button shows login as active', () => {
      const buttons = authBoxComponent.findAll('div[role=navigation] button');
      expect(buttons[0].classes()).to.contain('bg-sta-orange');
    });

    it('can complete login form', async () => {
      const emailInput = authBoxComponent.find('input#email');
      const passwordInput = authBoxComponent.find('input#password');
      const rememberMeCheck = authBoxComponent.find('input#remember_me');
      const loginButton = authBoxComponent.find('[data-test="login-button"]');

      expect(loginButton.attributes('disabled')).toBeDefined();

      // Email Input
      expect(emailInput.attributes('autocomplete')).toEqual('email username');
      expect(emailInput.attributes('type')).toEqual('email');
      expect(emailInput.attributes.value).to.be.undefined;
      emailInput.setValue('someone@example.org');

      expect(loginButton.attributes('disabled')).toBeDefined();

      // Password Input
      expect(passwordInput.attributes('autocomplete')).toEqual(
        'current-password'
      );
      expect(passwordInput.attributes('type')).toEqual('password');
      expect(passwordInput.attributes.value).to.be.undefined;
      passwordInput.setValue('AS3cretPA$$W0rD');
      expect(authBoxComponent.vm.password).toEqual('AS3cretPA$$W0rD');
      // Remember Me Checkbox
      expect(rememberMeCheck.attributes('type')).toEqual('checkbox');
      expect(rememberMeCheck.element.checked).to.be.false;
      rememberMeCheck.setChecked();
      expect(rememberMeCheck.element.checked).to.be.true;

      await authBoxComponent.vm.$nextTick();
      expect(loginButton.attributes('disabled')).toBeUndefined();
    });

    it('shows errors on incorrect credentials', async () => {
      const store = useAuthStore();
      store.login.mockRejectedValueOnce(
        new ValidationError('Unable to log in with provided credentials.')
      );

      setCompositionData(authBoxComponent, {
        email: 'nobody@example.org',
        password: 'fakeness'
      });

      await authBoxComponent.find('form').trigger('submit');
      await authBoxComponent.vm.$nextTick();

      expect(authBoxComponent.text()).to.contain(
        'Error: Unable to log in with provided credentials.'
      );
    });

    it('offers option to resend verification email', async () => {
      setCompositionData(authBoxComponent, {
        email: 'nobody@example.org',
        password: 'fakeness'
      });

      const store = useAuthStore();
      store.login.mockRejectedValueOnce(new UnverifiedLoginError());

      await authBoxComponent.find('form').trigger('submit');
      await flushPromises();

      const resendVerificationButton = authBoxComponent.find(
        '[data-test="resend-email"'
      );

      expect(resendVerificationButton.exists()).to.be.true;
      await resendVerificationButton.trigger('click');

      expect(store.resendVerificationEmail).toHaveBeenCalledOnce();
    });

    it('redirects to intended on successful login if has', async () => {
      setCompositionData(authBoxComponent, {
        email: 'example@example.org',
        password: 'password123'
      });

      await authBoxComponent.vm.attemptLogin();

      const router = useRouter();
      expect(router.replace).toHaveBeenCalledWith('/redirect/url');
    });

    it('redirects to home on successful login if no intended', async () => {
      setCompositionData(authBoxComponent, {
        email: 'example@example.org',
        password: 'password123'
      });

      const route = useRoute();
      route.query.redirect = undefined;

      await authBoxComponent.vm.attemptLogin();

      const router = useRouter();
      expect(router.replace).toHaveBeenCalledWith('/');
    });

    it('has link to reset password', () => {
      const link = authBoxComponent.findComponent(NuxtLinkStub);
      expect(link.text()).to.eq('Forgot your password?');
      expect(link.attributes('to')).to.eq('/login/forgot');
    });
  });

  describe('Sign Up Section', () => {
    beforeEach(async () => {
      authBoxComponent = await mount(UserAuthBox, {
        props: { loginMode: false },
        shallow: false,
        routeInfo: {}
      });
      // Set the turnstile token to a dummy value
      authBoxComponent.vm.turnstileToken = 'XXXX.DUMMY.TOKEN.XXXX';
    });

    it('top nav button shows signup as active', () => {
      const buttons = authBoxComponent.findAll('div[role=navigation] button');
      expect(buttons[1].classes()).to.contain('bg-sta-orange');
    });

    it('shows full name input box initially', () => {
      expect(authBoxComponent.find('input#fullName').exists()).to.be.true;
      expect(authBoxComponent.find('input#firstName').exists()).to.be.false;
      expect(authBoxComponent.find('input#lastName').exists()).to.be.false;
    });

    it('splits full name correctly', async () => {
      const fullNameInputField = authBoxComponent.find('input#fullName');

      fullNameInputField.setValue('Joe');
      await fullNameInputField.trigger('blur-sm');
      expect(authBoxComponent.find('input#firstName').exists()).to.be.false;
      expect(authBoxComponent.find('input#lastName').exists()).to.be.false;

      fullNameInputField.setValue('Joe Bloggs');
      await fullNameInputField.trigger('blur-sm');
      expect(authBoxComponent.find('input#firstName').element.value).to.eq(
        'Joe'
      );
      expect(authBoxComponent.find('input#lastName').element.value).to.eq(
        'Bloggs'
      );
    });

    it('submit button blocked until ToS accepted', async () => {
      const button = authBoxComponent.find('form button');
      expect(button.attributes('disabled')).toBeDefined();

      await authBoxComponent.find('input#accept_terms').setChecked();
      expect(button.attributes('disabled')).not.toBeDefined();
    });

    it('can signup correctly', async () => {
      const fullNameInputField = authBoxComponent.find('input#fullName');
      fullNameInputField.setValue('Joe Bloggs');
      await fullNameInputField.trigger('blur-sm');
      await authBoxComponent
        .find('input#email')
        .setValue('joe.bloggs@example.org');
      await authBoxComponent.find('input#password1').setValue('12345678');
      await authBoxComponent.find('input#password2').setValue('12345678');
      await authBoxComponent.find('input#accept_terms').setChecked();
      await authBoxComponent.find('form').trigger('submit');

      const store = useAuthStore();
      const router = useRouter();
      expect(store.register).toBeCalledWith(
        'Joe',
        'Bloggs',
        'joe.bloggs@example.org',
        '12345678',
        '12345678',
        'XXXX.DUMMY.TOKEN.XXXX'
      );

      expect(router.push).toBeCalledWith('/');
    });

    it('can display signup errors', async () => {
      const store = useAuthStore();
      store.register.mockRejectedValueOnce(
        new ValidationError('Your confirmed password does not match')
      );

      const fullNameInputField = authBoxComponent.find('input#fullName');
      fullNameInputField.setValue('Joe Bloggs');
      await fullNameInputField.trigger('blur-sm');
      await authBoxComponent
        .find('input#email')
        .setValue('joe.bloggs@example.org');
      await authBoxComponent.find('input#password1').setValue('12345678');
      await authBoxComponent.find('input#password2').setValue('1234567');
      await authBoxComponent.find('input#accept_terms').setChecked();
      await authBoxComponent.find('form').trigger('submit');
      await flushPromises();

      expect(authBoxComponent.text()).to.contain(
        'Your confirmed password does not match'
      );
    });
  });
});
