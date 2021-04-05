import { mount } from '@vue/test-utils'
import { expect } from 'chai'

import EmailChangeActivate from '@/pages/user/email-change/_token/index.vue'
import { executeWithServer, generateMountOptions, waitFor } from '../../helpers'

describe('Email Change Activate', function () {
  let component, server

  beforeAll(async () => {
    server = await executeWithServer(null, false)
  })

  afterAll(() => {
    server.shutdown()
  })

  it('adds secondary email with valid token', async () => {
    component = mount(
      EmailChangeActivate,
      generateMountOptions(['apollo'], {
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
      expect(replaceStub.mock.calls[0][0].name).to.eq('user')
    })
  })
})
