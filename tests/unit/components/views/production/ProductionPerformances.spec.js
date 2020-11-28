import { makeServer } from '@/fakeApi';
import { expect } from 'chai';
import ProductionPerformances from '@/views/production/ProductionPerformances.vue';

import { mount, RouterLinkStub } from '@vue/test-utils';
import { productionService } from '@/services';

describe('ProductionHeader', function () {
  let performancesContainer;
  let server;
  beforeEach(async () => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

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
          sold_out: false,
          disabled: false,
          is_online: true,
          is_inperson: true,
          venue: server.create('venue', {
            name: 'Winston Theatre',
          }),
        },
        // A disabled, in-person performance
        {
          start: new Date('29 November 2020 17:00:00 GMT').toISOString(),
          end: new Date('29 November 2020 19:00:00 GMT').toISOString(),
          sold_out: false,
          disabled: true,
          is_online: false,
          is_inperson: true,
          venue: server.create('venue', {
            name: 'Pegg Theatre',
          }),
        },
        // A sold out performance
        {
          start: new Date('30 November 2020 18:00:00 GMT').toISOString(),
          end: new Date('30 November 2020 20:00:00 GMT').toISOString(),
          sold_out: true,
          disabled: false,
          is_online: true,
          is_inperson: false,
        },
      ]);
    });

    it('displays three performances', () => {
      expect(performancesContainer.findAll('.performance').length).to.eq(3);
    });
    it('first performance is available and correct', () => {
      let performance = performancesContainer.findAll('.performance').at(0);

      expect(performance.text()).to.contain('Saturday 28 Nov');
      expect(performance.find('div.bg-sta-green').exists()).to.be.true;
      expect(performance.text()).to.contain('Winston Theatre and Online');
      expect(performance.text()).to.contain('Starting at 16:00');
      expect(performance.text()).to.contain('Tickets Available');
      expect(performance.find('a').text()).to.eq('Book');
      //TODO: Test for link to booking page
    });
    it('second performance is unavailable and correct', () => {
      let performance = performancesContainer.findAll('.performance').at(1);

      expect(performance.text()).to.contain('Sunday 29 Nov');
      expect(performance.find('div.bg-sta-green').exists()).to.be.false;
      expect(performance.find('div.bg-sta-gray-dark').exists()).to.be.true;
      expect(performance.text()).to.contain('Pegg Theatre');
      expect(performance.text()).to.contain('Starting at 17:00');
      expect(performance.text()).to.contain('No Tickets Available');
      expect(performance.find('button').text()).to.eq('Unavailable');
    });
    it('third performance is sold out and correct', () => {
      let performance = performancesContainer.findAll('.performance').at(2);

      expect(performance.text()).to.contain('Monday 30 Nov');
      expect(performance.find('div.bg-sta-green').exists()).to.be.false;
      expect(performance.find('div.bg-sta-gray-dark').exists()).to.be.true;
      expect(performance.text()).to.contain('Online');
      expect(performance.text()).to.contain('Starting at 18:00');
      expect(performance.text()).to.contain('No Tickets Available');
      expect(performance.find('button').text()).to.eq('SOLD OUT');
    });
  });

  let createWithPerformances = (performances, productionOverrides) => {
    let perfs = [];
    performances.forEach((perf) => {
      perfs.push(server.create('performance', perf));
    });

    server.create(
      'production',
      Object.assign(
        {
          name: 'Legally Ginger',
          slug: 'legally-ginger',
          performances: perfs,
        },
        productionOverrides
      )
    );

    return productionService
      .fetchProductionBySlug('legally-ginger')
      .then((production) => {
        performancesContainer = mount(ProductionPerformances, {
          propsData: {
            production: production,
          },
          stubs: {
            RouterLink: RouterLinkStub,
          },
        });
      });
  };
});
