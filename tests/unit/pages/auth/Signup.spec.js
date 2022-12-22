import { expect } from 'vitest';
import { mount } from '#testSupport/helpers';

import AuthBox from '@/components/auth/AuthBox.vue';
import Signup from '@/pages/signup.vue';

describe('Signup', function () {
  let signupComponent, authBoxComponent, router;

  beforeEach(async () => {
    signupComponent = await mount(Signup, {
      shallow: false,
      global: {
        stubs: [AuthBox]
      },
      routeInfo: {}
    });
    authBoxComponent = signupComponent.findComponent(AuthBox);
    router = useRouter();
  });

  it('contains an auth box', () => {
    expect(authBoxComponent.exists()).to.be.true;
    expect(authBoxComponent.props('loginMode')).to.be.false;
  });

  it('doesnt react to switch to signup if already on signup', async () => {
    await authBoxComponent.vm.$emit('go-signup');
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('reacts to switch to login', async () => {
    await authBoxComponent.vm.$emit('go-login');
    expect(router.replace).toHaveBeenCalledWith('/login');
  });
});
