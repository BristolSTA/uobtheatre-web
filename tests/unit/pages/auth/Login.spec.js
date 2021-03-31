import { expect } from 'chai'

import AuthBox from '@/components/auth/UserAuthBox.vue'
import Login from '@/pages/login/index'

import { mountWithRouterMock } from '../../helpers'

jest.mock('@/services')

describe('Login', function () {
  let loginComponent, authBoxComponent
  let fakeReplace

  beforeEach(async () => {
    loginComponent = await mountWithRouterMock(Login, {
      mocks: {
        $router: {
          replace: (fakeReplace = jest.fn()),
        },
      },
    })
    authBoxComponent = loginComponent.findComponent(AuthBox)
  })

  it('contains an auth box', () => {
    expect(authBoxComponent.exists()).to.be.true
    expect(authBoxComponent.props('login')).to.be.true
  })

  it('doesnt react to switch to login if already on login', async () => {
    await authBoxComponent.vm.$emit('go-login')
    expect(fakeReplace.mock.calls).to.be.empty
  })

  it('reacts to switch to signup', async () => {
    await authBoxComponent.vm.$emit('go-signup')
    expect(fakeReplace.mock.calls[0][0]).to.eq('/signup')
  })

  it('redirects if user is already authenticated', () => {
    expect(Login.middleware).to.include('not-authed')
  })
})
