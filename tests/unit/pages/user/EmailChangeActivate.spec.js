import { mount } from '@vue/test-utils'
import { expect } from 'chai'

import EmailChangeActivate from '@/pages/user/email-change/_token/index.vue'
import { generateMountOptions, waitFor } from '../../helpers'
import GenericApolloResponse from '../../fixtures/support/GenericApolloResponse'
import GenericMutationResponse from '../../fixtures/support/GenericMutationResponse'
import GenericErrorsResponse from '../../fixtures/support/GenericErrorsResponse'

describe('Email Change Activate', function () {
  let component

  it('adds secondary email with valid token', async () => {
    component = mount(
      EmailChangeActivate,
      generateMountOptions(['apollo'], {
        apollo: {
          mutationCallstack: [
            GenericApolloResponse(
              'verifySecondaryEmail',
              GenericMutationResponse()
            ),
          ],
        },
        mocks: {
          $route: {
            params: {
              token: '1234abcd',
            },
          },
        },
      })
    )

    expect(component.text()).to.contain('Adding email')

    await waitFor(() => component.vm.addedOk)

    expect(component.text()).to.contain('Complete email change')
    expect(component.findAll('input')).length(1)
  })

  it('shows error with invalid token', () => {
    component = mount(
      EmailChangeActivate,
      generateMountOptions(['apollo'], {
        apollo: {
          mutationCallstack: [
            GenericApolloResponse(
              'verifySecondaryEmail',
              GenericErrorsResponse()
            ),
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

  describe('with added secondary email', () => {
    let replaceStub
    beforeEach(async () => {
      component = mount(
        EmailChangeActivate,
        generateMountOptions(['apollo'], {
          propsData: {
            token: '1234abcd',
          },
          apollo: {
            mutationCallstack: [
              GenericApolloResponse(
                'verifySecondaryEmail',
                GenericMutationResponse()
              ),
              GenericApolloResponse('swapEmails', GenericMutationResponse()),
              GenericApolloResponse(
                'removeSecondaryEmail',
                GenericMutationResponse()
              ),
            ],
          },
          mocks: {
            $router: {
              replace: (replaceStub = jest.fn()),
            },
            $route: {
              params: {
                token: '1234abcd',
              },
            },
          },
        })
      )
      await waitFor(() => component.vm.addedOk)
    })

    it('can enter password to swap', async () => {
      component.find('input').setValue('mypassword')
      component.find('form').trigger('submit')

      await waitFor(() => replaceStub.mock.calls.length)

      expect(replaceStub.mock.calls).length(1)
      expect(replaceStub.mock.calls[0][0]).to.eq('/user')
    })
  })
})
