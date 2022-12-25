import { expect } from 'vitest';
import {
  GenericApolloResponse,
  GenericNodeConnection
} from '#testSupport/helpers/api';
import { mount } from '#testSupport/helpers';

import Production from '#testSupport/fixtures/Production';
import Performance from '#testSupport/fixtures/Performance';
import Booking from '#testSupport/fixtures/Booking';
import Book from '@/pages/production/[slug]/book.vue';
import { swal } from '@/utils/alerts';
import ProductionBanner from '@/components/production/ProductionBanner.vue';
import BookingNavigation from '@/components/booking/BookingNavigation.vue';
import stages from '@/pages/production/[slug]/book/-bookingStages';
import { flushPromises } from '@vue/test-utils';

describe('Create Booking Page', () => {
  let bookingComponent;
  function generateFakeNuxtPage(stageInfo) {
    return {
      template: '<div></div>',
      stageInfo: stageInfo ?? stages[0].stageInfo,
      mounted() {
        this.$emit('mounted', stageInfo ?? stages[0].stageInfo);
      },
      props: ['production', 'ticketMatrix', 'booking']
    };
  }

  async function mountComponent(routeParams = {}, queryResponses, fakePage) {
    bookingComponent = await mount(Book, {
      shallow: false,
      routeInfo: {
        params: Object.assign(
          {},
          {
            slug: 'legally-ginger'
          },
          routeParams
        )
      },
      apollo: {
        queryResponses
      },
      global: {
        components: { NuxtPage: fakePage ?? generateFakeNuxtPage() }
      }
    });
  }

  beforeEach(async () => {
    await mountComponent(undefined, [
      GenericApolloResponse('production', Production({}, true))
    ]);
  });

  it('has a production banner', () => {
    const banner = bookingComponent.findComponent(ProductionBanner);
    expect(banner.exists()).to.be.true;
    expect(banner.props('production').name).to.eq('Legally Ginger');
    expect(banner.props('showBuyTicketsButton')).to.eq(false);
    expect(banner.props('showDetailedInfo')).to.eq(false);
  });

  it('has booking navigation', () => {
    const bookingNavigation = bookingComponent.findComponent(BookingNavigation);
    expect(bookingNavigation.exists()).to.be.true;
    expect(bookingNavigation.props('currentStageIndex')).to.eq(0);
    expect(bookingNavigation.props('production').name).to.eq('Legally Ginger');
    expect(bookingNavigation.props('booking')).to.eq(
      bookingComponent.vm.booking
    );
  });

  it('has a nuxt child', async () => {
    await bookingComponent.setData({
      ticketMatrix: 'fakeMatrix'
    });

    const nuxtChild = bookingComponent.findComponent({ name: 'NuxtPage' });
    expect(nuxtChild.exists()).to.be.true;
    expect(nuxtChild.props('production').name).to.eq('Legally Ginger');
    expect(nuxtChild.props('booking')).to.eq(bookingComponent.vm.booking);
    expect(nuxtChild.props('ticketMatrix')).to.eq('fakeMatrix');
  });

  it('reacts to the child emitting select performance event', async () => {
    const childComponent = bookingComponent.findComponent({ name: 'NuxtPage' });

    await childComponent.vm.$emit('select-performance', {
      id: 1
    });

    expect(bookingComponent.vm.booking.performance.id).to.eq(1);

    const router = useRouter();
    expect(router.push).toHaveBeenCalledWith({
      hash: '#booking-view',
      name: 'production-slug-book-performanceId-warnings',
      params: {
        slug: 'legally-ginger',
        performanceId: 1
      }
    });
  });

  it('reacts to the child emitting next stage event', async () => {
    const childComponent = bookingComponent.findComponent({ name: 'NuxtPage' });

    bookingComponent.vm.currentStage = stages[1].stageInfo;

    await childComponent.vm.$emit('next-stage');

    const router = useRouter();
    expect(router.push).toHaveBeenCalledWith({
      hash: '#booking-view',
      name: 'production-slug-book-performanceId-tickets',
      params: {
        slug: 'legally-ginger',
        performanceId: null
      }
    });
  });

  describe('with performance id', () => {
    beforeEach(async () => {
      await mountComponent({ performanceId: 1 }, [
        GenericApolloResponse('production', Production({}, true)),
        GenericApolloResponse('me', {
          bookings: GenericNodeConnection()
        }),
        GenericApolloResponse('performance', Performance())
      ]);

      await bookingComponent.vm.$nextTick();
    });

    it('loads required data on mount if has a performance id', () => {
      expect(bookingComponent.vm.booking.performance.id).to.eq(1);
      expect(bookingComponent.vm.ticketMatrix).not.to.be.null;
    });

    it('reacts to booking navigation goto stage event', async () => {
      const bookingNavigation =
        bookingComponent.findComponent(BookingNavigation);

      await bookingNavigation.vm.$emit('goto-stage', stages[1]);

      const router = useRouter();

      expect(router.push).toHaveBeenCalledWith({
        name: 'production-slug-book-performanceId-warnings',
        hash: '#booking-view',
        params: {
          performanceId: 1,
          slug: 'legally-ginger'
        }
      });
    });
  });

  describe('with exisiting draft booking', () => {
    let stub, mount;
    beforeAll(() => {
      stub = vi.spyOn(swal, 'fire');

      mount = async () => {
        await mountComponent({ performanceId: 1 }, [
          GenericApolloResponse('production', Production({}, true)),
          GenericApolloResponse('me', {
            bookings: GenericNodeConnection([Booking()])
          }),
          GenericApolloResponse('performance', Performance())
        ]);
      };
    });

    afterEach(() => {
      stub.mockClear();
    });

    it('can resume booking', async () => {
      stub.mockResolvedValue({ isConfirmed: true });
      await mount();
      await flushPromises();

      expect(stub.mock.calls).length(1);
      expect(bookingComponent.vm.booking.id).to.eq(1);
    });
    it('can decline to resume booking', async () => {
      stub.mockResolvedValue({ isConfirmed: false });
      await mount();
      const updateStub = vi
        .spyOn(bookingComponent.vm.booking, 'updateFromAPIData')
        .mockImplementation();

      await flushPromises();

      expect(stub.mock.calls).length(1);
      expect(updateStub.mock.calls).length(0);
    });
  });

  describe('mounted middleware', () => {
    const mountComponentInner = async (stage = stages[0]) => {
      await mountComponent(
        { performanceId: 1 },
        [
          GenericApolloResponse('production', Production({}, true)),
          GenericApolloResponse('me', {
            bookings: GenericNodeConnection([Booking()])
          }),
          GenericApolloResponse('performance', Performance())
        ],
        generateFakeNuxtPage(stage.stageInfo)
      );
    };

    it('it changes stage if stage should not be used', async () => {
      const stage = stages[1];
      const mock = vi
        .spyOn(stage.stageInfo, 'shouldBeUsed')
        .mockImplementation(() => false);
      await mountComponentInner(stage);

      const router = useRouter();
      expect(router.replace).toHaveBeenCalledWith({
        hash: '#booking-view',
        name: 'production-slug-book-performanceId-tickets',
        params: {
          slug: 'legally-ginger',
          performanceId: 1
        }
      });
      mock.mockReset();
    });

    it('it changes stage if not eligable for stage', async () => {
      const stage = stages[1];
      const shouldBeUsedMock = vi
        .spyOn(stage.stageInfo, 'shouldBeUsed')
        .mockImplementation(() => true);
      const eligableMock = vi
        .spyOn(stage.stageInfo, 'eligable')
        .mockImplementation(() => false);
      await mountComponentInner(stage);

      const router = useRouter();
      expect(router.push).toHaveBeenCalledWith({
        hash: '#booking-view',
        name: 'production-slug-book',
        params: {
          slug: 'legally-ginger',
          performanceId: 1
        }
      });
      shouldBeUsedMock.mockReset();
      eligableMock.mockReset();
    });
  });
});
