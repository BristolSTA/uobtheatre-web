import { mount } from '#testSupport/helpers';
import { expect } from 'vitest';
import { NuxtLinkStub } from '#testSupport/stubs';
import Booking from '~~/classes/Booking';
import BookingSummaryOverview from '@/components/booking/overview/BookingSummaryOverview.vue';
import OverviewBox from '~~/components/ui/UiCard.vue';

import FullBooking from '#testSupport/fixtures/instances/FullBooking';

describe('Booking Summary Overview', function () {
  let bookingSummaryOverviewComponent;

  beforeAll(async () => {
    const bookingdata = FullBooking();

    const booking = Booking.fromAPIData(bookingdata);

    bookingSummaryOverviewComponent = await mount(BookingSummaryOverview, {
      shallow: false,
      props: {
        booking
      }
    });
  });

  it('has overview box component', () => {
    expect(bookingSummaryOverviewComponent.findComponent(OverviewBox).exists())
      .to.be.true;
  });

  it('has correct booking summary info', async () => {
    await bookingSummaryOverviewComponent.vm;

    expect(bookingSummaryOverviewComponent.text()).to.contain('Legally Ginger');
    expect(bookingSummaryOverviewComponent.text()).to.contain(
      'Monday 9 March 2020'
    );
    expect(bookingSummaryOverviewComponent.text()).to.contain(
      'Booking Ref: yOIYg6Co8vGR'
    );
  });
  it('has working links', async () => {
    await bookingSummaryOverviewComponent.vm;
    expect(
      bookingSummaryOverviewComponent.findAllComponents(NuxtLinkStub).length
    ).to.equal(2);

    expect(
      bookingSummaryOverviewComponent
        .findAllComponents(NuxtLinkStub)
        .at(0)
        .attributes('to')
    ).to.equal('/production/legally-ginger');

    expect(
      bookingSummaryOverviewComponent
        .findAllComponents(NuxtLinkStub)
        .at(1)
        .attributes('to')
    ).to.equal('/user/booking/yOIYg6Co8vGR');
  });
});
