import { expect } from 'vitest';
import { mount } from '#testSupport/helpers';
import { NuxtLinkStub } from '#testSupport/stubs';

import { GenericApolloResponse } from '#testSupport/helpers/api';
import User from '#testSupport/fixtures/User';
import BookingSummaryOverview from '@/components/booking/overview/BookingSummaryOverview.vue';
import BookingsTable from '@/components/user/BookingsTable.vue';
import UserDetails from '@/components/user/UserDetails.vue';
import MyAccount from '@/pages/user/index.vue';

describe('My Account', () => {
  let myAccountComponent;

  beforeEach(async () => {
    myAccountComponent = await mount(MyAccount, {
      shallow: false,
      apollo: {
        queryResponses: [GenericApolloResponse('me', User())]
      }
    });
  });

  it('contains user details', () => {
    expect(myAccountComponent.findComponent(UserDetails).exists()).to.be.true;
    expect(
      myAccountComponent.findComponent(UserDetails).props('user').firstName
    ).to.eq('Michael');
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
      expect(myAccountComponent.findComponent(NuxtLinkStub).exists()).to.be
        .true;
      expect(
        myAccountComponent.findComponent(NuxtLinkStub).attributes('to')
      ).to.eq('/productions');
      expect(myAccountComponent.findComponent(NuxtLinkStub).text()).to.eq(
        "View What's On"
      );
      expect(myAccountComponent.text()).to.contain('No Upcoming Bookings');
    });
  });
});
