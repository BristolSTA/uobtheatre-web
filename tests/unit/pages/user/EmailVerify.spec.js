import { mount } from '@vue/test-utils'
import { expect } from 'chai'

import EmailVerify from '@/pages/user/email-verify/_token/index.vue'
import { generateMountOptions, waitFor } from '../../helpers'
import GenericApolloResponse from '../../fixtures/support/GenericApolloResponse'
import GenericMutationResponse from '../../fixtures/support/GenericMutationResponse'
import GenericErrorsResponse from '../../fixtures/support/GenericErrorsResponse'

describe('Email Verify', function () {
  let component

  it('verifies an account with valid token', async () => {
    const routerReplaceMock = jest.fn()
    component = mount(
      EmailVerify,
      generateMountOptions(['apollo'], {
        apollo: {
          mutationCallstack: [
            GenericApolloResponse('verifyAccount', GenericMutationResponse()),
          ],
        },
        mocks: {
          $route: {
            params: {
              token: '1234abcd',
            },
          },
          $router: {
            replace: routerReplaceMock,
          },
        },
      })
    )

    expect(component.text()).to.contain('Verifying email')

    await waitFor(() => routerReplaceMock.mock.calls.length)

    expect(routerReplaceMock.mock.calls.length).to.eq(1)
    expect(routerReplaceMock.mock.calls[0][0]).to.eq('/login')
  })

  it('shows error with invalid token', () => {
    component = mount(
      EmailVerify,
      generateMountOptions(['apollo'], {
        apollo: {
          mutationCallstack: [
            GenericApolloResponse('verifyAccount', GenericErrorsResponse()),
          ],
        },
        mocks: {
          $route: {
            params: {
              token: 'invalidCode',
            },
          },
        },
      })
    )

    return waitFor(() => !component.vm.loading).then(() => {
      expect(component.text()).to.contain('There was an error')
    })
  })
})
