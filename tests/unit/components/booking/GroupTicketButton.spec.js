import { mount } from '#testSupport/helpers';
import { expect } from 'vitest';

import Performance from '#testSupport/fixtures/Performance';
import GroupTicketButton from '@/components/booking/GroupTicketButton.vue';

describe('Group Ticket Button', () => {
  let buttonComponent;
  beforeEach(async () => {
    const performance = Performance();

    const student = {
      name: 'Student',
      id: 2
    };
    performance.ticketOptions[0].concessionTypes.push({
      concessionType: student,
      price: 800,
      pricePounds: '8.00'
    });
    const discount = performance.discounts.edges[0].node;
    discount.requirements.push({
      id: 1,
      number: 2,
      discount: null,
      concessionType: student
    });

    buttonComponent = await mount(GroupTicketButton, {
      props: {
        discount
      }
    });
  });

  it('displays the discounts name', () => {
    expect(buttonComponent.text()).to.contain('Family Discount');
  });

  it('displays the discounts requirements', () => {
    expect(buttonComponent.text().replace(/\s\s+/g, ' ')).to.contain(
      'Adultx 1'
    );
    expect(buttonComponent.text().replace(/\s\s+/g, ' ')).to.contain(
      'Studentx 2'
    );
  });

  it('emits an event when add tickets button clicked', async () => {
    await buttonComponent.find('button').trigger('click');

    expect(buttonComponent.emitted()['add-discount-tickets'].length).to.eq(1);
  });
});
