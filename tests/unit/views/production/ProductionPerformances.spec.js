import { mount, RouterLinkStub } from '@vue/test-utils';
import { expect } from 'chai';

import ProductionPerformances from '@/views/production/ProductionPerformances.vue';

import FakePerformance from '../../fixtures/FakePerformance.js';
import FakeProduction from '../../fixtures/FakeProduction.js';
import { fixTextSpacing } from '../../helpers.js';

describe('ProductionHeader', function () {
  let performancesContainer;

  it('shows no performances available if none returned', async () => {
    await createWithPerformances([]);
    expect(performancesContainer.text()).to.contain('No Upcoming Performances');
  });

  describe('With performances', () => {
    beforeEach(async () => {
      await createWithPerformances([
        // An available in-person & online performance
        {
          start: new Date('28 November 2020 16:00:00 GMT').toISOString(),
          end: new Date('28 November 2020 18:00:00 GMT').toISOString(),
          soldOut: false,
          disabled: false,
          isOnline: true,
          isInperson: true,
        },
        // A sold out performance
        {
          start: new Date('30 November 2020 18:00:00 GMT').toISOString(),
          end: new Date('30 November 2020 20:00:00 GMT').toISOString(),
          soldOut: true,
          disabled: false,
          isOnline: true,
          isInperson: false,
        },
      ]);
    });

    it('displays three performances', () => {
      expect(performancesContainer.findAll('.performance').length).to.eq(2);
    });

    it('displays the correct number of performance overviews', () => {
      let overviews = performancesContainer.findAllComponents(
        PerformanceOverview
      );
      let production = performancesContainer.vm.production;
      expect(overviews.length).to.eq(3);
      expect(overviews.at(0).props('performance')).to.eq(
        production.performances[0]
      );
      expect(overviews.at(1).props('performance')).to.eq(
        production.performances[1]
      );
      expect(overviews.at(2).props('performance')).to.eq(
        production.performances[2]
      );
    });

    it('second performance is sold out and correct', () => {
      let performance = performancesContainer.findAll('.performance').at(1);

      expect(performance.text()).to.contain('Monday 30 Nov');
      expect(performance.find('div.bg-sta-green').exists()).to.be.false;
      expect(performance.find('div.bg-sta-gray-dark').exists()).to.be.true;
      expect(fixTextSpacing(performance.text())).to.contain('Online');
      expect(performance.text()).to.contain('Starting at 18:00');
      expect(performance.text()).to.contain('No Tickets Available');
      expect(performance.find('button').text()).to.eq('SOLD OUT');
    });
  });

  let createWithPerformances = (performances, productionOverrides) => {
    let perfs = [];
    performances.forEach((perf) => {
      perfs.push({
        node: Object.assign(FakePerformance(), perf),
      });
    });

    let production = Object.assign(FakeProduction(), productionOverrides);
    production.performances.edges = perfs;

    performancesContainer = mount(ProductionPerformances, {
      propsData: {
        production: production,
      },
      stubs: {
        RouterLink: RouterLinkStub,
      },
    });
  };
});
