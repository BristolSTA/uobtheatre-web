import { mount } from '@vue/test-utils';
import { expect } from 'chai';

import GroupTicketButton from '@/components/booking/GroupTicketButton.vue';

import FakeDiscount from '../../fixtures/FakeDiscount';

describe('Group Ticket Button', () => {
  let buttonComponent;
  beforeEach(() => {
    buttonComponent = mount(GroupTicketButton, {
      propsData: {
        discount: FakeDiscount,
      },
    });
  });

  it('displays the discounts name', () => {
    expect(buttonComponent.text()).to.contain('Family Discount');
  });

  it('displays the discounts requirements', () => {
    expect(buttonComponent.text()).to.contain('Adult x 1');
    expect(buttonComponent.text()).to.contain('Student x 2');
  });

  it('emits an event when add tickets button clicked', async () => {
    await buttonComponent.find('button').trigger('click');

    expect(buttonComponent.emitted()['add-discount-tickets'].length).to.eq(1);
  });
});
