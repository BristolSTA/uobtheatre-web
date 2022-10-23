import { mount } from '@vue/test-utils'
import { expect } from 'chai'
import QrcodeVue from 'qrcode.vue'

import BookingFixture from '../../fixtures/Booking'
import Booking from '@/classes/Booking'
import Ticket from '@/components/booking/Ticket.vue'

describe('Ticket component', function () {
  let ticketComponent
  const booking = new Booking()

  beforeAll(() => {
    booking.updateFromAPIData(BookingFixture())
    ticketComponent = mount(Ticket, {
      propsData: {
        performance: booking.performance,
        ticket: booking.tickets[0],
        reference: booking.reference,
        user: {
          firstName: 'Alex',
          lastName: 'Toof'
        },
        index: 1
      },
      stubs: ['qrcode-vue']
    })
  })

  it('has qrCode component', () => {
    expect(ticketComponent.findComponent(QrcodeVue).exists()).to.be.true

    expect(
      ticketComponent.vm.ticket.generateQRCodeString(
        ticketComponent.vm.reference
      )
    ).to.eq('WyJ5T0lZZzZDbzh2R1IiLDFd')
  })

  it('has the correct data', () => {
    expect(ticketComponent.text()).to.contain('Legally Ginger')
    expect(ticketComponent.text()).to.contain('Monday 9 March 2020')
    expect(ticketComponent.text()).to.contain('Doors: 3:00 PM')
    expect(ticketComponent.text()).to.contain('Start: 4:00 PM')

    expect(ticketComponent.text()).to.contain('1x Adult')
    expect(ticketComponent.text()).to.contain('Best seats in the house')
    expect(ticketComponent.text()).to.contain('Booking Ref: yOIYg6Co8vGR')
    expect(ticketComponent.text()).to.contain('Booked By: Alex Toof')

    expect(ticketComponent.text()).to.contain('1')
  })
})
