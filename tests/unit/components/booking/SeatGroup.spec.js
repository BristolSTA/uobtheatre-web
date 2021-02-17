import { mount } from '@vue/test-utils';
import { expect } from 'chai';

import Ticket from '@/classes/Ticket';
import ConcessionType from '@/components/booking/ConcessionType.vue';
import GroupTicketButton from '@/components/booking/GroupTicketButton.vue';
import SeatGroup from '@/components/booking/SeatGroup.vue';

import FakePerformance from '../../fixtures/FakePerformance';
import {
  executeWithServer,
  fixTextSpacing,
  runApolloQuery,
} from '../../helpers';

describe('Seat Location Component', () => {
  let seatGroupComponent;
  let ticketOption;
  let discounts;
  beforeEach(async () => {
    await executeWithServer(async (server) => {
      let performance = server.create(
        'performanceNode',
        FakePerformance(server)
      );
      let { data } = await runApolloQuery({
        query: require('@/graphql/queries/PerformanceTicketOptions.gql'),
        variables: {
          id: performance.id,
        },
      });
      seatGroupComponent = mount(SeatGroup, {
        propsData: {
          expanded: false,
          ticketOption: (ticketOption = data.performance.ticketOptions[0]),
          groupCapacityRemaining: 100,
          currentTickets: [],
          discounts: (discounts = data.performance.discounts),
        },
      });
    });
  });

  it('emits even on header click', async () => {
    await seatGroupComponent.findComponent({ ref: 'header' }).trigger('click');
    expect(seatGroupComponent.emitted()['select-location'].length).to.eq(1);
  });

  it('displays seat group name', () => {
    expect(
      seatGroupComponent.findComponent({ ref: 'header' }).text()
    ).to.contain('Best seats in the house');
  });

  it('doesnt display concession types + ticket warnings if not exapnded', async () => {
    expect(seatGroupComponent.findAllComponents(ConcessionType).length).to.eq(
      0
    );

    expect(seatGroupComponent.findComponent({ ref: 'ticket-warning' }).exists())
      .to.be.false;
  });

  it('displays seat group description if expanded', async () => {
    let header = seatGroupComponent.findComponent({ ref: 'header' });
    expect(header.text()).not.to.contain('The best seats obviously');
    await seatGroupComponent.setProps({
      expanded: true,
    });
    expect(header.text()).to.contain('The best seats obviously');
  });

  it('displays correct ticket warnings', async () => {
    await seatGroupComponent.setProps({
      expanded: true,
      groupCapacityRemaining: 9,
    });
    expect(fixTextSpacing(seatGroupComponent.text())).to.contain(
      'Hurry! Only 9 tickets remaining in this location'
    );

    //check for upper limit
    await seatGroupComponent.setProps({ groupCapacityRemaining: 10 });
    expect(seatGroupComponent.text()).not.to.contain('Hurry!');

    //check for lower limit
    await seatGroupComponent.setProps({ groupCapacityRemaining: 1 });
    expect(fixTextSpacing(seatGroupComponent.text())).to.contain(
      'Hurry! Only 1 ticket remaining in this location'
    );

    await seatGroupComponent.setProps({ groupCapacityRemaining: 0 });
    expect(fixTextSpacing(seatGroupComponent.text())).to.contain(
      'No more tickets available at this location'
    );
  });

  it('contains the correct ammount of concession type components', async () => {
    let tickets = [new Ticket(1, 1), new Ticket(1, 1), new Ticket(1, 2)];
    await seatGroupComponent.setProps({
      expanded: true,
      currentTickets: tickets,
    });

    expect(seatGroupComponent.findComponent({ ref: 'ticket-warning' }).exists())
      .to.be.false;

    let components = seatGroupComponent.findAllComponents(ConcessionType);
    expect(components.length).to.eq(2);

    expect(
      components.at(0).props('concessionTypeEdge').concessionType.name
    ).to.eq('Adult');

    expect(components.at(0).props('maxAddAllowed')).to.eq(100);

    expect(components.at(0).props('currentTickets').length).to.eq(3);

    expect(
      components.at(1).props('concessionTypeEdge').concessionType.name
    ).to.eq('Student');
    expect(components.at(1).props('currentTickets').length).to.eq(3);
  });

  it('contains the correct amount of group ticket buttons', async () => {
    await seatGroupComponent.setProps({
      expanded: true,
    });
    let discountComponents = seatGroupComponent.findAllComponents(
      GroupTicketButton
    );
    expect(discountComponents.length).to.eq(1);
    expect(discountComponents.at(0).props('discount').name).to.eq(
      'Family Discount'
    );
  });

  it('handles add discount tickets event and emits add ticket(s) event', async () => {
    await seatGroupComponent.setProps({
      expanded: true,
    });
    await seatGroupComponent
      .findAllComponents(GroupTicketButton)
      .at(0)
      .vm.$emit('add-discount-tickets');
    expect(seatGroupComponent.emitted()['add-ticket'].length).to.eq(2);
    expect(JSON.stringify(seatGroupComponent.emitted()['add-ticket'][0])).to.eq(
      JSON.stringify([
        ticketOption.seatGroup,
        discounts[0].requirements[0].concessionType,
        discounts[0].requirements[0].number,
      ])
    );
    expect(JSON.stringify(seatGroupComponent.emitted()['add-ticket'][1])).to.eq(
      JSON.stringify([
        ticketOption.seatGroup,
        discounts[0].requirements[1].concessionType,
        discounts[0].requirements[1].number,
      ])
    );
  });
  it('doesnt display group ticket buttons if the remaining capacity doesnt allow for it', async () => {
    await seatGroupComponent.setProps({
      groupCapacityRemaining: 2,
    });
    expect(
      seatGroupComponent.findAllComponents(GroupTicketButton).length
    ).to.eq(0);
  });
  describe('sold out group', () => {
    beforeEach(() => {
      seatGroupComponent.setProps({
        groupCapacityRemaining: 0,
      });
    });

    it('doesnt emit on header click', async () => {
      await seatGroupComponent
        .findComponent({ ref: 'header' })
        .trigger('click');
      expect(seatGroupComponent.emitted()['select-location']).to.not.be.ok;
    });
    it('shows sold out', async () => {
      expect(
        seatGroupComponent.findComponent({ ref: 'header' }).text()
      ).to.contain('Sold Out');
    });

    describe('with tickets from group', () => {
      beforeEach(async () => {
        await seatGroupComponent.setProps({
          currentTickets: [
            new Ticket(
              ticketOption.seatGroup.id,
              ticketOption.concessionTypes[0].concessionType.id
            ),
          ],
        });
      });

      it('allows header click', async () => {
        await seatGroupComponent
          .findComponent({ ref: 'header' })
          .trigger('click');
        expect(seatGroupComponent.emitted()['select-location'].length).to.eq(1);
      });
      it('doesnt show sold out', async () => {
        expect(
          seatGroupComponent.findComponent({ ref: 'header' }).text()
        ).not.to.contain('Sold Out');
      });
    });
  });
});
