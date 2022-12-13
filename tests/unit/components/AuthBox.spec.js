import { describe, expect, it, beforeEach } from 'vitest';
import UserAuthBox from '@/components/auth/AuthBox.vue';
import { shallowMount, mount } from '@vue/test-utils';
import UiInputText from '~~/components/ui/Input/UiInputText.vue';

// vi.spyOn(authService, 'queueRefresh').mockImplementation(() => {});

describe('AuthBox', async function () {
  let authBoxComponent;

  it('can switch between login and signup', async () => {
    authBoxComponent = await shallowMount(UserAuthBox);
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

  // it.only('loading screen overlays correctly', async () => {
  //   authBoxComponent = await mountWithRouterMock(UserAuthBox);
  //   expect(authBoxComponent.findComponent({ ref: 'loading-overlay' }).exists())
  //     .to.be.false;

  //   await authBoxComponent.setData({
  //     loading: true
  //   });

  //   expect(authBoxComponent.findComponent({ ref: 'loading-overlay' }).exists())
  //     .to.be.true;
  // });

  describe('Login Section', () => {
    beforeEach(async () => {
      authBoxComponent = await mount(UserAuthBox, {
        global: {
          components: { UiInputText }
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

    // it('shows errors on incorrect credentials', async () => {
    //   authBoxComponent.vm.$apollo = generateApolloMock({
    //     mutationCallstack: [
    //       GenericApolloResponse(
    //         'login',
    //         GenericErrorsResponse(
    //           GenericError('Unable to log in with provided credentials.')
    //         )
    //       )
    //     ]
    //   });
    //   authBoxComponent.setData({
    //     email: 'nobody@example.org',
    //     password: 'fakeness'
    //   });
    //   await authBoxComponent.find('form').trigger('submit');
    //   await authBoxComponent.vm.$nextTick();
    //   expect(authBoxComponent.text()).to.contain(
    //     'Error: Unable to log in with provided credentials.'
    //   );
    // });

    // it('offers option to resend verification email', async () => {
    //   authBoxComponent.vm.$apollo = generateApolloMock({
    //     mutationCallstack: [
    //       GenericApolloResponse(
    //         'login',
    //         GenericErrorsResponse(
    //           GenericError(undefined, undefined, undefined, 'not_verified')
    //         )
    //       ),
    //       GenericApolloResponse(
    //         'resendActivationEmail',
    //         GenericMutationResponse()
    //       )
    //     ]
    //   });
    //   authBoxComponent.setData({
    //     email: 'nobody@example.org',
    //     password: 'fakeness'
    //   });
    //   await authBoxComponent.find('form').trigger('submit');
    //   await authBoxComponent.vm.$nextTick();
    //   expect(authBoxComponent.findComponent({ ref: 'resendEmail' }).exists()).to
    //     .be.true;
    //   expect(authBoxComponent.vm.$apollo.mock.handledMutations()).to.eq(1);
    //   authBoxComponent.findComponent({ ref: 'resendEmail' }).trigger('click');
    //   expect(authBoxComponent.vm.$apollo.mock.handledMutations()).to.eq(2);
    // });

    // it('redirects to intended on successful login if has', async () => {
    //   let fakeReplace, storeDispatchFn;

    //   authBoxComponent = await mountWithRouterMock(
    //     UserAuthBox,
    //     generateMountOptions(['apollo', 'config'], {
    //       mocks: {
    //         $route: {
    //           query: {
    //             redirect: '/some/path'
    //           }
    //         },
    //         $store: {
    //           dispatch: (storeDispatchFn = vi.fn(() => Promise.resolve())),
    //           state: {
    //             'box-office': {
    //               locationId: null
    //             }
    //           }
    //         },
    //         $router: {
    //           replace: (fakeReplace = vi.fn(() => Promise.resolve()))
    //         }
    //       },
    //       apollo: {
    //         mutationCallstack: [
    //           GenericApolloResponse(
    //             'login',
    //             GenericMutationResponse({
    //               token: '36c86c19f8f8d73aa59c3a00814137bdee0ab8de',
    //               user: User()
    //             })
    //           )
    //         ]
    //       },
    //       data() {
    //         return {
    //           email: 'm.pegg@example.org',
    //           password: '1234'
    //         };
    //       }
    //     })
    //   );

    //   await authBoxComponent.vm.attemptLogin();
    //   expect(fakeReplace.mock.calls[0][0]).to.eq('/some/path');
    //   expect(storeDispatchFn.mock.calls).length(2);
    //   expect(storeDispatchFn.mock.calls[0][0]).to.eq('auth/login');
    //   expect(storeDispatchFn.mock.calls[0][1]).to.eq(
    //     '36c86c19f8f8d73aa59c3a00814137bdee0ab8de'
    //   );
    //   expect(storeDispatchFn.mock.calls[1][0]).to.eq('auth/loadUserDetails');
    //   expect(storeDispatchFn.mock.calls[1][1].apollo).to.not.be.undefined;
    // });

    // it('redirects to home on successful login if no intended', async () => {
    //   let fakeReplace;
    //   authBoxComponent = await mountWithRouterMock(
    //     UserAuthBox,
    //     generateMountOptions(['apollo', 'config'], {
    //       propsData: {
    //         login: true
    //       },
    //       mocks: {
    //         $route: {
    //           query: {}
    //         },
    //         $apolloHelpers: {
    //           onLogin: vi.fn()
    //         },
    //         $store: {
    //           dispatch: vi.fn(() => Promise.resolve()),
    //           state: {
    //             'box-office': {
    //               locationId: null
    //             }
    //           }
    //         },
    //         $router: {
    //           replace: (fakeReplace = vi.fn())
    //         }
    //       },
    //       apollo: {
    //         mutationCallstack: [
    //           GenericApolloResponse(
    //             'login',
    //             GenericMutationResponse({
    //               token: '36c86c19f8f8d73aa59c3a00814137bdee0ab8de',
    //               user: User()
    //             })
    //           )
    //         ]
    //       },
    //       data() {
    //         return {
    //           email: 'm.pegg@example.org',
    //           password: '1234'
    //         };
    //       }
    //     })
    //   );

    //   await authBoxComponent.vm.attemptLogin();
    //   expect(fakeReplace.mock.calls[0][0]).to.eq('/');
    // });

    it('has link to reset password', () => {
      const link = authBoxComponent.find('nuxtlink');
      expect(link.text()).to.eq('Forgot your password?');
      expect(link.attributes('to')).to.eq('/login/forgot');
    });
  });

  // describe('Sign Up Section', () => {
  //   let swalToastStub;
  //   let registerStub;
  //   let routerPushStub;
  //   beforeEach(async () => {
  //     // swalToastStub = vi.spyOn(swalToast, 'fire');
  //     // registerStub = vi.spyOn(authService, 'register');
  //     authBoxComponent = await mountWithRouterMock(
  //       UserAuthBox,
  //       generateMountOptions(['apollo'], {
  //         propsData: {
  //           login: false
  //         },
  //         mocks: {
  //           $router: {
  //             push: (routerPushStub = vi.fn())
  //           },
  //           $store: {
  //             state: {
  //               'box-office': {
  //                 locationId: null
  //               }
  //             }
  //           }
  //         }
  //       })
  //     );
  //   });

  //   it('top nav button shows signup as active', () => {
  //     const buttons = authBoxComponent.findAll('div[role=navigation] button');
  //     expect(buttons[1].classes()).to.contain('bg-sta-orange');
  //   });

  //   it('shows full name input box initially', () => {
  //     expect(authBoxComponent.find('input#fullName').exists()).to.be.true;
  //     expect(authBoxComponent.find('input#firstName').exists()).to.be.false;
  //     expect(authBoxComponent.find('input#lastName').exists()).to.be.false;
  //   });

  //   it('splits full name correctly', async () => {
  //     const fullNameInputField = authBoxComponent.find('input#fullName');

  //     fullNameInputField.setValue('Joe');
  //     await fullNameInputField.trigger('blur');
  //     expect(authBoxComponent.find('input#firstName').exists()).to.be.false;
  //     expect(authBoxComponent.find('input#lastName').exists()).to.be.false;

  //     fullNameInputField.setValue('Joe Bloggs');
  //     await fullNameInputField.trigger('blur');
  //     expect(authBoxComponent.find('input#firstName').element.value).to.eq(
  //       'Joe'
  //     );
  //     expect(authBoxComponent.find('input#lastName').element.value).to.eq(
  //       'Bloggs'
  //     );
  //   });

  //   it('submit button blocked until ToS accepted', async () => {
  //     const button = authBoxComponent.find('form button');
  //     expect(button.attributes('disabled')).to.be.ok;

  //     await authBoxComponent.find('input#accept_terms').setChecked();
  //     expect(button.attributes('disabled')).to.not.be.ok;
  //   });

  //   it('can signup correctly', async () => {
  //     const attemptSignupStub = jest
  //       .spyOn(authBoxComponent.vm, 'attemptSignup')
  //       .mockImplementation(() => {});
  //     const fullNameInputField = authBoxComponent.find('input#fullName');
  //     fullNameInputField.setValue('Joe Bloggs');
  //     await fullNameInputField.trigger('blur');
  //     await authBoxComponent
  //       .find('input#email')
  //       .setValue('joe.bloggs@example.org');
  //     await authBoxComponent.find('input#password1').setValue('12345678');
  //     await authBoxComponent.find('input#password2').setValue('12345678');
  //     await authBoxComponent.find('input#accept_terms').setChecked();
  //     await authBoxComponent.find('form').trigger('submit');
  //     expect(attemptSignupStub.mock.calls).length(1);

  //     attemptSignupStub.mockRestore();

  //     authBoxComponent.vm.$apollo = generateApolloMock({
  //       mutationCallstack: [
  //         GenericApolloResponse('register', GenericMutationResponse())
  //       ]
  //     });

  //     return authBoxComponent.vm.attemptSignup().then(() => {
  //       expect(registerStub.mock.calls).length(1);
  //       expect(registerStub.mock.calls[0][0]).to.include({
  //         firstName: 'Joe',
  //         lastName: 'Bloggs',
  //         email: 'joe.bloggs@example.org',
  //         password: '12345678',
  //         confirmedPassword: '12345678'
  //       });
  //       expect(swalToastStub.mock.calls).length(1);

  //       expect(routerPushStub.mock.calls).length(1);
  //       expect(routerPushStub.mock.calls[0][0]).to.eq('/');
  //     });
  //   });

  //   it('can display signup errors', async () => {
  //     const attemptSignupStub = jest
  //       .spyOn(authBoxComponent.vm, 'attemptSignup')
  //       .mockImplementation(() => {});

  //     const fullNameInputField = authBoxComponent.find('input#fullName');
  //     fullNameInputField.setValue('Joe Bloggs');
  //     await fullNameInputField.trigger('blur');
  //     await authBoxComponent
  //       .find('input#email')
  //       .setValue('joe.bloggs@example.org');
  //     await authBoxComponent.find('input#password1').setValue('12345678');
  //     await authBoxComponent.find('input#password2').setValue('1234567');
  //     await authBoxComponent.find('input#accept_terms').setChecked();
  //     await authBoxComponent.find('form').trigger('submit');
  //     expect(attemptSignupStub.mock.calls).length(1);

  //     attemptSignupStub.mockRestore();

  //     authBoxComponent.vm.$apollo = generateApolloMock({
  //       mutationCallstack: [
  //         GenericApolloResponse(
  //           'register',
  //           GenericErrorsResponse(
  //             GenericError('Your confirmed password does not match')
  //           )
  //         )
  //       ]
  //     });

  //     return authBoxComponent.vm.attemptSignup().then(() => {
  //       expect(
  //         authBoxComponent.findComponent({ ref: 'loading-overlay' }).exists()
  //       ).to.be.false;
  //       expect(authBoxComponent.vm.signup_errors).to.be.instanceOf(Errors);
  //       expect(authBoxComponent.text()).to.contain(
  //         'Your confirmed password does not match'
  //       );
  //     });
  //   });
  // });
});
