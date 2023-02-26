import { mount } from '#testSupport/helpers';
import { expect } from 'vitest';
import QrcodeVue from 'qrcode.vue';

import BookingFixture from '#testSupport/fixtures/Booking';
import Booking from '~~/classes/Booking';
import Ticket from '@/components/booking/Ticket.vue';

describe('Ticket component', function () {
  let ticketComponent;
  const booking = new Booking();

  beforeAll(async () => {
    booking.updateFromAPIData(BookingFixture());
    ticketComponent = await mount(Ticket, {
      props: {
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
    });
  });

  it('has qrCode component', () => {
    expect(ticketComponent.findComponent(QrcodeVue).exists()).to.be.true;

    expect(
      ticketComponent.vm.ticket.generateQRCodeString(
        ticketComponent.vm.reference
      )
    ).to.eq('WyJ5T0lZZzZDbzh2R1IiLDFd');
  });

  it('has the correct data', () => {
    expect(ticketComponent.text()).to.contain('Legally Ginger');
    expect(ticketComponent.text()).to.contain('Monday 9 March 2020');

    // We have to replace some werid hidden characters that seem to be generated by the localised time
    expect(ticketComponent.text().replace(/\u202f/g, ' ')).to.contain(
      'Doors: 3:00 PM'
    );
    expect(ticketComponent.text().replace(/\u202f/g, ' ')).to.contain(
      'Start: 4:00 PM'
    );

    expect(ticketComponent.text()).to.contain('1x Adult');
    expect(ticketComponent.text()).to.contain('Best seats in the house');
    expect(ticketComponent.text()).to.contain('Booking Ref: yOIYg6Co8vGR');
    expect(ticketComponent.text()).to.contain('Booked By: Alex Toof');

    expect(ticketComponent.text()).to.contain('1');
  });
});
