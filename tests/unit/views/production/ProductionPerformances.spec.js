import { mount, RouterLinkStub } from '@vue/test-utils';
import { expect } from 'chai';

import PerformanceOverview from '@/components/production/PerformanceOverview.vue';
import { makeServer } from '@/fakeApi';
import { productionService } from '@/services';
import ProductionPerformances from '@/views/production/ProductionPerformances.vue';

describe('ProductionPerformance', function () {
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
