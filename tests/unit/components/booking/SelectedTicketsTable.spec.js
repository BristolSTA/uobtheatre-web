// Copy and rename this file to <testname>.spec.js
import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import FullBooking from '../../fixtures/instances/FullBooking';
import SelectedTicketsTable from '@/components/booking/SelectedTicketsTable.vue';
import Booking from '@/classes/Booking';
import TicketsMatrix from '@/classes/TicketsMatrix';

describe('Selected Tickets Table', () => {
  let component;
  beforeEach(() => {
    component = mount(SelectedTicketsTable, {
      propsData: {
        booking: Booking.fromAPIData(FullBooking()),
        ticketMatrix: new TicketsMatrix(FullBooking().performance),
      },
    });
  });

  it('displays selected tickets', () => {
    expect(component.text()).to.contain('Selected Tickets');
    const overview = component.find('table');

    // 3 unique combinations of seat group + conession type
    expect(overview.findAll('tbody tr').length).to.eq(3);

    // Test the first row
    const columns = overview.findAll('tbody tr:first-of-type td');
    expect(columns.at(0).text()).to.eq('Best seats in the house');
    expect(columns.at(1).text()).to.eq('Adult');
    expect(columns.at(2).text()).to.eq('2');
    expect(columns.at(3).text()).to.eq('£6.00');
  });

  it('shows discount line if discount applied', async () => {
    expect(component.find('table tfoot tr:first-of-type th').text()).to.eq(
      'Discounts'
    );
    expect(
      component.find('table tfoot tr:first-of-type td:last-of-type').text()
    ).to.eq('-£0.10');

    // Delete the discount
    const booking = FullBooking();
    booking.priceBreakdown.discountsValue = 0;
    await component.setProps({
      booking: Booking.fromAPIData(booking),
    });

    expect(component.find('table').text()).not.to.contain('Discounts');
  });

  it('shows subtotal', () => {
    expect(component.find('table tfoot tr:last-of-type').text()).to.contain(
      'Subtotal'
    );
    expect(component.find('table tfoot tr:last-of-type').text()).to.contain(
      '£4.90'
    );
  });

  it('shows loading spinner for subtotal while dirty', async () => {
    component.vm.booking.dirty = true;
    await component.vm.$nextTick();

    expect(component.find('table').text()).to.contain('Subtotal');
    expect(component.findComponent({ ref: 'subtotalSpinner' }).exists()).to.be
      .true;

    component.vm.booking.dirty = false;
    await component.vm.$nextTick();

    expect(component.findComponent({ ref: 'subtotalSpinner' }).exists()).not.to
      .be.true;
  });
});
