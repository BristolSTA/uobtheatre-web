import { expect, vi } from 'vitest';
import { mount } from '#testSupport/helpers';
import {
  GenericApolloResponse,
  GenericNodeConnection
} from '#testSupport/helpers/api';
import Society from '#testSupport/fixtures/Society';
import AllSocieties from '@/pages/societies.vue';
import InfiniteScroll from '@/components/ui/InfiniteScroll.vue';
import SocietyTile from '@/components/society/SocietyTile.vue';

vi.mock('@/utils/misc.js', () => ({
  isInViewport: vi.fn(() => false)
}));

describe('All Societies', () => {
  let allSocietiesComponent;

  beforeEach(async () => {
    allSocietiesComponent = await mount(AllSocieties, {
      shallow: false,
      apollo: {
        queryResponses: [
          GenericApolloResponse('societies', GenericNodeConnection())
        ]
      }
    });
  });

  it('contains an infinite scroll instance', () => {
    expect(allSocietiesComponent.findComponent(InfiniteScroll).exists()).to.be
      .true;
  });

  describe('with no societies', () => {
    it('displays no societies notice', async () => {
      await allSocietiesComponent.findComponent(InfiniteScroll).vm.$nextTick();
      expect(allSocietiesComponent.text()).to.contain(
        'There are currently no societies'
      );
    });
  });

  describe('with many societies', () => {
    beforeEach(async () => {
      allSocietiesComponent = await mount(AllSocieties, {
        shallow: false,
        apollo: {
          queryResponses: [
            GenericApolloResponse(
              'societies',
              GenericNodeConnection(Array(9).fill(Society()), {
                hasNextPage: true
              })
            )
          ]
        }
      });
    });

    it('fetches first 9 societies and displays loader', async () => {
      await allSocietiesComponent.findComponent(InfiniteScroll).vm.$nextTick();
      expect(allSocietiesComponent.findAllComponents(SocietyTile)).length(9);
      expect(
        allSocietiesComponent.findComponent(SocietyTile).props('society').name
      ).to.eq('STA');

      expect(
        allSocietiesComponent
          .findComponent(InfiniteScroll)
          .find({ ref: 'bottom-loader' })
          .exists()
      ).to.be.true;
    });
  });

  describe('with some societies', () => {
    beforeEach(async () => {
      allSocietiesComponent = await mount(AllSocieties, {
        shallow: false,
        apollo: {
          queryResponses: [
            GenericApolloResponse(
              'societies',
              GenericNodeConnection(Array(3).fill(Society()))
            )
          ]
        }
      });
    });

    it('fetches all the societies and doesnt display loader', async () => {
      await allSocietiesComponent.findComponent(InfiniteScroll).vm.$nextTick();
      expect(allSocietiesComponent.findAllComponents(SocietyTile)).length(3);
      expect(
        allSocietiesComponent.findComponent(SocietyTile).props('society').name
      ).to.eq('STA');

      expect(
        allSocietiesComponent
          .findComponent(InfiniteScroll)
          .find({ ref: 'bottom-loader' })
          .exists()
      ).to.be.false;
    });
  });
});
