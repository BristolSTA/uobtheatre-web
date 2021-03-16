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
  seedAndAuthAsUser,
} from '../../../helpers';

describe('Payment Overview', function () {
  let paymentOverviewComponent;
  let booking = new Booking();

  beforeAll(async () => {
    await executeWithServer(async (server) => {
      let user = seedAndAuthAsUser(server);
      FakeBooking(
        server,
        {
          user,
        },
        true
      );

      let { data } = await runApolloQuery({
        query: require('@/graphql/queries/UserPaidBooking.gql'),
        variables: {
          bookingRef: 'ABS1352EBV54',
        },
      });
      booking.updateFromAPIData(data.me.bookings.edges[0].node);
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

  it('has correct booking status', async () => {
    await paymentOverviewComponent.vm;

    expect(fixTextSpacing(paymentOverviewComponent.text())).to.contain(
      'PAID using VISA ending 1234'
    );
  });

  it('has correct payment info', async () => {
    await paymentOverviewComponent.vm;
    let costRows = paymentOverviewComponent.findAll('tr');

    expect(costRows.length).to.eq(2);
    expect(fixTextSpacing(costRows.at(0).text())).to.eq('Price Paid : £25.75');
    expect(fixTextSpacing(costRows.at(1).text())).to.eq('On : Sat 13 Mar 2021');
  });
});
