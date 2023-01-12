import { expect, vi } from 'vitest';
import { mount } from '#testSupport/helpers';
import {
  GenericApolloResponse,
  GenericNodeConnection
} from '#testSupport/helpers/api';

import Production from '#testSupport/fixtures/Production';
import UpcomingProductions from '@/pages/productions.vue';
import InfiniteScroll from '@/components/ui/InfiniteScroll.vue';
import ProductionTile from '@/components/production/ProductionTile.vue';

vi.mock('@/utils/misc.js', () => ({
  isInViewport: vi.fn(() => false)
}));

describe('Upcoming Productions', () => {
  let upcomingProductionsComponent;
  beforeEach(async () => {
    upcomingProductionsComponent = await mount(UpcomingProductions, {
      shallow: false,
      apollo: {
        queryResponses: [
          GenericApolloResponse('productions', GenericNodeConnection())
        ]
      }
    });
  });

  it('contains an infinite scroll instance', () => {
    expect(upcomingProductionsComponent.findComponent(InfiniteScroll).exists())
      .to.be.true;
  });

  describe('with no productions', () => {
    it('displays no productions notice', async () => {
      await upcomingProductionsComponent
        .findComponent(InfiniteScroll)
        .vm.$nextTick();
      expect(upcomingProductionsComponent.text()).to.contain(
        'There are currently no upcoming productions'
      );
    });
  });

  describe('with many productions', () => {
    let upcomingProductionsComponent;
    beforeEach(async () => {
      upcomingProductionsComponent = await mount(UpcomingProductions, {
        shallow: false,
        apollo: {
          queryResponses: [
            GenericApolloResponse(
              'productions',
              GenericNodeConnection(Array(9).fill(Production()), {
                hasNextPage: true
              })
            )
          ]
        }
      });
    });

    it('fetches first 9 performances and displays loader', async () => {
      await upcomingProductionsComponent
        .findComponent(InfiniteScroll)
        .vm.$nextTick();
      expect(
        upcomingProductionsComponent.findAllComponents(ProductionTile)
      ).length(9);
      expect(
        upcomingProductionsComponent
          .findComponent(ProductionTile)
          .props('production').name
      ).to.eq('Legally Ginger');

      expect(
        upcomingProductionsComponent
          .findComponent(InfiniteScroll)
          .find({ ref: 'bottom-loader' })
          .exists()
      ).to.be.true;
    });
  });

  describe('with some productions', () => {
    let upcomingProductionsComponent;

    beforeEach(async () => {
      upcomingProductionsComponent = await mount(UpcomingProductions, {
        shallow: false,
        apollo: {
          queryResponses: [
            GenericApolloResponse(
              'productions',
              GenericNodeConnection(Array(3).fill(Production()))
            )
          ]
        }
      });
    });

    it('fetches all the productions and doesnt display loader', async () => {
      await upcomingProductionsComponent
        .findComponent(InfiniteScroll)
        .vm.$nextTick();
      expect(
        upcomingProductionsComponent.findAllComponents(ProductionTile)
      ).length(3);
      expect(
        upcomingProductionsComponent
          .findComponent(ProductionTile)
          .props('production').name
      ).to.eq('Legally Ginger');

      expect(
        upcomingProductionsComponent
          .findComponent(InfiniteScroll)
          .find({ ref: 'bottom-loader' })
          .exists()
      ).to.be.false;
    });
  });
});
