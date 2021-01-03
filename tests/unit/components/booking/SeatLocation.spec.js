import { mount } from '@vue/test-utils';
import { expect } from 'chai';

import Ticket from '@/classes/Ticket';
import ConcessionType from '@/components/booking/ConcessionType.vue';
import GroupTicketButton from '@/components/booking/GroupTicketButton.vue';
import SeatLocation from '@/components/booking/SeatLocation.vue';

import FakeDiscount from '../../fixtures/FakeDiscount';
import FakeSeatLocation from '../../fixtures/FakeSeatLocation';

describe('Seat Location Component', () => {
  let seatLocationComponent;
  beforeEach(() => {
    seatLocationComponent = mount(SeatLocation, {
      propsData: {
        expanded: false,
        seat_location: FakeSeatLocation,
        current_tickets: [],
        discounts: [FakeDiscount],
      },
    });
  });

  it('emits even on header click', async () => {
    await seatLocationComponent
      .findComponent({ ref: 'header' })
      .trigger('click');
    expect(seatLocationComponent.emitted()['select-location'].length).to.eq(1);
  });
  it('displays seat group name', () => {
    expect(
      seatLocationComponent.findComponent({ ref: 'header' }).text()
    ).to.contain('Best Seats in the House');
  });
  it('doesnt display concession types if not exapnded', async () => {
    expect(
      seatLocationComponent.findAllComponents(ConcessionType).length
    ).to.eq(0);
  });
  it('displays seat group description if expanded', async () => {
    let header = seatLocationComponent.findComponent({ ref: 'header' });
    expect(header.text()).not.to.contain('The best seats obviously');
    await seatLocationComponent.setProps({
      expanded: true,
    });
    expect(header.text()).to.contain('The best seats obviously');
  });
  it('contains the correct ammount of concession type components', async () => {
    let tickets = [new Ticket(1, 1), new Ticket(1, 1), new Ticket(1, 2)];
    await seatLocationComponent.setProps({
      expanded: true,
      current_tickets: tickets,
    });
    let components = seatLocationComponent.findAllComponents(ConcessionType);
    expect(components.length).to.eq(2);

    expect(components.at(0).props('concession_type')).to.eq(
      FakeSeatLocation.concession_types[0]
    );
    expect(components.at(0).props('current_tickets').length).to.eq(3);

    expect(components.at(1).props('concession_type')).to.eq(
      FakeSeatLocation.concession_types[1]
    );
    expect(components.at(1).props('current_tickets').length).to.eq(3);
  });
  it('contains the correct amount of group ticket buttons', async () => {
    await seatLocationComponent.setProps({
      expanded: true,
    });
    let discountComponents = seatLocationComponent.findAllComponents(
      GroupTicketButton
    );
    expect(discountComponents.length).to.eq(1);
    expect(discountComponents.at(0).props('discount')).to.eq(FakeDiscount);
  });
  it('handles add discount tickets event and emits add ticket(s) event', async () => {
    await seatLocationComponent.setProps({
      expanded: true,
    });
    await seatLocationComponent
      .findAllComponents(GroupTicketButton)
      .at(0)
      .vm.$emit('add-discount-tickets');

    expect(seatLocationComponent.emitted()['add-ticket'].length).to.eq(2);
    expect(
      JSON.stringify(seatLocationComponent.emitted()['add-ticket'][0])
    ).to.eq(
      JSON.stringify([
        FakeSeatLocation.seat_group,
        FakeDiscount.discount_requirements[0].concession_type,
        FakeDiscount.discount_requirements[0].number,
      ])
    );
    expect(
      JSON.stringify(seatLocationComponent.emitted()['add-ticket'][1])
    ).to.eq(
      JSON.stringify([
        FakeSeatLocation.seat_group,
        FakeDiscount.discount_requirements[1].concession_type,
        FakeDiscount.discount_requirements[1].number,
      ])
    );
  });
});
