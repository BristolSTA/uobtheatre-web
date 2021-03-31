import { mount } from '@vue/test-utils'
import { expect } from 'chai'
import gql from 'graphql-tag'

import GroupTicketButton from '@/components/booking/GroupTicketButton.vue'

import FakePerformance from '../../fixtures/FakePerformance'
import { executeWithServer, runApolloQuery } from '../../helpers'

describe('Group Ticket Button', () => {
  let buttonComponent
  beforeEach(async () => {
    await executeWithServer(async (server) => {
      const performance = server.create(
        'performanceNode',
        FakePerformance(server)
      )
      const { data } = await runApolloQuery({
        query: gql`
          {
            performance(id: ${performance.id}) {
              discounts {
                name
                seatGroup {
                  id
                  name
                }
                requirements {
                  number
                  concessionType {
                    id
                    name
                  }
                }
              }
            }
          }
        `,
      })

      buttonComponent = mount(GroupTicketButton, {
        propsData: {
          discount: data.performance.discounts[0],
        },
      })
    })
  })

  it('displays the discounts name', () => {
    expect(buttonComponent.text()).to.contain('Family Discount')
  })

  it('displays the discounts requirements', () => {
    expect(buttonComponent.text()).to.contain('Adult x 1')
    expect(buttonComponent.text()).to.contain('Student x 2')
  })

  it('emits an event when add tickets button clicked', async () => {
    await buttonComponent.find('button').trigger('click')

    expect(buttonComponent.emitted()['add-discount-tickets'].length).to.eq(1)
  })
})
