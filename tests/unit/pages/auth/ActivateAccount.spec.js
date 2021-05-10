import { mount } from '@vue/test-utils'
import { expect } from 'chai'

import { authService } from '@/services'
import { swalToast } from '@/utils'
import ActivateAccount from '@/pages/login/activate/_token/index'

import { executeWithServer, generateMountOptions, waitFor } from '../../helpers'

describe('Activate Account', function () {
  let component, server

  beforeAll(async () => {
    server = await executeWithServer(() => {}, false)
  })

  afterAll(() => {
    server.shutdown()
  })

  it('redirects if user is already authenticated', () => {
    expect(ActivateAccount.middleware).to.include('not-authed')
  })

  it('activates account with valid token', () => {
    let routerPushFake
    const activateAccountStub = jest.spyOn(authService, 'activateAccount')
    const swalToastStub = jest.spyOn(swalToast, 'fire')
    component = mount(
      ActivateAccount,
      generateMountOptions(['apollo'], {
        mocks: {
          $router: {
            push: (routerPushFake = jest.fn()),
          },
          $route: {
            params: {
              token: '1234abcd',
            },
          },
        },
      })
    )

    expect(component.text()).to.contain('Activating your account')
    expect(component.text()).not.to.contain('error')

    return waitFor(() => routerPushFake.mock.calls.length > 0).then(() => {
      expect(activateAccountStub.mock.calls).length(1)
      expect(activateAccountStub.mock.calls[0][1]).includes({
        token: '1234abcd',
      })

      expect(swalToastStub.mock.calls).length(1)

      expect(routerPushFake.mock.calls).length(1)
      expect(routerPushFake.mock.calls[0][0]).to.eq('/login')
    })
  })

  it('shows error with invalid token', () => {
    component = mount(
      ActivateAccount,
      generateMountOptions(['apollo'], {
        mocks: {
          $route: {
            params: {
              token: 'invalidCode',
            },
          },
        },
      })
    )

    return waitFor(() => component.vm.error).then(() => {
      expect(component.text()).to.contain('There was an error')
    })
  })
})
