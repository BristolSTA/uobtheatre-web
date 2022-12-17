import { mount, fixTextSpacing } from '#testSupport/helpers';
import { expect, vi } from 'vitest';
import { DateTime } from 'luxon';

import GenericNodeConnection from '#testSupport/fixtures/support/GenericNodeConnection.js';
import Production from '#testSupport/fixtures/Production.js';
import Performance from '#testSupport/fixtures/Performance.js';
import ProductionPerformances from '@/components/production/ProductionPerformances.vue';
import PerformanceOverview from '@/components/performance/PerformanceOverview.vue';

describe('Production Performances', function () {
  let performancesContainer;
  beforeEach(() => {
    vi.useFakeTimers();

    Date.now = vi.fn(() => new Date(Date.UTC(2019, 1, 1)).valueOf());
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows no performances available if none returned', () => {
    createWithPerformances([]);
    expect(performancesContainer.text()).to.contain('No Upcoming Performances');
  });

  it('shows no performances available if none returned', () => {
    Date.now = vi.fn(() => new Date(Date.UTC(2021, 1, 1)).valueOf());
    createWithPerformances([]);
    expect(performancesContainer.text()).to.contain(
      'You are currently viewing archive details of an event in the past.'
    );
  });

  describe('With performances', () => {
    beforeEach(() => {
      createWithPerformances([
        // An available in-person & online performance
        {
          doorsOpen: DateTime.fromISO('2020-11-28T15:00:00'),
          start: DateTime.fromISO('2020-11-28T16:00:00'),
          end: DateTime.fromISO('2020-11-28T18:00:00'),
          soldOut: false,
          disabled: false,
          isOnline: true,
          isInperson: true
        },
        // A sold out performance
        {
          id: 2,
          doorsOpen: DateTime.fromISO('2020-11-28T17:00:00'),
          start: DateTime.fromISO('2020-11-30T18:00:00'),
          end: DateTime.fromISO('2020-11-30T20:00:00'),
          soldOut: true,
          isBookable: false,
          disabled: false,
          isOnline: true,
          isInperson: false
        }
      ]);
    });

    it('displays two performances', () => {
      expect(performancesContainer.findAll('.performance').length).to.eq(2);
    });

    it('displays the correct number of performance overviews', () => {
      const overviews =
        performancesContainer.findAllComponents(PerformanceOverview);
      const production = performancesContainer.vm.production;
      expect(overviews.length).to.eq(2);
      expect(overviews.at(0).props('performance')).to.eq(
        production.performances.edges[0].node
      );
      expect(overviews.at(1).props('performance')).to.eq(
        production.performances.edges[1].node
      );
    });

    it('second performance is sold out and correct', () => {
      const performance = performancesContainer.findAll('.performance').at(1);

      expect(performance.text()).to.contain('Monday 30 Nov');
      expect(performance.classes('bg-sta-green')).to.be.false;
      expect(performance.classes('bg-sta-gray-dark')).to.be.true;
      expect(fixTextSpacing(performance.text())).to.contain('Online');
      expect(performance.text()).to.contain('Doors open at 17:00');
      expect(performance.text()).to.contain('No Tickets Available');
      expect(performance.find('button').text()).to.eq('SOLD OUT');
    });

    it('sends user to warnings stage when they click book', async () => {
      await performancesContainer
        .findComponent(PerformanceOverview)
        .vm.$emit('select');

      const router = useRouter();

      expect(router.push.mock.calls.length).to.eq(1);
      expect(router.push.mock.calls[0][0]).to.eq(
        `/production/legally-ginger/book/${performancesContainer.vm.production.performances.edges[0].node.id}`
      );
    });
  });

  const createWithPerformances = (performances, productionOverrides) => {
    const production = Production(productionOverrides);
    production.performances = GenericNodeConnection(
      performances.map((performance) => Performance(performance))
    );

    performancesContainer = mount(ProductionPerformances, {
      props: {
        production
      },
      shallow: false,
      mockRouter: true
    });
  };
});
