import { mount } from '@vue/test-utils'
import { expect } from 'chai'

import Booking from '@/classes/Booking'
import Ticket from '@/classes/Ticket'
import TicketsMatrix from '@/classes/TicketsMatrix'
import TicketSelectionStage from '@/pages/production/_slug/book/_performanceId/tickets.vue'
import SelectedTicketsTable from '@/components/booking/SelectedTicketsTable.vue'
import TicketOptions from '@/components/booking/TicketOptions.vue'

import FullBooking from '@/tests/unit/fixtures/instances/FullBooking'
import GenericApolloResponse from '@/tests/unit/fixtures/support/GenericApolloResponse'
import GenericMutationResponse from '@/tests/unit/fixtures/support/GenericMutationResponse'
import { generateMountOptions } from '../../../helpers'

describe('Ticket Selection Stage', () => {
  let stageComponent
  let ticketTypes
  let production
  let performance

  beforeEach(() => {
    const bookingMock = FullBooking()
    production = bookingMock.performance.production
    performance = bookingMock.performance

    ticketTypes = new TicketsMatrix(performance)
    const booking = new Booking()
    booking.performance = performance

    stageComponent = mount(
      TicketSelectionStage,
      generateMountOptions(['apollo'], {
        propsData: {
          production,
          booking,
          ticketMatrix: ticketTypes,
        },
      })
    )
  })

  it('displays the available seat locations', () => {
    expect(stageComponent.findComponent(TicketOptions).exists()).to.be.true
    expect(
      stageComponent.findComponent(TicketOptions).props('ticketMatrix')
    ).to.eq(stageComponent.vm.ticketMatrix)
    expect(stageComponent.findComponent(TicketOptions).props('booking')).to.eq(
      stageComponent.vm.booking
    )
  })

  it('reacts to request update event', async () => {
    expect(stageComponent.vm.booking.dirty).to.be.true
    stageComponent.vm.$apollo.mutationCallstack.push(
      GenericApolloResponse(
        'createBooking',
        GenericMutationResponse({ booking: FullBooking({ tickets: [] }) })
      )
    )
    await stageComponent.findComponent(TicketOptions).vm.$emit('request-update')
    await stageComponent.vm.$nextTick()

    expect(stageComponent.vm.booking.dirty).to.be.false
  })

  describe('with selected tickets', () => {
    beforeEach(async () => {
      const booking = new Booking()
      booking.performance = performance
      booking.tickets = [
        new Ticket(
          performance.ticketOptions[0].seatGroup.id,
          performance.ticketOptions[0].concessionTypes[0].concessionType.id
        ),
        new Ticket(
          performance.ticketOptions[0].seatGroup.id,
          performance.ticketOptions[0].concessionTypes[0].concessionType.id
        ),
        new Ticket(
          performance.ticketOptions[0].seatGroup.id,
          performance.ticketOptions[0].concessionTypes[1].concessionType.id
        ),
        new Ticket(
          performance.ticketOptions[1].seatGroup.id,
          performance.ticketOptions[0].concessionTypes[1].concessionType.id
        ),
      ]
      await stageComponent.setProps({
        booking,
      })
    })

    it('displays selected tickets', () => {
      expect(stageComponent.findComponent(SelectedTicketsTable).exists()).to.be
        .true
      expect(
        stageComponent.findComponent(SelectedTicketsTable).props('booking')
      ).to.eq(stageComponent.vm.booking)
      expect(
        stageComponent.findComponent(SelectedTicketsTable).props('ticketMatrix')
      ).to.eq(stageComponent.vm.ticketMatrix)
    })
  })
})
