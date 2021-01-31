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
    it('first performance is available and correct', () => {
      let performance = performancesContainer.findAll('.performance').at(0);
      let links = performance.findAll('a');

      expect(performance.text()).to.contain('Saturday 28 Nov');
      expect(performance.find('div.bg-sta-green').exists()).to.be.true;
      expect(fixTextSpacing(performance.text())).to.contain(
        'Winston Theatre and Online'
      );
      expect(links.length).to.equal(2);
      expect(links.at(0).text()).to.eq('Winston Theatre');
      expect(performance.text()).to.contain('Starting at 16:00');
      expect(performance.text()).to.contain('Tickets Available');
      expect(links.at(1).text()).to.eq('Book');
      //TODO: Test for link to booking page
      //TODO: Test for link to venue page
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
