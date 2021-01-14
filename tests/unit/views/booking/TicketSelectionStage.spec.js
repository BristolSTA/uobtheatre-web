import { mount } from '@vue/test-utils';
import { expect } from 'chai';
import lo from 'lodash';

import Booking from '@/classes/Booking';
import Ticket from '@/classes/Ticket';
import TicketsMatrix from '@/classes/TicketsMatrix';
import SeatLocation from '@/components/booking/SeatLocation.vue';
import TicketSelectionStage from '@/views/booking/stages/TicketSelectionStage.vue';

import {
  createFromFactoryAndSerialize,
  executeWithServer,
  serialize,
  waitFor,
} from '../../helpers';

describe('Ticket Selection Stage', () => {
  let stageComponent;
  let production;
  let performance;
  let server;
  let ticket_types;

  beforeEach(async () => {
    server = executeWithServer((server) => {
      let productionModel = server.create('production');
      production = serialize(productionModel, server);
      performance = createFromFactoryAndSerialize(
        'performance',
        1,
        {
          production: productionModel,
          seat_groups: [
            server.create('seatGroup', {
              name: 'Best seats in the house',
              description: 'Right up close to the action',
            }),
            server.create('seatGroup', {
              name: 'The Meh Seats',
            }),
          ],
          concession_types: [
            server.create('concessionType', {
              name: 'Adult',
              price: 100,
            }),
            server.create('concessionType', {
              name: 'Child',
              price: 50,
            }),
          ],
          discounts: [
            server.create('discount', {
              discount: 0.5,
            }),
          ],
        },
        server
      );
    }, false);

    ticket_types = await fetch(
      `api/productions/myperf/performances/${performance.id}/ticket_types`
    );
    ticket_types = new TicketsMatrix(await ticket_types.json());
    let booking = new Booking();
    booking.performance = performance;

    stageComponent = mount(TicketSelectionStage, {
      propsData: {
        production: production,
        booking: booking,
        ticket_matrix: ticket_types,
      },
    });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('fetches discount options on created', async () => {
    await waitFor(() => stageComponent.vm.discounts);
    expect(stageComponent.vm.discounts.length).to.eq(1);
  });

  describe('with api calls complete', () => {
    beforeEach(async () => {
      await waitFor(() => stageComponent.vm.discounts);
    });
    it('displays the available seat locations', async () => {
      let seatLocationComponents = stageComponent.findAllComponents(
        SeatLocation
      );
      expect(seatLocationComponents.length).to.eq(2);
      expect(
        seatLocationComponents.at(0).props('seat_location').seat_group.name
      ).to.eq('Best seats in the house');
      expect(
        seatLocationComponents.at(1).props('seat_location').seat_group.name
      ).to.eq('The Meh Seats');
      expect(seatLocationComponents.at(1).props('discounts').length).to.eq(1);
      expect(
        seatLocationComponents.at(1).props('current_tickets').length
      ).to.eq(0);

      await stageComponent.vm.booking.tickets.push(new Ticket(1, 1));

      expect(
        seatLocationComponents.at(1).props('current_tickets').length
      ).to.eq(1);
    });

    it('reacts to select location event and toggles accordion', async () => {
      // By default, all should be collpased
      let seatLocationComponents = stageComponent.findAllComponents(
        SeatLocation
      );
      expect(
        !seatLocationComponents.at(0).props('expanded') &&
          !seatLocationComponents.at(0).props('expanded')
      ).to.be.true;

      await seatLocationComponents.at(0).vm.$emit('select-location');

      expect(seatLocationComponents.at(0).props('expanded')).to.be.true;
      expect(seatLocationComponents.at(1).props('expanded')).to.be.false;

      await seatLocationComponents.at(1).vm.$emit('select-location');
      expect(seatLocationComponents.at(0).props('expanded')).to.be.false;
      expect(seatLocationComponents.at(1).props('expanded')).to.be.true;

      await seatLocationComponents.at(1).vm.$emit('select-location');
      expect(seatLocationComponents.at(0).props('expanded')).to.be.false;
      expect(seatLocationComponents.at(1).props('expanded')).to.be.false;
    });

    it('reacts to add ticket event', async () => {
      stageComponent.vm.interaction_timer = jest.fn();
      await stageComponent
        .findComponent(SeatLocation)
        .vm.$emit(
          'add-ticket',
          ticket_types.ticket_options[0].seat_group,
          ticket_types.ticket_options[0].concession_types[0]
        );
      expect(stageComponent.vm.booking.tickets.length).to.eq(1);
      expect(stageComponent.vm.booking.tickets[0].seat_group.id).to.eq('1');
      expect(stageComponent.vm.booking.tickets[0].concession_type.id).to.eq(
        '1'
      );
      expect(stageComponent.vm.interaction_timer.mock.calls.length).to.eq(1);
    });

    it('reacts to add ticket event (multiple)', async () => {
      stageComponent.vm.interaction_timer = jest.fn();
      await stageComponent
        .findComponent(SeatLocation)
        .vm.$emit(
          'add-ticket',
          ticket_types.ticket_options[0].seat_group,
          ticket_types.ticket_options[0].concession_types[0],
          3
        );
      expect(stageComponent.vm.booking.tickets.length).to.eq(3);
      expect(stageComponent.vm.booking.tickets[0].seat_group.id).to.eq('1');
      expect(stageComponent.vm.booking.tickets[0].concession_type.id).to.eq(
        '1'
      );
      expect(stageComponent.vm.interaction_timer.mock.calls.length).to.eq(1);
    });

    it('reacts to set ticket number event', async () => {
      stageComponent.vm.interaction_timer = jest.fn();
      await stageComponent
        .findComponent(SeatLocation)
        .vm.$emit(
          'set-tickets',
          ticket_types.ticket_options[0].seat_group,
          ticket_types.ticket_options[0].concession_types[0],
          2
        );
      expect(stageComponent.vm.booking.tickets.length).to.eq(2);
      expect(stageComponent.vm.booking.tickets[0].seat_group.id).to.eq('1');
      expect(stageComponent.vm.booking.tickets[0].concession_type.id).to.eq(
        '1'
      );
      expect(stageComponent.vm.interaction_timer.mock.calls.length).to.eq(1);
    });

    it('reacts to remove ticket event', async () => {
      stageComponent.vm.interaction_timer = jest.fn();
      stageComponent.vm.booking.tickets = [new Ticket(1, 1)];
      await stageComponent
        .findComponent(SeatLocation)
        .vm.$emit(
          'remove-ticket',
          ticket_types.ticket_options[0].seat_group,
          ticket_types.ticket_options[0].concession_types[0]
        );
      expect(stageComponent.vm.booking.tickets.length).to.eq(0);
      expect(stageComponent.vm.interaction_timer.mock.calls.length).to.eq(1);
    });

    it('calls update API once interaction timer debounced', () => {
      jest.spyOn(lo, 'debounce');

      stageComponent = mount(TicketSelectionStage, {
        propsData: {
          production: production,
          booking: stageComponent.vm.booking,
          ticket_matrix: ticket_types,
        },
      });
      expect(lo.debounce.mock.calls.length).to.eq(1);
      expect(lo.debounce.mock.calls[0][0]).to.eq(stageComponent.vm.updateAPI);
      expect(lo.debounce.mock.calls[0][1]).to.eq(2000);

      lo.debounce.mockReset();
    });

    describe('with selected tickets', () => {
      beforeEach(async () => {
        let booking = new Booking();
        booking.performance = performance;
        booking.tickets = [
          new Ticket(1, 1),
          new Ticket(1, 1),
          new Ticket(1, 2),
          new Ticket(2, 2),
        ];
        await stageComponent.setProps({
          booking: booking,
        });
      });
      it('displays selected tickets', async () => {
        expect(stageComponent.text()).to.contain('Selected Tickets');
        let overview = stageComponent.find('table');

        // 3 unique combinations of seat group + conession type
        expect(overview.findAll('tbody tr').length).to.eq(3);

        // Test the first row
        let columns = overview.findAll('tbody tr:first-of-type td');
        expect(columns.at(0).text()).to.eq('Best seats in the house');
        expect(columns.at(1).text()).to.eq('Adult');
        expect(columns.at(2).text()).to.eq('2');
        expect(columns.at(3).text()).to.eq('£2.00');
      });
      it('shows discount line if discount applied', async () => {
        await stageComponent.vm.updateAPI(); // Need to fetch from API to get discount on the tickets

        expect(
          stageComponent.find('table tfoot tr:first-of-type th').text()
        ).to.eq('Discounts');
        expect(
          stageComponent
            .find('table tfoot tr:first-of-type td:last-of-type')
            .text()
        ).to.eq('-£0.50'); // Fake API will do discount * 100 (pennies)

        // Delete the discount
        server.schema.performances
          .find(performance.id)
          .discounts.models[0].destroy();

        await stageComponent.vm.updateAPI(); // Need to fetch from API to get discount on the tickets
        expect(stageComponent.find('table').text()).not.to.contain('Discounts');
      });
      it('shows subtotal', async () => {
        await stageComponent.vm.updateAPI(); // Need to fetch from API to get discount on the tickets

        expect(
          stageComponent.find('table tfoot tr:last-of-type').text()
        ).to.contain('Subtotal');
        expect(
          stageComponent.find('table tfoot tr:last-of-type').text()
        ).to.contain('£2.50'); // £3.00 of tickets - £0.50 of discount
      });
      it('shows loading spinner for subtotal while dirty', async () => {
        expect(stageComponent.find('table').text()).to.contain('Subtotal');
        expect(
          stageComponent
            .find('table tfoot tr:last-of-type svg[data-icon="circle-notch"]')
            .exists()
        ).to.be.true;

        await stageComponent.vm.updateAPI();

        expect(
          stageComponent
            .find('table tfoot tr:last-of-type svg[data-icon="circle-notch"]')
            .exists()
        ).not.to.be.true;
      });
    });
  });
});
