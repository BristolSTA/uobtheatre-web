import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { expect } from 'chai';

import Booking from '@/classes/Booking';
import OverviewBox from '@/components/booking/overview/OverviewBox.vue';
import PaymentOverview from '@/components/booking/overview/PaymentOverview.vue';

import FakeBooking from '../../../fixtures/FakeBooking';
import {
  executeWithServer,
  fixTextSpacing,
  mountWithRouterMock,
  runApolloQuery,
} from '../../../helpers';

describe('ticket overview box', function () {
  let paymentOverviewComponent;
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
      let bookingData = Object.assign({}, data.booking, {
        status: 'PAID',
        reference: 'ABS1352EBV54',
      });
      booking.updateFromAPIData(bookingData);
    });
    paymentOverviewComponent = await mountWithRouterMock(PaymentOverview, {
      propsData: {
        booking: booking,
      },
    });
  });

  it('has overview box component', () => {
    expect(paymentOverviewComponent.findComponent(OverviewBox).exists()).to.be
      .true;

    expect(
      paymentOverviewComponent.findAllComponents(FontAwesomeIcon).length
    ).to.equal(1);
  });

  it('has correct booking info', async () => {
    await paymentOverviewComponent.vm;

    expect(paymentOverviewComponent.text()).to.contain('Payment');
    expect(paymentOverviewComponent.text()).to.contain(
      'Booking Ref : ABS1352EBV54'
    );
  });

  it('has correct payment info', async () => {
    await paymentOverviewComponent.vm;
    let costRows = paymentOverviewComponent.findAll('tr');

    expect(costRows.length).to.eq(2);
    expect(fixTextSpacing(costRows.at(0).text())).to.eq('Price Paid : £37.28');
    // will fail - to be implemented
    expect(fixTextSpacing(costRows.at(1).text())).to.eq('On : ');
  });
});
