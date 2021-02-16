import { shallowMount } from '@vue/test-utils';
import { expect } from 'chai';

import BookingNavigation from '@/components/booking/BookingNavigation.vue';
import ProductionBanner from '@/components/production/ProductionBanner.vue';
import { swal } from '@/utils';
import Book from '@/views/booking/Book.vue';
import stages from '@/views/booking/bookingStages';

import FakePerformance from '../../fixtures/FakePerformance';
import {
  executeWithServer,
  generateMountOptions,
  runApolloQuery,
  seedAndAuthAsUser,
  waitFor,
} from '../../helpers';

describe('Create Booking Page', () => {
  let bookingComponent, production, server, performanceModel, routerPushFake;
  let fakeComponent = {
    name: 'router-view',
    template: '<div />',
    props: ['production', 'booking', 'ticketMatrix'],
  };
  beforeAll(async () => {
    server = await executeWithServer(async (server) => {
      performanceModel = server.create(
        'performanceNode',
        FakePerformance(server)
      );

      let { data } = await runApolloQuery({
        query: require('@/graphql/queries/ProductionBySlug.gql'),
        variables: {
          slug: performanceModel.production.slug,
        },
      });

      production = data.production;
    }, false);
  });
  afterAll(() => {
    server.shutdown();
  });
  beforeEach(() => {
    bookingComponent = shallowMount(Book, {
      propsData: {
        production: production,
      },
      mocks: {
        $route: {
          params: {},
          meta: {
            stage: stages[0],
          },
        },
        $router: {
          push: (routerPushFake = jest.fn()),
        },
      },
      stubs: { RouterView: fakeComponent, 'router-link': true },
    });
  });

  it('has a production banner', () => {
    let banner = bookingComponent.findComponent(ProductionBanner);
    expect(banner.exists()).to.be.true;
    expect(banner.props('production')).to.eq(production);
    expect(banner.props('showBuyTicketsButton')).to.eq(false);
    expect(banner.props('showDetailedInfo')).to.eq(false);
  });

  it('has booking navigation', () => {
    let bookingNavigation = bookingComponent.findComponent(BookingNavigation);
    expect(bookingNavigation.exists()).to.be.true;
    expect(bookingNavigation.props('currentStageIndex')).to.eq(0);
    expect(bookingNavigation.props('maxAllowedStageIndex')).to.eq(0);
    expect(bookingNavigation.props('production')).to.eq(production);
    expect(bookingNavigation.props('booking')).to.eq(
      bookingComponent.vm.booking
    );
  });

  it('has a router view', async () => {
    await bookingComponent.setData({
      ticketMatrix: 'fakeMatrix',
    });
    let routerview = bookingComponent.findComponent(fakeComponent);
    expect(routerview.exists()).to.be.true;
    expect(routerview.props('production')).to.eq(production);
    expect(routerview.props('booking')).to.eq(bookingComponent.vm.booking);
    expect(routerview.props('ticketMatrix')).to.eq('fakeMatrix');
  });

  it('loads required data on mount if has a performance id', async () => {
    seedAndAuthAsUser(server);
    bookingComponent = shallowMount(
      Book,
      generateMountOptions(['apollo'], {
        propsData: {
          production: production,
        },
        mocks: {
          $route: {
            params: {
              performanceID: performanceModel.id,
            },
            meta: {
              stage: stages[0],
            },
          },
        },
        stubs: { RouterView: fakeComponent, 'router-link': true },
      })
    );

    await waitFor(() => bookingComponent.vm.ticketMatrix);

    expect(bookingComponent.vm.booking.performance.id).to.eq(
      performanceModel.id
    );
    expect(bookingComponent.vm.ticketMatrix).not.to.be.null;
  });

  it('reacts to booking navigation goto stage event', async () => {
    let bookingNavigation = bookingComponent.findComponent(BookingNavigation);

    await bookingNavigation.vm.$emit('goto-stage', stages[1]);

    expect(bookingComponent.vm.maxAllowedStageIndex).to.eq(1);
    expect(routerPushFake.mock.calls).length(1);
    expect(routerPushFake.mock.calls[0][0].name).to.eq(
      stages[1].getRouteName()
    );
  });

  it('reacts to the router view emitting select performance event', async () => {
    let routerview = bookingComponent.findComponent(fakeComponent);

    await routerview.vm.$emit('select-performance', {
      id: 1,
    });

    expect(bookingComponent.vm.booking.performance.id).to.eq(1);
    expect(routerPushFake.mock.calls).length(1);
    expect(routerPushFake.mock.calls[0][0].name).to.eq(
      stages[1].getRouteName()
    );
  });

  it('reacts to the router view emitting next stage event', async () => {
    bookingComponent.vm.$route.meta.stage = stages[1];
    let routerview = bookingComponent.findComponent(fakeComponent);

    await routerview.vm.$emit('next-stage');

    expect(routerPushFake.mock.calls[0][0].name).to.eq(
      stages[2].getRouteName()
    );
  });

  it('reacts to the router view emitting stage unable event', async () => {
    bookingComponent.vm.$route.meta.stage = stages[1];
    let routerview = bookingComponent.findComponent(fakeComponent);

    await routerview.vm.$emit('stage-unable');

    expect(routerPushFake.mock.calls[0][0].name).to.eq(
      stages[0].getRouteName()
    );
  });

  describe('with exisiting draft booking', () => {
    let booking, stub, mount;
    beforeAll(() => {
      let user = seedAndAuthAsUser(server);
      booking = server.create('bookingNode', {
        user,
        performance: performanceModel,
      });

      stub = jest.spyOn(swal, 'fire');

      mount = () => {
        bookingComponent = shallowMount(
          Book,
          generateMountOptions(['apollo'], {
            propsData: {
              production: production,
            },
            mocks: {
              $route: {
                params: {
                  performanceID: performanceModel.id,
                },
                meta: {
                  stage: stages[0],
                },
              },
            },
            stubs: { RouterView: fakeComponent, 'router-link': true },
          })
        );
      };
    });
    afterEach(() => {
      booking.destroy();
    });
    it('can resume booking', async () => {
      stub.mockResolvedValue({ isConfirmed: true });
      mount();
      let updateStub = jest
        .spyOn(bookingComponent.vm.booking, 'updateFromAPIData')
        .mockImplementation();

      await waitFor(() => stub.mock.calls.length);

      expect(stub.mock.calls).length(1);
      expect(updateStub.mock.calls).length(1);
      expect(updateStub.mock.calls[0][0]).to.eq(
        bookingComponent.vm.previousBooking
      );
    });
    it('can decline to resume booking', async () => {
      stub.mockResolvedValue({ isConfirmed: false });
      mount();
      let updateStub = jest
        .spyOn(bookingComponent.vm.booking, 'updateFromAPIData')
        .mockImplementation();

      await waitFor(() => stub.mock.calls.length);

      expect(stub.mock.calls).length(1);
      expect(updateStub.mock.calls).length(0);
    });
  });

  describe('mounted middleware', () => {
    let fakePush;
    let mount = (stage = stages[0]) => {
      bookingComponent = shallowMount(Book, {
        propsData: {
          production: production,
        },
        mocks: {
          $route: {
            params: {},
            meta: {
              stage: stage,
            },
          },
          $router: {
            push: (fakePush = jest.fn()),
          },
        },
        stubs: { RouterView: fakeComponent, 'router-link': true },
      });
    };
    it('it changes stage if stage should not be used', () => {
      let stage = stages[1];
      jest.spyOn(stage, 'shouldBeUsed').mockReturnValueOnce(false);
      mount(stage);

      expect(fakePush.mock.calls).length(1);
      expect(fakePush.mock.calls[0][0].name).to.eq(stages[2].getRouteName());
    });
    it('it changes stage if not eligable for stage', () => {
      let stage = stages[1];
      jest.spyOn(stage, 'eligable').mockReturnValueOnce(false);
      mount(stage);

      expect(fakePush.mock.calls).length(1);
      expect(fakePush.mock.calls[0][0].name).to.eq(stages[0].getRouteName());
    });
  });
});
