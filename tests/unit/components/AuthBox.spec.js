import { expect } from 'chai'

import {
  generateApolloMock,
  generateMountOptions,
  mountWithRouterMock,
  RouterLinkStub
} from '../helpers'
import GenericApolloResponse from '../fixtures/support/GenericApolloResponse'
import GenericMutationResponse from '../fixtures/support/GenericMutationResponse'
import GenericError from '../fixtures/support/GenericError'
import User from '../fixtures/User'
import GenericErrorsResponse from '../fixtures/support/GenericErrorsResponse'
import { swalToast } from '@/utils'
import { authService } from '@/services'
import UserAuthBox from '@/components/auth/UserAuthBox.vue'
import Errors from '@/classes/Errors'

jest.spyOn(authService, 'queueRefresh').mockImplementation(() => {})

describe('AuthBox', function () {
  let authBoxComponent

  it('can switch between login and signup', async () => {
    authBoxComponent = await mountWithRouterMock(UserAuthBox, {
      mocks: {
        $store: {
          state: {
            'box-office': {
              locationId: null
            }
          }
        }
      }
    })
    const buttons = authBoxComponent.findAll('div[role=navigation] button')
    expect(authBoxComponent.emitted('go-login')).to.be.undefined
    expect(authBoxComponent.emitted('go-signup')).to.be.undefined

    await buttons.at(0).trigger('click')
    expect(authBoxComponent.emitted('go-login')).to.be.ok

    await buttons.at(1).trigger('click')
    expect(authBoxComponent.emitted('go-signup')).to.be.ok

    expect(buttons.at(0).classes()).to.contain('bg-sta-orange')
    expect(buttons.at(1).classes()).to.contain('bg-gray-200')
    expect(authBoxComponent.text()).to.contain('Log In')

    await authBoxComponent.setProps({
      login: false
    })

    expect(buttons.at(1).classes()).to.contain('bg-sta-orange')
    expect(buttons.at(0).classes()).to.contain('bg-gray-200')
    expect(authBoxComponent.text()).to.contain('Sign Up')
  })

  it('loading screen overlays correctly', async () => {
    authBoxComponent = await mountWithRouterMock(UserAuthBox, {
      mocks: {
        $store: {
          state: {
            'box-office': {
              locationId: null
            }
          }
        }
      }
    })
    expect(authBoxComponent.findComponent({ ref: 'loading-overlay' }).exists())
      .to.be.false

    await authBoxComponent.setData({
      loading: true
    })

    expect(authBoxComponent.findComponent({ ref: 'loading-overlay' }).exists())
      .to.be.true
  })

  describe('Login Section', () => {
    beforeEach(async () => {
      authBoxComponent = await mountWithRouterMock(
        UserAuthBox,
        generateMountOptions(['apollo'], {
          mocks: {
            $store: {
              state: {
                'box-office': {
                  locationId: null
                }
              }
            }
          }
        })
      )
    })

    it('top nav button shows login as active', () => {
      const buttons = authBoxComponent.findAll('div[role=navigation] button')
      expect(buttons.at(0).classes()).to.contain('bg-sta-orange')
    })

    it('has correct input fields and they are mapped', () => {
      const emailInput = authBoxComponent.find('input#email')
      const passwordInput = authBoxComponent.find('input#password')
      const rememberMeCheck = authBoxComponent.find('input#remember_me')

      // Email Input
      expect(emailInput.attributes('autocomplete')).to.eq('email username')
      expect(emailInput.attributes('type')).to.eq('email')
      expect(emailInput.attributes.value).to.be.undefined
      expect(authBoxComponent.vm.email).to.eq(null)
      emailInput.setValue('someone@example.org')
      expect(authBoxComponent.vm.email).to.eq('someone@example.org')

      // Password Input
      expect(passwordInput.attributes('autocomplete')).to.eq('current-password')
      expect(passwordInput.attributes('type')).to.eq('password')
      expect(passwordInput.attributes.value).to.be.undefined
      expect(authBoxComponent.vm.password).to.eq(null)
      passwordInput.setValue('AS3cretPA$$W0rD')
      expect(authBoxComponent.vm.password).to.eq('AS3cretPA$$W0rD')

      // Remember Me Checkbox
      expect(rememberMeCheck.attributes('type')).to.eq('checkbox')
      expect(rememberMeCheck.element.checked).to.be.false
      expect(authBoxComponent.vm.remember_me).to.be.false
      rememberMeCheck.setChecked()
      expect(authBoxComponent.vm.remember_me).to.be.true
      expect(rememberMeCheck.element.checked).to.be.true
    })

    it('shows errors on incorrect credentials', async () => {
      authBoxComponent.vm.$apollo = generateApolloMock({
        mutationCallstack: [
          GenericApolloResponse(
            'login',
            GenericErrorsResponse(
              GenericError('Unable to log in with provided credentials.')
            )
          )
        ]
      })
      authBoxComponent.setData({
        email: 'nobody@example.org',
        password: 'fakeness'
      })
      await authBoxComponent.find('form').trigger('submit')
      await authBoxComponent.vm.$nextTick()
      expect(authBoxComponent.text()).to.contain(
        'Error: Unable to log in with provided credentials.'
      )
    })

    it('offers option to resend verification email', async () => {
      authBoxComponent.vm.$apollo = generateApolloMock({
        mutationCallstack: [
          GenericApolloResponse(
            'login',
            GenericErrorsResponse(
              GenericError(undefined, undefined, undefined, 'not_verified')
            )
          ),
          GenericApolloResponse(
            'resendActivationEmail',
            GenericMutationResponse()
          )
        ]
      })
      authBoxComponent.setData({
        email: 'nobody@example.org',
        password: 'fakeness'
      })
      await authBoxComponent.find('form').trigger('submit')
      await authBoxComponent.vm.$nextTick()
      expect(authBoxComponent.findComponent({ ref: 'resendEmail' }).exists()).to
        .be.true
      expect(authBoxComponent.vm.$apollo.mock.handledMutations()).to.eq(1)
      authBoxComponent.findComponent({ ref: 'resendEmail' }).trigger('click')
      expect(authBoxComponent.vm.$apollo.mock.handledMutations()).to.eq(2)
    })

    it('redirects to intended on successful login if has', async () => {
      let fakeReplace, storeDispatchFn

      authBoxComponent = await mountWithRouterMock(
        UserAuthBox,
        generateMountOptions(['apollo', 'config'], {
          mocks: {
            $route: {
              query: {
                redirect: '/some/path'
              }
            },
            $store: {
              dispatch: (storeDispatchFn = jest.fn(() => Promise.resolve())),
              state: {
                'box-office': {
                  locationId: null
                }
              }
            },
            $router: {
              replace: (fakeReplace = jest.fn(() => Promise.resolve()))
            }
          },
          apollo: {
            mutationCallstack: [
              GenericApolloResponse(
                'login',
                GenericMutationResponse({
                  token: '36c86c19f8f8d73aa59c3a00814137bdee0ab8de',
                  user: User()
                })
              )
            ]
          },
          data () {
            return {
              email: 'm.pegg@example.org',
              password: '1234'
            }
          }
        })
      )

      await authBoxComponent.vm.attemptLogin()
      expect(fakeReplace.mock.calls[0][0]).to.eq('/some/path')
      expect(storeDispatchFn.mock.calls).length(2)
      expect(storeDispatchFn.mock.calls[0][0]).to.eq('auth/login')
      expect(storeDispatchFn.mock.calls[0][1]).to.eq(
        '36c86c19f8f8d73aa59c3a00814137bdee0ab8de'
      )
      expect(storeDispatchFn.mock.calls[1][0]).to.eq('auth/loadUserDetails')
      expect(storeDispatchFn.mock.calls[1][1].apollo).to.not.be.undefined
    })

    it('redirects to home on successful login if no intended', async () => {
      let fakeReplace
      authBoxComponent = await mountWithRouterMock(
        UserAuthBox,
        generateMountOptions(['apollo', 'config'], {
          propsData: {
            login: true
          },
          mocks: {
            $route: {
              query: {}
            },
            $apolloHelpers: {
              onLogin: jest.fn()
            },
            $store: {
              dispatch: jest.fn(() => Promise.resolve()),
              state: {
                'box-office': {
                  locationId: null
                }
              }
            },
            $router: {
              replace: (fakeReplace = jest.fn())
            }
          },
          apollo: {
            mutationCallstack: [
              GenericApolloResponse(
                'login',
                GenericMutationResponse({
                  token: '36c86c19f8f8d73aa59c3a00814137bdee0ab8de',
                  user: User()
                })
              )
            ]
          },
          data () {
            return {
              email: 'm.pegg@example.org',
              password: '1234'
            }
          }
        })
      )

      await authBoxComponent.vm.attemptLogin()
      expect(fakeReplace.mock.calls[0][0]).to.eq('/')
    })

    it('has link to reset password', () => {
      const link = authBoxComponent.findComponent(RouterLinkStub)
      expect(link.text()).to.eq('Forgot your password?')
      expect(link.props('to')).to.eq('/login/forgot')
    })
  })

  describe('Sign Up Section', () => {
    let swalToastStub
    let registerStub
    let routerPushStub
    beforeEach(async () => {
      swalToastStub = jest.spyOn(swalToast, 'fire')
      registerStub = jest.spyOn(authService, 'register')
      authBoxComponent = await mountWithRouterMock(
        UserAuthBox,
        generateMountOptions(['apollo'], {
          propsData: {
            login: false
          },
          mocks: {
            $router: {
              push: (routerPushStub = jest.fn())
            },
            $store: {
              state: {
                'box-office': {
                  locationId: null
                }
              }
            }
          }
        })
      )
    })

    it('top nav button shows signup as active', () => {
      const buttons = authBoxComponent.findAll('div[role=navigation] button')
      expect(buttons.at(1).classes()).to.contain('bg-sta-orange')
    })

    it('shows full name input box initially', () => {
      expect(authBoxComponent.find('input#fullName').exists()).to.be.true
      expect(authBoxComponent.find('input#firstName').exists()).to.be.false
      expect(authBoxComponent.find('input#lastName').exists()).to.be.false
    })

    it('splits full name correctly', async () => {
      const fullNameInputField = authBoxComponent.find('input#fullName')

      fullNameInputField.setValue('Joe')
      await fullNameInputField.trigger('blur')
      expect(authBoxComponent.find('input#firstName').exists()).to.be.false
      expect(authBoxComponent.find('input#lastName').exists()).to.be.false

      fullNameInputField.setValue('Joe Bloggs')
      await fullNameInputField.trigger('blur')
      expect(authBoxComponent.find('input#firstName').element.value).to.eq(
        'Joe'
      )
      expect(authBoxComponent.find('input#lastName').element.value).to.eq(
        'Bloggs'
      )
    })

    it('submit button blocked until ToS accepted', async () => {
      const button = authBoxComponent.find('form button')
      expect(button.attributes('disabled')).to.be.ok

      await authBoxComponent.find('input#accept_terms').setChecked()
      expect(button.attributes('disabled')).to.not.be.ok
    })

    it('can signup correctly', async () => {
      const attemptSignupStub = jest
        .spyOn(authBoxComponent.vm, 'attemptSignup')
        .mockImplementation(() => {})
      const fullNameInputField = authBoxComponent.find('input#fullName')
      fullNameInputField.setValue('Joe Bloggs')
      await fullNameInputField.trigger('blur')
      await authBoxComponent
        .find('input#email')
        .setValue('joe.bloggs@example.org')
      await authBoxComponent.find('input#password1').setValue('12345678')
      await authBoxComponent.find('input#password2').setValue('12345678')
      await authBoxComponent.find('input#accept_terms').setChecked()
      await authBoxComponent.find('form').trigger('submit')
      expect(attemptSignupStub.mock.calls).length(1)

      attemptSignupStub.mockRestore()

      authBoxComponent.vm.$apollo = generateApolloMock({
        mutationCallstack: [
          GenericApolloResponse('register', GenericMutationResponse())
        ]
      })

      return authBoxComponent.vm.attemptSignup().then(() => {
        expect(registerStub.mock.calls).length(1)
        expect(registerStub.mock.calls[0][0]).to.include({
          firstName: 'Joe',
          lastName: 'Bloggs',
          email: 'joe.bloggs@example.org',
          password: '12345678',
          confirmedPassword: '12345678'
        })
        expect(swalToastStub.mock.calls).length(1)

        expect(routerPushStub.mock.calls).length(1)
        expect(routerPushStub.mock.calls[0][0]).to.eq('/')
      })
    })

    it('can display signup errors', async () => {
      const attemptSignupStub = jest
        .spyOn(authBoxComponent.vm, 'attemptSignup')
        .mockImplementation(() => {})

      const fullNameInputField = authBoxComponent.find('input#fullName')
      fullNameInputField.setValue('Joe Bloggs')
      await fullNameInputField.trigger('blur')
      await authBoxComponent
        .find('input#email')
        .setValue('joe.bloggs@example.org')
      await authBoxComponent.find('input#password1').setValue('12345678')
      await authBoxComponent.find('input#password2').setValue('1234567')
      await authBoxComponent.find('input#accept_terms').setChecked()
      await authBoxComponent.find('form').trigger('submit')
      expect(attemptSignupStub.mock.calls).length(1)

      attemptSignupStub.mockRestore()

      authBoxComponent.vm.$apollo = generateApolloMock({
        mutationCallstack: [
          GenericApolloResponse(
            'register',
            GenericErrorsResponse(
              GenericError('Your confirmed password does not match')
            )
          )
        ]
      })

      return authBoxComponent.vm.attemptSignup().then(() => {
        expect(
          authBoxComponent.findComponent({ ref: 'loading-overlay' }).exists()
        ).to.be.false
        expect(authBoxComponent.vm.signup_errors).to.be.instanceOf(Errors)
        expect(authBoxComponent.text()).to.contain(
          'Your confirmed password does not match'
        )
      })
    })
  })
})
