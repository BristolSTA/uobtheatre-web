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
  let component, server, user;
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
    component = await mountWithRouterMock(
      MyAccount,
      generateMountOptions(['apollo'])
    );
  });

  it('contains user details', () => {
    expect(component.findComponent(UserDetails).exists()).to.be.true;
    expect(component.findComponent(UserDetails).props('user').firstName).to.eq(
      'Joe'
    );
  });

  it('contains bookings table', () => {
    expect(component.findComponent(BookingsTable).exists()).to.be.true;
    expect(component.findComponent(BookingsTable).props('canLoadMore')).to.be
      .false;
    expect(component.findComponent(BookingsTable).props('bookings')).to.be
      .empty;
  });

  describe('with no future bookings', () => {
    it('shows link to see upcoming shows', () => {
      expect(component.findAllComponents(BookingSummaryOverview)).length(0);
      expect(component.findComponent(RouterLinkStub).exists()).to.be.true;
      expect(component.findComponent(RouterLinkStub).props('to').name).to.eq(
        'productions'
      );
      expect(component.findComponent(RouterLinkStub).text()).to.eq(
        "View What's On"
      );
      expect(component.text()).to.contain('No Upcoming Bookings');
    });
  });

  describe('with future bookings', () => {
    let bookings;
    beforeAll(async () => {
      bookings = server.createList('bookingNode', 2, 'paid', {
        user: user,
      });
      component = await mountWithRouterMock(
        MyAccount,
        generateMountOptions(['apollo'])
      );
      await component.vm.$nextTick();
    });
    afterAll(() => {
      bookings.forEach((booking) => booking.destroy());
    });
    it('shows bookings', () => {
      expect(component.findAllComponents(BookingSummaryOverview)).length(2);
    });
  });

  describe('with previous bookings', () => {
    let bookings;
    beforeAll(async () => {
      bookings = server.createList('bookingNode', 12, 'paid', {
        user: user,
        performance: server.create('performanceNode', 'past'),
      });
      component = await mountWithRouterMock(
        MyAccount,
        generateMountOptions(['apollo'])
      );
      await component.vm.$nextTick();
    });
    afterAll(() => {
      bookings.forEach((booking) => booking.destroy());
    });

    it('shows first 10 previous bookings', () => {
      expect(component.findComponent(BookingsTable).props('bookings')).length(
        10
      );
      expect(component.findComponent(BookingsTable).props('canLoadMore')).to.be
        .true;
    });

    it('can request next page', async () => {
      component.findComponent(BookingsTable).vm.$emit('load-more');
      await waitFor(() => !component.vm.loadingMore);
      expect(component.findComponent(BookingsTable).props('bookings')).length(
        12
      );
      expect(component.findComponent(BookingsTable).props('canLoadMore')).to.be
        .false;
    });
  });
});
