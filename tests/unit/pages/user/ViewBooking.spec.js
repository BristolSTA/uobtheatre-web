import { expect } from 'chai'

import PaymentOverview from '@/components/booking/overview/PaymentOverview.vue'
import PerformanceOverview from '@/components/booking/overview/PerformanceOverview.vue'
import TicketsOverview from '@/components/booking/overview/TicketsOverview.vue'
import VenueOverview from '@/components/booking/overview/VenueOverview.vue'
import Ticket from '@/components/booking/Ticket.vue'
import ViewBooking from '@/pages/user/booking/_reference/index'

import FakeBooking from '../../fixtures/Booking.js'
import { generateMountOptions, mountWithRouterMock } from '../../helpers'
import GenericApolloResponse from '../../fixtures/support/GenericApolloResponse.js'
import User from '../../fixtures/User.js'
import GenericNodeConnection from '../../fixtures/support/GenericNodeConnection.js'

describe('View Booking', () => {
  let viewBookingComponent

  beforeEach(async () => {
    viewBookingComponent = await mountWithRouterMock(
      ViewBooking,
      generateMountOptions(['apollo'], {
        apollo: {
          queryCallstack: [
            GenericApolloResponse(
              'me',
              User({
                bookings: GenericNodeConnection([FakeBooking()]),
              })
            ),
          ],
        },
        mocks: {
          $store: {
            state: {
              auth: {
                user: {
                  firstName: 'Alex',
                  lastName: 'Toof',
                },
              },
            },
          },
        },
        stubs: { 'qrcode-vue': true },
      }),
      {
        params: {
          reference: 'ABS1352EBV54',
        },
      }
    )
    await viewBookingComponent.vm.$nextTick()
  })

  it('contains correct components', () => {
    expect(viewBookingComponent.findComponent(PerformanceOverview).exists()).to
      .be.true
    expect(viewBookingComponent.findComponent(VenueOverview).exists()).to.be
      .true
    expect(viewBookingComponent.findComponent(TicketsOverview).exists()).to.be
      .true
    expect(viewBookingComponent.findComponent(PaymentOverview).exists()).to.be
      .true
  })

  it('has working ticket dropdown', async () => {
    const ticketbanner = viewBookingComponent.findComponent({ ref: 'tickets' })

    expect(viewBookingComponent.vm.expanded).to.be.false
    expect(viewBookingComponent.findAllComponents(Ticket).length).to.eq(0)

    await ticketbanner.trigger('click')

    expect(viewBookingComponent.findAllComponents(Ticket).length).to.eq(1)

    await ticketbanner.trigger('click')
    expect(viewBookingComponent.vm.expanded).to.be.false
    expect(viewBookingComponent.findAllComponents(Ticket).length).to.eq(0)
  })

  it('scrolls to tickets on btn', () => {
    viewBookingComponent.vm.$refs.tickets.scrollIntoView = jest.fn()
    expect(viewBookingComponent.vm.expanded).to.be.false

    viewBookingComponent.find('#ticket-jump').trigger('click')
    expect(viewBookingComponent.vm.expanded).to.be.true
    expect(
      viewBookingComponent.vm.$refs.tickets.scrollIntoView.mock.calls
    ).length(1)
  })
})
