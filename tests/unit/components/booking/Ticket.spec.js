import { mount } from '@vue/test-utils';
import { expect } from 'chai';
import QrcodeVue from 'qrcode.vue';

import Booking from '@/classes/Booking';
import Ticket from '@/components/booking/Ticket.vue';

import FakeBooking from '../../fixtures/FakeBooking';
import { executeWithServer, runApolloQuery } from '../../helpers';

describe('Ticket component', function () {
  let ticketComponent;
  let booking = new Booking();

  beforeAll(async () => {
    await executeWithServer(async (server) => {
      let bookingModel = FakeBooking(server);

      let { data } = await runApolloQuery({
        query: require('@/graphql/queries/BookingInformation.gql'),
        variables: {
          bookingId: bookingModel.id,
        },
      });
      let bookingData = Object.assign({}, data.booking, {
        status: 'PAID',
        reference: 'ABS1352EBV54',
        performance: {
          production: { name: 'Legally Ginger', slug: 'legally-ginger' },
          doorsOpen: '2019-10-07T17:00:00',
          start: '2019-10-07T18:00:00',
        },
      });
      booking.updateFromAPIData(bookingData);
    });
    ticketComponent = mount(Ticket, {
      propsData: {
        booking: booking,
        ticket: booking.tickets[0],
        user: {
          firstName: 'Alex',
          lastName: 'Toof',
        },
        index: 1,
      },
      stubs: ['qrcode-vue'],
    });
  });

  it('has qrCode component', () => {
    expect(ticketComponent.findComponent(QrcodeVue).exists()).to.be.true;

    expect(
      ticketComponent.vm.ticket.generateQRCodeString(
        ticketComponent.vm.booking.reference
      )
    ).to.eq('QUJTMTM1MkVCVjU0LDE=');
  });

  it('has the correct data', () => {
    expect(ticketComponent.text()).to.contain('Legally Ginger');
    expect(ticketComponent.text()).to.contain('Monday 7 October 2019');
    expect(ticketComponent.text()).to.contain('Doors: 5:00 PM');
    expect(ticketComponent.text()).to.contain('Start: 6:00 PM');

    expect(ticketComponent.text()).to.contain('1x Adult');
    expect(ticketComponent.text()).to.contain('Best seats in the house');
    expect(ticketComponent.text()).to.contain('Booking Ref: ABS1352EBV54');
    expect(ticketComponent.text()).to.contain('Booked By: Alex Toof');

    expect(ticketComponent.text()).to.contain('01');
  });
});
