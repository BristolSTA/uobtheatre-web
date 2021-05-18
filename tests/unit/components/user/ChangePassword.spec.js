import { mount } from '@vue/test-utils'
import { expect } from 'chai'

import NonFieldError from '@/components/ui/NonFieldError.vue'
import ChangePassword from '@/components/user/ChangePassword.vue'
import { swalToast } from '@/utils'

import { generateMountOptions, waitFor } from '../../helpers'
import GenericApolloResponse from '../../fixtures/support/GenericApolloResponse'
import GenericMutationResponse from '../../fixtures/support/GenericMutationResponse'
import GenericError from '../../fixtures/support/GenericError'
import GenericErrorsResponse from '../../fixtures/support/GenericErrorsResponse'

describe('Change Password', () => {
  it('can update their password', async () => {
    const component = mount(
      ChangePassword,
      generateMountOptions(['apollo'], {
        apollo: {
          mutationCallstack: [
            GenericApolloResponse('passwordChange', GenericMutationResponse()),
          ],
        },
      })
    )
    const stub = jest.spyOn(swalToast, 'fire')
    const inputs = component.findAll('input')
    inputs.at(0).setValue('oldPassword')
    inputs.at(1).setValue('newPassword')
    inputs.at(2).setValue('newPassword')
    await component.find('form').trigger('submit')

    await waitFor(() => stub.mock.calls.length)
    await component.vm.$nextTick()
    expect(stub.mock.calls).length(1)

    expect(component.emitted('cancel')).length(1)
  })

  it('can show errors', async () => {
    const component = mount(
      ChangePassword,
      generateMountOptions(['apollo'], {
        apollo: {
          mutationCallstack: [
            GenericApolloResponse(
              'passwordChange',
              GenericErrorsResponse(GenericError('Passwords dont match'))
            ),
          ],
        },
      })
    )
    expect(component.findComponent(NonFieldError).exists()).to.be.true

    const inputs = component.findAll('input')
    inputs.at(0).setValue('oldPassword')
    inputs.at(1).setValue('newPassword')
    inputs.at(2).setValue('newPasswordDoesntMatch')
    await component.find('form').trigger('submit')

    await waitFor(() => component.vm.errors)

    expect(component.text()).to.contain('Passwords dont match')
  })
})
