import { NuxtLinkStub } from '#testSupport/stubs';
import { expect, vi } from 'vitest';

import { fixTextSpacing, mount } from '#testSupport/helpers';
import {
  GenericApolloResponse,
  GenericNodeConnection
} from '#testSupport/helpers/api';
import Production from '#testSupport/fixtures/Production';
import Carousel from '@/components/ui/UiCarousel.vue';
import Home from '@/pages/index.vue';
import { flushPromises } from '@vue/test-utils';

import Booking from '~~/classes/Booking';
import FullBooking from '#testSupport/fixtures/instances/FullBooking';
import BookingHomepageOverview from '~~/components/booking/BookingHomepageOverview.vue';

describe('Home', function () {
  let homepageComponent;

  async function mountComponent(queryEdgeResponse = []) {
    const bookingdata = FullBooking();
    const booking = Booking.fromAPIData(bookingdata);
    return (homepageComponent = await mount(Home, {
      shallow: false,
      apollo: {
        queryResponses: [
          GenericApolloResponse(
            'productions',
            GenericNodeConnection(queryEdgeResponse)
          ),
          GenericApolloResponse('me', {
            bookings: GenericNodeConnection([booking])
          })
        ]
      }
    }));
  }

  beforeEach(async () => {
    homepageComponent = await mountComponent();
  });

  describe('Splashscreen', () => {
    let splashscreenContainer;

    beforeEach(async () => {
      splashscreenContainer = homepageComponent.find('#splashscreen');
    });

    it('shows fallback with no productions', () => {
      expect(fixTextSpacing(splashscreenContainer.text())).to.contain(
        'Welcome to UOB Theatre The Home of Bristol Student Performing Arts'
      );
    });

    it('shows fallback with no featured production with image', async () => {
      homepageComponent = await mountComponent([
        Production({ coverImage: null })
      ]);

      await flushPromises();

      expect(fixTextSpacing(homepageComponent.text())).to.contain(
        'Welcome to UOB Theatre The Home of Bristol Student Performing Arts'
      );
      expect(homepageComponent.findComponent(Carousel).exists()).to.be.false;
    });

    it('shows carousel component with correct data', async () => {
      await seedProductions();

      expect(homepageComponent.findComponent(Carousel).exists()).to.be.true;
      expect(homepageComponent.vm.bannerProductions.length).equals(3);
    });

    it('carousel displays correct data', async () => {
      await seedProductions();

      const carousel = homepageComponent.findComponent(Carousel);
      const slide = carousel.find({ ref: 'carousel' });
      expect(slide.text()).to.contain('STA');
      expect(slide.text()).to.contain('Legally Ginger');
      expect(fixTextSpacing(slide.text())).to.contain(
        '14 November - 18 November 2020'
      );

      expect(slide.attributes('style')).to.contain(
        'background-image: url(http://pathto.example/cover-image.png)'
      );
      expect(
        homepageComponent.findAllComponents(NuxtLinkStub).at(0).attributes('to')
      ).to.equal('/production/legally-ginger');
    });
  });

  describe('Upcoming Bookings', () => {
    beforeEach(async () => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it('Has no upcoming bookings', async () => {
      const date = new Date('2020-03-08T10:00:00');
      vi.setSystemTime(date);
      homepageComponent = await mountComponent();

      expect(homepageComponent.findComponent(BookingHomepageOverview).exists())
        .to.be.false;
    });

    it('Has upcoming bookings', async () => {
      const date = new Date('2020-03-09T10:00:00');
      vi.setSystemTime(date);
      homepageComponent = await mountComponent();
      await homepageComponent.vm.$nextTick();

      expect(homepageComponent.findComponent(BookingHomepageOverview).exists())
        .to.be.true;
    });
  });

  describe("What's On", () => {
    let whatsOnContainer;
    beforeEach(async () => {
      whatsOnContainer = homepageComponent.find({ ref: 'whatson' });
    });
    it('falls back with no productions', () => {
      expect(whatsOnContainer.text()).to.contain(
        'There are currently no upcoming productions'
      );
    });

    it('shows upcoming productions', async () => {
      await seedProductions();

      const whatsOnProductions = homepageComponent
        .find({
          ref: 'whatson'
        })
        .findAll('.production-feature');

      expect(whatsOnProductions.length).to.equal(4);

      // Checks for the first production
      // Has image in first div
      expect(whatsOnProductions.at(0).find('div:first-of-type img').exists()).to
        .be.true;
      // Is for the first production in the list
      expect(
        whatsOnProductions.at(0).find('div:last-of-type').text()
      ).to.contain('Legally Ginger');
      // Has correct dates
      expect(
        fixTextSpacing(whatsOnProductions.at(0).find('div:last-of-type').text())
      ).to.contain('13 November 2020');
      // Link to production
      expect(whatsOnProductions.at(0).find('a').exists()).to.be.true;
      expect(
        homepageComponent.findAllComponents(NuxtLinkStub).at(2).attributes('to')
      ).to.equal('/production/legally-ginger');

      // Second div should be reversed
      expect(whatsOnProductions.at(0).classes()).not.to.contain(
        'flex-row-reverse'
      );
      expect(whatsOnProductions.at(1).classes()).to.contain('flex-row-reverse');
      expect(whatsOnProductions.at(2).classes()).not.to.contain(
        'flex-row-reverse'
      );
    });

    it('correctly truncates descriptions', async () => {
      await seedProductions();

      const whatsOnProductions = homepageComponent
        .find({
          ref: 'whatson'
        })
        .findAll('.production-feature');

      // Description 1 is short, so it should be displayed in full
      expect(whatsOnProductions.at(0).findAll('p').at(1).text()).to.contain(
        'The description of the show.'
      );

      // Description 3 is over 230 characters, so it should be truncated
      expect(whatsOnProductions.at(2).findAll('p').at(1).text()).to.contain(
        'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsa...'
      );
      expect(
        whatsOnProductions.at(2).findAll('p').at(1).text()
      ).to.be.length.lessThanOrEqual(233);

      // Description 4 has a short description, so that should be selected
      expect(whatsOnProductions.at(3).findAll('p').at(1).text()).to.contain(
        'A short desc.'
      );
    });
  });

  const seedProductions = async () => {
    homepageComponent = await mountComponent([
      // Seed a production that can't be featured (no cover photo)
      Production({
        coverImage: null,
        start: '2020-11-13',
        end: '2020-11-13'
      }),
      // Seed a production that can be featured
      Production({ id: 2, start: '2020-11-14', end: '2020-11-18' }),
      Production({
        id: 3,
        start: '2020-11-14',
        end: '2020-11-18',
        description:
          'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?'
      }),
      Production({ id: 4, shortDescription: 'A short desc.' })
    ]);
    await flushPromises();
  };
});
