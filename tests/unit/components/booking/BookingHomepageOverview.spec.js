import { mount } from '#testSupport/helpers';
import { expect } from 'vitest';
import { NuxtLinkStub } from '#testSupport/stubs';

import Booking from '~~/classes/Booking';
import BookingHomepageOverview from '@/components/booking/BookingHomepageOverview.vue';
import ProductionFeaturedImage from '@/components/production/ProductionFeaturedImage.vue';
import ProductionPosterImage from '@/components/production/ProductionPosterImage.vue';

import FullBooking from '#testSupport/fixtures/instances/FullBooking';

describe('Homepage upcoming booking component', function () {
  let bookingHomepageOverviewComponent;
  const bookingdata = FullBooking();
  const booking = Booking.fromAPIData(bookingdata);

  beforeEach(async () => {
    bookingHomepageOverviewComponent = await mount(BookingHomepageOverview, {
      shallow: false,
      props: {
        bookings: [booking]
      }
    });
  });

  describe('booking homepage overview component', () => {
    it('has the correct performance information', () => {
      expect(bookingHomepageOverviewComponent.text()).to.contain(
        'Legally Ginger'
      );
      expect(bookingHomepageOverviewComponent.text()).to.contain('by STA');
      expect(bookingHomepageOverviewComponent.text()).to.contain(
        'Anson Theatre'
      );
      expect(bookingHomepageOverviewComponent.text()).to.contain(
        'Doors Open: 15:00'
      );
      expect(bookingHomepageOverviewComponent.text()).to.contain(
        'Performance Starts: 16:00'
      );
      expect(bookingHomepageOverviewComponent.text()).to.contain(
        'View Booking & Tickets'
      );

      expect(bookingHomepageOverviewComponent.text()).to.not.contain(
        'You have additional bookings'
      );

      expect(
        bookingHomepageOverviewComponent.findAllComponents(
          ProductionFeaturedImage
        ).length
      ).to.eq(1);
      expect(
        bookingHomepageOverviewComponent.findAllComponents(
          ProductionPosterImage
        ).length
      ).to.eq(1);
    });

    it('has working links', () => {
      expect(
        bookingHomepageOverviewComponent.findAllComponents(NuxtLinkStub).length
      ).to.eq(3);

      expect(
        bookingHomepageOverviewComponent
          .findAllComponents(NuxtLinkStub)
          .at(0)
          .attributes('to')
      ).to.equal(`/society/sta`);

      expect(
        bookingHomepageOverviewComponent
          .findAllComponents(NuxtLinkStub)
          .at(1)
          .attributes('to')
      ).to.equal(`/venue/anson-theatre`);

      expect(
        bookingHomepageOverviewComponent
          .findAllComponents(NuxtLinkStub)
          .at(2)
          .attributes('to')
      ).to.equal(`/user/booking/yOIYg6Co8vGR?toTickets`);
    });

    it('has additional bookings button', async () => {
      bookingHomepageOverviewComponent = await mount(BookingHomepageOverview, {
        shallow: false,
        props: {
          bookings: [booking, booking]
        }
      });

      expect(bookingHomepageOverviewComponent.text()).to.not.contain(
        'You have additional bookings today'
      );

      expect(
        bookingHomepageOverviewComponent.findAllComponents(NuxtLinkStub).length
      ).to.eq(4);
    });
  });
});
