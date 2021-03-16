import { expect } from 'chai';

import BookingSummaryOverview from '@/components/booking/overview/BookingSummaryOverview.vue';
import BookingsTable from '@/components/user/BookingsTable.vue';
import UserDetails from '@/components/user/UserDetails.vue';
import MyAccount from '@/views/user/MyAccount.vue';

import {
  executeWithServer,
  generateMountOptions,
  mountWithRouterMock,
  RouterLinkStub,
  seedAndAuthAsUser,
  waitFor,
} from '../../helpers';

describe('My Account', () => {
  let myAccountComponent, server, user;
  beforeAll(async () => {
    server = await executeWithServer((server) => {
      user = seedAndAuthAsUser(server, {
        firstName: 'Joe',
      });
    }, false);
  });

  afterAll(() => {
    server.shutdown();
  });

  beforeEach(async () => {
    myAccountComponent = await mountWithRouterMock(
      MyAccount,
      generateMountOptions(['apollo'])
    );
  });

  it('contains user details', () => {
    expect(myAccountComponent.findComponent(UserDetails).exists()).to.be.true;
    expect(
      myAccountComponent.findComponent(UserDetails).props('user').firstName
    ).to.eq('Joe');
  });

  it('contains bookings table', () => {
    expect(myAccountComponent.findComponent(BookingsTable).exists()).to.be.true;
    expect(myAccountComponent.findComponent(BookingsTable).props('canLoadMore'))
      .to.be.false;
    expect(myAccountComponent.findComponent(BookingsTable).props('bookings')).to
      .be.empty;
  });

  describe('with no future bookings', () => {
    it('shows link to see upcoming shows', () => {
      expect(
        myAccountComponent.findAllComponents(BookingSummaryOverview)
      ).length(0);
      expect(myAccountComponent.findComponent(RouterLinkStub).exists()).to.be
        .true;
      expect(
        myAccountComponent.findComponent(RouterLinkStub).props('to').name
      ).to.eq('productions');
      expect(myAccountComponent.findComponent(RouterLinkStub).text()).to.eq(
        "View What's On"
      );
      expect(myAccountComponent.text()).to.contain('No Upcoming Bookings');
    });
  });

  describe('with future bookings', () => {
    let bookings;
    beforeAll(async () => {
      bookings = server.createList('bookingNode', 2, 'paid', {
        user: user,
      });
      myAccountComponent = await mountWithRouterMock(
        MyAccount,
        generateMountOptions(['apollo'])
      );
      await myAccountComponent.vm.$nextTick();
    });
    afterAll(() => {
      bookings.forEach((booking) => booking.destroy());
    });
    it('shows bookings', () => {
      expect(
        myAccountComponent.findAllComponents(BookingSummaryOverview)
      ).length(2);
    });
  });

  describe('with previous bookings', () => {
    let bookings;
    beforeAll(async () => {
      bookings = server.createList('bookingNode', 12, 'paid', {
        user: user,
        performance: server.create('performanceNode', 'past'),
      });
      myAccountComponent = await mountWithRouterMock(
        MyAccount,
        generateMountOptions(['apollo'])
      );
      await myAccountComponent.vm.$nextTick();
    });
    afterAll(() => {
      bookings.forEach((booking) => booking.destroy());
    });

    it('shows first 10 previous bookings', () => {
      expect(
        myAccountComponent.findComponent(BookingsTable).props('bookings')
      ).length(10);
      expect(
        myAccountComponent.findComponent(BookingsTable).props('canLoadMore')
      ).to.be.true;
    });

    it('can request next page', async () => {
      myAccountComponent.findComponent(BookingsTable).vm.$emit('load-more');
      await waitFor(() => !myAccountComponent.vm.loadingMore);
      expect(
        myAccountComponent.findComponent(BookingsTable).props('bookings')
      ).length(12);
      expect(
        myAccountComponent.findComponent(BookingsTable).props('canLoadMore')
      ).to.be.false;
    });
  });
});
