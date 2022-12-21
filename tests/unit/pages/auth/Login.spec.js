import { expect } from 'vitest';
import { mount } from '#testSupport/helpers';

import AuthBox from '@/components/auth/AuthBox.vue';
import Login from '@/pages/login/index.vue';

describe('Login', function () {
  let loginComponent, authBoxComponent, router;

  beforeEach(async () => {
    loginComponent = await mount(Login, {
      shallow: false,
      global: {
        stubs: [AuthBox]
      }
    });
    authBoxComponent = loginComponent.findComponent(AuthBox);
    router = useRouter();
  });

  it('contains an auth box', () => {
    expect(authBoxComponent.exists()).to.be.true;
    expect(authBoxComponent.props('loginMode')).to.be.true;
  });

  it('doesnt react to switch to login if already on login', async () => {
    await authBoxComponent.vm.$emit('go-login');
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('reacts to switch to signup', async () => {
    await authBoxComponent.vm.$emit('go-signup');
    expect(router.replace).toHaveBeenCalledWith('/signup');
  });
});
