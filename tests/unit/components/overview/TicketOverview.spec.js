import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { expect } from 'chai';

import Booking from '@/classes/Booking';
import OverviewBox from '@/components/overview/OverviewBox.vue';
import TicketsOverview from '@/components/overview/TicketsOverview.vue';

import { mountWithRouterMock } from '../../helpers';
import {
  createFromFactoryAndSerialize,
  executeWithServer,
  fixTextSpacing,
} from '../../helpers';

describe('performance overview box', function () {
  let ticketOverviewComponent;
  let booking = new Booking();

  beforeAll(async () => {
    let booking_data;
    executeWithServer((server) => {
      let front_row_seat_group = server.create('concessionType', {
        name: 'Adult',
      });
      let adult_conc_type = server.create('seatGroup', {
        name: 'Front Row',
      });

      booking_data = createFromFactoryAndSerialize(
        'booking',
        1,
        {
          tickets: [
            server.create('ticket', {
              seat_group: front_row_seat_group,
              concession_type: adult_conc_type,
            }),
            server.create('ticket', {
              seat_group: front_row_seat_group,
              concession_type: adult_conc_type,
            }),
            server.create('ticket', {
              seat_group: front_row_seat_group,
              concession_type: server.create('concessionType', {
                name: 'Child',
              }),
            }),
            server.create('ticket', {
              seat_group: server.create('seatGroup', {
                name: 'Back Row',
              }),
              concession_type: server.create('concessionType', {
                name: 'Student',
              }),
            }),
          ],
          misc_costs: [server.create('miscCost')],
        },
        server
      );
    });

    booking.updateFromAPIData(booking_data);

    ticketOverviewComponent = await mountWithRouterMock(TicketsOverview, {
      propsData: {
        booking: booking,
      },
    });
  });

  it('has overview box component', async () => {
    expect(ticketOverviewComponent.findComponent(OverviewBox).exists()).to.be
      .true;

    expect(ticketOverviewComponent.text()).to.contain('Tickets');

    expect(
      ticketOverviewComponent.findAllComponents(FontAwesomeIcon).length
    ).to.equal(2);

    expect(ticketOverviewComponent.text()).to.contain(
      'All our tickets are fulfilled digitally'
    );
    expect(ticketOverviewComponent.text()).to.contain(
      'Display on your phone or print'
    );
  });

  it('have correct ticket info', () => {
    let seat_group_boxes = ticketOverviewComponent.findAll('div.bg-sta-gray');

    expect(seat_group_boxes.length).to.equal(2);

    expect(seat_group_boxes.at(0).text()).to.contain('Front Row');
    expect(fixTextSpacing(seat_group_boxes.at(0).text())).to.contain(
      '2 x Adult'
    );
    expect(fixTextSpacing(seat_group_boxes.at(0).text())).to.contain(
      '1 x Child'
    );

    expect(seat_group_boxes.at(1).text()).to.contain('Back Row');
    expect(fixTextSpacing(seat_group_boxes.at(1).text())).to.contain(
      '1 x Student'
    );
  });
});
