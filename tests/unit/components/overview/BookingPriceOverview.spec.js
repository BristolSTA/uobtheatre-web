import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { expect } from 'chai';

import Booking from '@/classes/Booking';
import BookingPriceOverview from '@/components/overview/BookingPriceOverview.vue';
import OverviewBox from '@/components/overview/OverviewBox.vue';

import FakeBooking from '../../fixtures/FakeBooking';
import { mountWithRouterMock, runApolloQuery } from '../../helpers';
import { executeWithServer, fixTextSpacing } from '../../helpers';

describe('ticket overview box', function () {
  let bookingPriceOverviewComponent;
  let booking = new Booking();

  beforeAll(async () => {
    await executeWithServer(async (server) => {
      let bookingModel = FakeBooking(server);

      let { data } = await runApolloQuery({
        query: require('@/graphql/queries/BookingInformation.gql'),
        variables: {
          bookingId: bookingModel.id,
        },
      });
      booking.updateFromAPIData(data.booking);
    });
    bookingPriceOverviewComponent = await mountWithRouterMock(
      BookingPriceOverview,
      {
        propsData: {
          booking: booking,
        },
      }
    );
  });

  it('has overview box component', () => {
    expect(bookingPriceOverviewComponent.findComponent(OverviewBox).exists()).to
      .be.true;

    expect(
      bookingPriceOverviewComponent.findAllComponents(FontAwesomeIcon).length
    ).to.equal(1);
  });

  it('has correct costs info', async () => {
    await bookingPriceOverviewComponent.vm;
    let costRows = bookingPriceOverviewComponent.findAll('tr');

    expect(costRows.length).to.eq(2);
    expect(fixTextSpacing(costRows.at(0).text())).to.eq(
      'Tickets Including any discounts : £35.50'
    );
    expect(fixTextSpacing(costRows.at(1).text())).to.eq('Booking Fee : £1.78');
    expect(
      fixTextSpacing(
        bookingPriceOverviewComponent.findComponent({ ref: 'total' }).text()
      )
    ).to.eq('Order Total: £37.28');
  });
});
