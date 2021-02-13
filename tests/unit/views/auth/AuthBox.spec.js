import { mount } from '@vue/test-utils';
import { expect } from 'chai';

import { makeServer } from '@/fakeApi';
import store from '@/store';
import UserAuthBox from '@/views/auth/UserAuthBox.vue';

import { waitFor } from '../../helpers';

describe('AuthBox', function () {
  let authBoxComponent, server;
  let userEmail = 'admin@bristolsta.com',
    userPassword = 'admin',
    userToken = '36c86c19f8f8d73aa59c3a00814137bdee0ab8de';

  beforeAll(() => {
    server = makeServer({ environment: 'test' });
    server.create('userNode', {
      email: userEmail,
      password: userPassword,
      token: userToken,
    });
  });

  afterAll(() => {
    server.shutdown();
  });

  it('can switch between login and signup', async () => {
    authBoxComponent = mount(UserAuthBox);
    let buttons = authBoxComponent.findAll('div[role=navigation] button');
    expect(authBoxComponent.emitted('go-login')).to.be.undefined;
    expect(authBoxComponent.emitted('go-signup')).to.be.undefined;

    await buttons.at(0).trigger('click');
    expect(authBoxComponent.emitted('go-login')).to.be.ok;

    await buttons.at(1).trigger('click');
    expect(authBoxComponent.emitted('go-signup')).to.be.ok;

    expect(buttons.at(0).classes()).to.contain('bg-sta-orange');
    expect(buttons.at(1).classes()).to.contain('bg-gray-200');
    expect(authBoxComponent.text()).to.contain('Log In');

    await authBoxComponent.setProps({
      login: false,
    });

    expect(buttons.at(1).classes()).to.contain('bg-sta-orange');
    expect(buttons.at(0).classes()).to.contain('bg-gray-200');
    expect(authBoxComponent.text()).to.contain('Sign Up');
  });

  it('loading screen overlays correctly', async () => {
    authBoxComponent = mount(UserAuthBox);
    expect(authBoxComponent.findComponent({ ref: 'loading_overlay' }).exists())
      .to.be.false;

    await authBoxComponent.setData({
      loading: true,
    });

    expect(authBoxComponent.findComponent({ ref: 'loading_overlay' }).exists())
      .to.be.true;
  });

  describe('LoginSection', () => {
    beforeEach(() => {
      authBoxComponent = mount(UserAuthBox, {
        propsData: {
          login: true,
        },
      });
    });

    it('top nav button shows login as active', () => {
      let buttons = authBoxComponent.findAll('div[role=navigation] button');
      expect(buttons.at(0).classes()).to.contain('bg-sta-orange');
    });

    it('has correct input fields and they are mapped', () => {
      let email_input = authBoxComponent.find('input#email');
      let password_input = authBoxComponent.find('input#password');
      let remember_me_checkbox = authBoxComponent.find('input#remember_me');

      // Email Input
      expect(email_input.attributes('autocomplete')).to.eq('email');
      expect(email_input.attributes('type')).to.eq('text');
      expect(email_input.attributes.value).to.be.undefined;
      expect(authBoxComponent.vm.email).to.eq(null);
      email_input.setValue('someone@example.org');
      expect(authBoxComponent.vm.email).to.eq('someone@example.org');

      // Password Input
      expect(password_input.attributes('autocomplete')).to.eq(
        'current-password'
      );
      expect(password_input.attributes('type')).to.eq('password');
      expect(password_input.attributes.value).to.be.undefined;
      expect(authBoxComponent.vm.password).to.eq(null);
      password_input.setValue('AS3cretPA$$W0rD');
      expect(authBoxComponent.vm.password).to.eq('AS3cretPA$$W0rD');

      // Remember Me Checkbox
      expect(remember_me_checkbox.attributes('type')).to.eq('checkbox');
      expect(remember_me_checkbox.element.checked).to.be.false;
      expect(authBoxComponent.vm.remember_me).to.be.false;
      remember_me_checkbox.setChecked();
      expect(authBoxComponent.vm.remember_me).to.be.true;
      expect(remember_me_checkbox.element.checked).to.be.true;
    });

    it('shows errors on incorrect credentials', async () => {
      authBoxComponent.setData({
        email: 'nobody@example.org',
        password: 'fakeness',
      });
      await authBoxComponent.find('form').trigger('submit');
      await waitFor(() => authBoxComponent.vm.login_errors);
      expect(authBoxComponent.text()).to.contain(
        'Error: Unable to log in with provided credentials.'
      );
    });

    it('redirects to intended on successful login if has', async () => {
      let fakePush;
      authBoxComponent = mount(UserAuthBox, {
        propsData: {
          login: true,
        },
        mocks: {
          $route: {
            query: {
              redirect: '/some/path',
            },
          },
          $router: {
            push: (fakePush = jest.fn()),
          },
        },
        data() {
          return {
            email: userEmail,
            password: userPassword,
          };
        },
      });

      await authBoxComponent.vm.attemptLogin();
      expect(fakePush.mock.calls[0][0]).to.eq('/some/path');
      expect(store.state.auth.token).to.eq(userToken);
    });

    it('redirects to home on successful login if no intended', async () => {
      let fakePush;
      authBoxComponent = mount(UserAuthBox, {
        propsData: {
          login: true,
        },
        mocks: {
          $route: {
            query: {},
          },
          $router: {
            push: (fakePush = jest.fn()),
          },
        },
        data() {
          return {
            email: userEmail,
            password: userPassword,
          };
        },
      });

      await authBoxComponent.vm.attemptLogin();
      expect(fakePush.mock.calls[0][0].name).to.eq('home');
      expect(store.state.auth.token).to.eq(userToken);
    });
    it('has link to reset password', () => {
      //TODO: Implement
    });
  });
});
