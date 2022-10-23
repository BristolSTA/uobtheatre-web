import { expect } from 'chai'

import { mountWithRouterMock } from '../../helpers'
import AuthBox from '@/components/auth/UserAuthBox.vue'
import Login from '@/pages/signup'

jest.mock('@/services')

describe('Login', function () {
  let signupComponent, authBoxComponent
  let fakeReplace

  beforeEach(async () => {
    signupComponent = await mountWithRouterMock(Login, {
      mocks: {
        $router: {
          replace: (fakeReplace = jest.fn())
        }
      }
    })
    authBoxComponent = signupComponent.findComponent(AuthBox)
  })

  it('contains an auth box', () => {
    expect(authBoxComponent.exists()).to.be.true
    expect(authBoxComponent.props('login')).to.be.false
  })

  it('doesnt react to switch to signup if already on signup', async () => {
    await authBoxComponent.vm.$emit('go-signup')
    expect(fakeReplace.mock.calls).to.be.empty
  })

  it('reacts to switch to login', async () => {
    await authBoxComponent.vm.$emit('go-login')
    expect(fakeReplace.mock.calls[0][0]).to.eq('/login')
  })

  it('redirects if user is already authenticated', () => {
    expect(Login.middleware).to.include('not-authed')
  })
})
