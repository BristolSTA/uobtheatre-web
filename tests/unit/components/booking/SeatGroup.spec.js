import { mount } from '@vue/test-utils';
import { expect } from 'chai';

import Ticket from '@/classes/Ticket';
import ConcessionType from '@/components/booking/ConcessionType.vue';
import GroupTicketButton from '@/components/booking/GroupTicketButton.vue';
import SeatGroup from '@/components/booking/SeatGroup.vue';

import FakeDiscount from '../../fixtures/FakeDiscount';
import FakeTicketOption from '../../fixtures/FakeTicketOption';
import { fixTextSpacing } from '../../helpers';

describe('Seat Location Component', () => {
  let seatGroupComponent;
  let ticketOption;
  beforeEach(() => {
    seatGroupComponent = mount(SeatGroup, {
      propsData: {
        expanded: false,
        ticket_option: (ticketOption = FakeTicketOption()),
        group_capacity_remaining: 100,
        current_tickets: [],
        discounts: [FakeDiscount],
      },
    });
  });

  it('emits even on header click', async () => {
    await seatGroupComponent.findComponent({ ref: 'header' }).trigger('click');
    expect(seatGroupComponent.emitted()['select-location'].length).to.eq(1);
  });

  it('displays seat group name', () => {
    expect(
      seatGroupComponent.findComponent({ ref: 'header' }).text()
    ).to.contain('Best Seats in the House');
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
      group_capacity_remaining: 9,
    });
    expect(fixTextSpacing(seatGroupComponent.text())).to.contain(
      'Hurry! Only 9 tickets remaining in this location'
    );

    //check for upper limit
    await seatGroupComponent.setProps({ group_capacity_remaining: 10 });
    expect(seatGroupComponent.text()).not.to.contain('Hurry!');

    //check for lower limit
    await seatGroupComponent.setProps({ group_capacity_remaining: 1 });
    expect(fixTextSpacing(seatGroupComponent.text())).to.contain(
      'Hurry! Only 1 ticket remaining in this location'
    );

    await seatGroupComponent.setProps({ group_capacity_remaining: 0 });
    expect(fixTextSpacing(seatGroupComponent.text())).to.contain(
      'No more tickets available at this location'
    );
  });

  it('contains the correct ammount of concession type components', async () => {
    let tickets = [new Ticket(1, 1), new Ticket(1, 1), new Ticket(1, 2)];
    await seatGroupComponent.setProps({
      expanded: true,
      current_tickets: tickets,
    });

    expect(seatGroupComponent.findComponent({ ref: 'ticket-warning' }).exists())
      .to.be.false;

    let components = seatGroupComponent.findAllComponents(ConcessionType);
    expect(components.length).to.eq(2);

    expect(components.at(0).props('concession_type')).to.include(
      FakeTicketOption().concession_types[0]
    );

    expect(components.at(0).props('max_add_allowed')).to.eq(100);

    expect(components.at(0).props('current_tickets').length).to.eq(3);

    expect(components.at(1).props('concession_type')).to.include(
      FakeTicketOption().concession_types[1]
    );
    expect(components.at(1).props('current_tickets').length).to.eq(3);
  });

  it('contains the correct amount of group ticket buttons', async () => {
    await seatGroupComponent.setProps({
      expanded: true,
    });
    let discountComponents = seatGroupComponent.findAllComponents(
      GroupTicketButton
    );
    expect(discountComponents.length).to.eq(1);
    expect(discountComponents.at(0).props('discount')).to.eq(FakeDiscount);
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
        FakeTicketOption().seat_group,
        FakeDiscount.discount_requirements[0].concession_type,
        FakeDiscount.discount_requirements[0].number,
      ])
    );
    expect(JSON.stringify(seatGroupComponent.emitted()['add-ticket'][1])).to.eq(
      JSON.stringify([
        FakeTicketOption().seat_group,
        FakeDiscount.discount_requirements[1].concession_type,
        FakeDiscount.discount_requirements[1].number,
      ])
    );
  });
  it('doesnt display group ticket buttons if the remaining capacity doesnt allow for it', async () => {
    await seatGroupComponent.setProps({
      group_capacity_remaining: 2,
    });
    expect(
      seatGroupComponent.findAllComponents(GroupTicketButton).length
    ).to.eq(0);
  });
  describe('sold out group', () => {
    beforeEach(() => {
      seatGroupComponent.setProps({
        group_capacity_remaining: 0,
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
          current_tickets: [
            new Ticket(
              ticketOption.seat_group.id,
              ticketOption.concession_types[0].id
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
