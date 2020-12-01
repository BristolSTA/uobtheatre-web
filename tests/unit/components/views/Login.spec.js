import Login from '@/views/login/Login.vue';
import { makeServer } from '@/fakeApi';
import { expect } from 'chai';
import { mount } from '@vue/test-utils';

describe('Login', function () {
  let loginComponent;
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
    loginComponent = mount(Login);
  });

  afterEach(() => {
    server.shutdown();
  });

  it('defualts to login', () => {
    expect(loginComponent.text()).to.contain('Log In');
  });
});
