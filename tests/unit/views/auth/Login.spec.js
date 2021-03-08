import { shallowMount } from '@vue/test-utils';
import { expect } from 'chai';

import AuthBox from '@/components/auth/UserAuthBox.vue';
import { authService } from '@/services';
import Login from '@/views/auth/Login.vue';

import { mountWithRouterMock } from '../../helpers';

jest.mock('@/services');

describe('Login', function () {
  let loginComponent, authBoxComponent;
  let fakeReplace;

  beforeEach(async () => {
    loginComponent = await mountWithRouterMock(Login, {
      mocks: {
        $router: {
          replace: (fakeReplace = jest.fn()),
        },
      },
    });
    authBoxComponent = loginComponent.findComponent(AuthBox);
  });

  it('contains an auth box', () => {
    expect(authBoxComponent.exists()).to.be.true;
  });

  it('defaults to login auth box', () => {
    expect(authBoxComponent.props('login')).to.be.true;
  });

  it('can use signup auth box instead', async () => {
    await loginComponent.setProps({
      login: false,
    });
    expect(authBoxComponent.props('login')).to.be.false;
  });

  it('doesnt react to switch to login if already on login', async () => {
    await authBoxComponent.vm.$emit('go-login');
    expect(fakeReplace.mock.calls).to.be.empty;
  });

  it('reacts to switch to login', async () => {
    await loginComponent.setProps({
      login: false,
    });
    await authBoxComponent.vm.$emit('go-login');
    expect(fakeReplace.mock.calls[0][0].name).to.eq('login');
  });

  it('reacts to switch to signup', async () => {
    await authBoxComponent.vm.$emit('go-signup');
    expect(fakeReplace.mock.calls[0][0].name).to.eq('signup');
  });

  it('doesnt react to switch to signup if already on signup', async () => {
    await loginComponent.setProps({
      login: false,
    });
    await authBoxComponent.vm.$emit('go-signup');
    expect(fakeReplace.mock.calls).to.be.empty;
  });

  it('redirects if user is already authenticated', async () => {
    // Mock Auth service
    authService.isLoggedIn.mockReturnValueOnce(true);

    let next = jest.fn();

    // Call guard
    Login.beforeRouteEnter.call(undefined, undefined, undefined, next);

    // Should redirect to named "home" route
    expect(next.mock.calls[0][0].name).equal('home');

    // Tear down mock
    authService.isLoggedIn.mockRestore();
  });

  it('doesnt redirect if not logged in', async () => {
    // Mock Auth service
    authService.isLoggedIn.mockReturnValueOnce(false);

    let next = jest.fn();

    // Call guard
    Login.beforeRouteEnter.call(undefined, undefined, undefined, next);

    // Should have no params
    expect(next.mock.calls[0]).to.be.empty;

    // Tear down mock
    authService.isLoggedIn.mockRestore();
  });
});
