import { mount } from '@vue/test-utils'
import { expect } from 'chai'

import TextInput from '@/components/ui/TextInput.vue'
import ChangeEmail from '@/components/user/ChangeEmail.vue'
import ChangePassword from '@/components/user/ChangePassword.vue'
import UserDetails from '@/components/user/UserDetails.vue'
import { swalToast } from '@/utils'

import { generateMountOptions, waitFor } from '../../helpers'
import GenericMutationResponse from '../../fixtures/support/GenericMutationResponse'
import GenericApolloResponse from '../../fixtures/support/GenericApolloResponse'

describe('User Details', () => {
  let userDetailsComponent

  beforeEach(() => {
    userDetailsComponent = mount(
      UserDetails,
      generateMountOptions(['apollo', 'config'], {
        propsData: {
          user: {
            firstName: 'Joe',
            lastName: 'Bloggs',
            email: 'joe.bloggs@example.org',
          },
        },
        apollo: {
          mutationResponses: [
            GenericApolloResponse('updateAccount', GenericMutationResponse()),
          ],
        },
      })
    )
  })

  it('shows user details when not editing', () => {
    expect(userDetailsComponent.text()).to.contain('Joe')
    expect(userDetailsComponent.text()).to.contain('Bloggs')
    expect(userDetailsComponent.text()).to.contain('joe.bloggs@example.org')
  })

  it('shows can start editing', async () => {
    const button = userDetailsComponent.find('button')
    expect(button.text()).to.contain('Edit Details')

    await button.trigger('click')

    expect(userDetailsComponent.vm.editing).to.be.true
    expect(userDetailsComponent.findAllComponents(TextInput)).length(2)
  })

  describe('while editing', () => {
    beforeEach(async () => {
      await userDetailsComponent.setData({
        editing: true,
      })
    })
    it('can update their name', async () => {
      const swalToastStub = jest.spyOn(swalToast, 'fire')
      const firstNameInput = userDetailsComponent.find('input')
      const lastNameInput = userDetailsComponent.findAll('input').at(1)

      expect(firstNameInput.element.value).to.eq('Joe')
      expect(lastNameInput.element.value).to.eq('Bloggs')

      firstNameInput.setValue('Joes')
      lastNameInput.setValue('Blogger')

      userDetailsComponent.find('form').trigger('submit')

      await waitFor(() => swalToastStub.mock.calls.length)

      expect(swalToastStub.mock.calls).length(1)
    })
    it('can cancel update', async () => {
      await userDetailsComponent.findAll('button').at(3).trigger('click')
      expect(userDetailsComponent.findAllComponents(TextInput)).length(0)
      expect(userDetailsComponent.vm.editing).to.be.false
    })
    it('can update their email', async () => {
      await userDetailsComponent.findAll('button').at(0).trigger('click')
      expect(userDetailsComponent.findComponent(ChangeEmail).exists()).to.be
        .true
    })
    it('can update their password', async () => {
      await userDetailsComponent.findAll('button').at(1).trigger('click')
      expect(userDetailsComponent.findComponent(ChangePassword).exists()).to.be
        .true
    })
  })
})
