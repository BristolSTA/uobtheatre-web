import { mount } from '@vue/test-utils';
import { expect } from 'chai';

import Ticket from '@/classes/Ticket';
import ConcessionType from '@/components/booking/ConcessionType.vue';
import GroupTicketButton from '@/components/booking/GroupTicketButton.vue';
import SeatGroup from '@/components/booking/SeatGroup.vue';

import FakeDiscount from '../../fixtures/FakeDiscount';
import FakeTicketOption from '../../fixtures/FakeTicketOption';

describe('Seat Location Component', () => {
  let seatGroupComponent;
  beforeEach(() => {
    seatGroupComponent = mount(SeatGroup, {
      propsData: {
        expanded: false,
        ticket_option: FakeTicketOption,
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
  it('doesnt display concession types if not exapnded', async () => {
    expect(seatGroupComponent.findAllComponents(ConcessionType).length).to.eq(
      0
    );
  });
  it('displays seat group description if expanded', async () => {
    let header = seatGroupComponent.findComponent({ ref: 'header' });
    expect(header.text()).not.to.contain('The best seats obviously');
    await seatGroupComponent.setProps({
      expanded: true,
    });
    expect(header.text()).to.contain('The best seats obviously');
  });
  it('contains the correct ammount of concession type components', async () => {
    let tickets = [new Ticket(1, 1), new Ticket(1, 1), new Ticket(1, 2)];
    await seatGroupComponent.setProps({
      expanded: true,
      current_tickets: tickets,
    });
    let components = seatGroupComponent.findAllComponents(ConcessionType);
    expect(components.length).to.eq(2);

    expect(components.at(0).props('concession_type')).to.eq(
      FakeTicketOption.concession_types[0]
    );

    expect(components.at(0).props('max_add_allowed')).to.eq(100);

    expect(components.at(0).props('current_tickets').length).to.eq(3);

    expect(components.at(1).props('concession_type')).to.eq(
      FakeTicketOption.concession_types[1]
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
        FakeTicketOption.seat_group,
        FakeDiscount.discount_requirements[0].concession_type,
        FakeDiscount.discount_requirements[0].number,
      ])
    );
    expect(JSON.stringify(seatGroupComponent.emitted()['add-ticket'][1])).to.eq(
      JSON.stringify([
        FakeTicketOption.seat_group,
        FakeDiscount.discount_requirements[1].concession_type,
        FakeDiscount.discount_requirements[1].number,
      ])
    );
  });
});
