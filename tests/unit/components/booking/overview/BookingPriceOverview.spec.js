import { mount, fixTextSpacing } from '#testSupport/helpers';
import { expect } from 'vitest';

import Booking from '@/classes/Booking';
import BookingPriceOverview from '@/components/booking/overview/BookingPriceOverview.vue';
import OverviewBox from '~~/components/ui/UiCard.vue';

import FullBooking from '#testSupport/fixtures/instances/FullBooking';

describe('Booking Price Overview', function () {
  let bookingPriceOverviewComponent;

  beforeAll(async () => {
    const bookingdata = FullBooking();

    const booking = Booking.fromAPIData(bookingdata);
    bookingPriceOverviewComponent = await mount(BookingPriceOverview, {
      shallow: false,
      props: {
        booking
      }
    });
  });

  it('has overview box component', () => {
    expect(bookingPriceOverviewComponent.findComponent(OverviewBox).exists()).to
      .be.true;
  });

  it('has correct costs info', () => {
    const costRows = bookingPriceOverviewComponent.findAll('tr');

    expect(costRows.length).to.eq(2);
    expect(costRows.at(0).text()).to.eq('TicketsIncluding any discounts:£4.90');
    expect(costRows.at(1).text()).to.eq('Booking Fee:£0.05');
    expect(
      fixTextSpacing(
        bookingPriceOverviewComponent.find({ ref: 'total' }).text()
      )
    ).to.eq('Order Total: £4.95');
  });
});
