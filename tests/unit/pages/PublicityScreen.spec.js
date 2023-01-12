import { expect, vi } from 'vitest';

import Venue from '#testSupport/fixtures/Venue';
import { mount } from '#testSupport/helpers';
import {
  GenericApolloResponse,
  GenericNodeConnection
} from '#testSupport/helpers/api';
import Production from '#testSupport/fixtures/Production';
import Performance from '#testSupport/fixtures/Performance';
import PublicityScreenPage from '@/pages/publicity-screen/[venueSlugs]/index.vue';
import HaveTicketsReadyScreen from '@/components/publicity-screens/HaveTicketsReadyScreen.vue';
import { flushPromises } from '@vue/test-utils';

const prod1 = Production({ id: 1, name: 'My Production 1' });
const prod2 = Production({ id: 2, name: 'My Production 2' });
const prod3 = Production({
  id: 3,
  name: 'My Production 3',
  performances: GenericNodeConnection([
    Performance({
      doorsOpen: '2020-01-01T10:30:00',
      start: '2020-01-01T10:40:00'
    })
  ])
});
const prod4 = Production({
  id: 4,
  name: 'My Production 4',
  isBookable: false,
  performances: GenericNodeConnection([
    Performance({
      doorsOpen: '2020-01-01T10:30:00',
      start: '2020-01-01T10:40:00'
    })
  ])
});

describe('Publicity Screen', function () {
  let pageComponent;
  beforeEach(async () => {
    vi.useFakeTimers('modern');
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  async function makeComponent(callstack, onlyTheseVenues = false) {
    pageComponent = await mount(PublicityScreenPage, {
      shallow: false,
      apollo: {
        queryResponses: callstack
      },
      routeInfo: {
        params: {
          venueSlugs: 'my-venue1,my-venue2'
        },
        query: {
          onlyTheseVenues
        }
      },
      routerInfo: {
        resolve: () => 'http://my.url/'
      }
    });

    await flushPromises();
  }

  it('handles no available productions', async () => {
    await makeComponent([
      GenericApolloResponse(
        'venue',
        Venue({ name: 'My Venue 1', productions: GenericNodeConnection() })
      ),
      GenericApolloResponse(
        'venue',
        Venue({ name: 'My Venue 2', productions: GenericNodeConnection() })
      ),
      GenericApolloResponse('productions', GenericNodeConnection())
    ]);
    expect(pageComponent.text()).to.contain(
      'Welcome to My Venue 1 & My Venue 2'
    );
  });

  describe('with some upcoming productions', () => {
    const genComponent = async (onlyTheseVenues) => {
      await makeComponent(
        [
          GenericApolloResponse(
            'venue',
            Venue({
              name: 'My Venue 1',
              productions: GenericNodeConnection()
            })
          ),
          GenericApolloResponse(
            'venue',
            Venue({
              name: 'My Venue 2',
              productions: GenericNodeConnection([prod1, prod4])
            })
          ),
          GenericApolloResponse(
            'productions',
            GenericNodeConnection([prod1, prod2])
          )
        ],
        onlyTheseVenues
      );
    };

    it('can show all bookable upcoming productions', async () => {
      await genComponent();
      // First slide is the first production
      expect(pageComponent.vm.marketableProductions.length).to.eq(2);
      expect(pageComponent.text()).to.contain('My Production 1');
      expect(pageComponent.text()).not.to.contain('My Production 2');

      vi.advanceTimersByTime(10001);
      // Second slide is the second production
      await pageComponent.vm.$nextTick();
      expect(pageComponent.text()).not.to.contain('My Production 1');
      expect(pageComponent.text()).to.contain('My Production 2');

      vi.advanceTimersByTime(10001);
      // Third slide is the first production (loops back...)
      await pageComponent.vm.$nextTick();
      expect(pageComponent.text()).to.contain('My Production 1');
      expect(pageComponent.text()).not.to.contain('My Production 2');
    });

    it('can show upcoming productions for given venues only', async () => {
      await genComponent(true);

      // First slide is the first, and only, production
      expect(pageComponent.vm.marketableProductions.length).to.eq(1);
      expect(pageComponent.text()).to.contain('My Production 1');
    });
  });

  describe('with an active performance', () => {
    it.each([
      [prod3, 'My Production 3', 2],
      [prod4, 'My Production 4', 1]
    ])(
      'shows box office screens (%#)',
      async (
        activePerformanceProduction,
        productionName,
        numExpectedMarketable
      ) => {
        await makeComponent(
          [
            GenericApolloResponse(
              'venue',
              Venue({
                id: 1,
                name: 'My Venue 1',
                productions: GenericNodeConnection([prod1])
              })
            ),
            GenericApolloResponse(
              'venue',
              Venue({
                id: 2,
                name: 'My Venue 2',
                productions: GenericNodeConnection([
                  activePerformanceProduction
                ])
              })
            ),
            GenericApolloResponse(
              'venue',
              Venue({
                id: 2,
                name: 'My Venue 2',
                productions: GenericNodeConnection([
                  activePerformanceProduction
                ])
              })
            ),
            GenericApolloResponse(
              'venue',
              Venue({
                id: 2,
                name: 'My Venue 2',
                productions: GenericNodeConnection([
                  activePerformanceProduction
                ])
              })
            )
          ],
          true
        );
        vi.setSystemTime(new Date('2020-01-01T10:00:00'));

        // Currently 10:00:00, doors open at 10:30:00 (over 20 mins away, so we expect to be in general upcoming productions state)
        expect(pageComponent.vm.productionsOnNow.length).to.be.eq(0);
        expect(pageComponent.vm.marketableProductions.length).to.be.eq(
          numExpectedMarketable
        );
        expect(pageComponent.text()).to.contain('Book now at');
        expect(
          pageComponent
            .findComponent({ ref: 'activeBoxOfficeComponent' })
            .exists()
        ).to.be.false;

        vi.setSystemTime(new Date('2020-01-01T10:11:00'));
        vi.advanceTimersByTime(10000);
        await pageComponent.vm.$nextTick();
        expect(pageComponent.vm.productionsOnNow.length).to.be.eq(1);
        expect(
          pageComponent
            .findComponent({ ref: 'activeBoxOfficeComponent' })
            .exists()
        ).to.be.true;
        expect(pageComponent.text()).to.contain(
          `Welcome to this performance of${productionName}`
        );

        vi.setSystemTime(new Date('2020-01-01T10:31:00'));
        vi.advanceTimersByTime(10000);
        await pageComponent.vm.$nextTick();
        expect(pageComponent.findComponent(HaveTicketsReadyScreen).exists()).to
          .be.true;

        vi.setSystemTime(new Date('2020-01-01T11:00:00'));
        vi.advanceTimersByTime(10000);
        await pageComponent.vm.$nextTick();
        expect(pageComponent.text()).to.contain('Book now at');
        expect(
          pageComponent
            .findComponent({ ref: 'activeBoxOfficeComponent' })
            .exists()
        ).to.be.false;
      }
    );
  });
});
