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
          start: Date.parse('28 November 2020 16:00:00 GMT'),
          end: Date.parse('28 November 2020 18:00:00 GMT'),
          sold_out: false,
          disabled: false,
          is_online: true,
          is_inperson: true,
        },
        // A disabled, in-person performance
        {
          start: Date.parse('29 November 2020 17:00:00 GMT'),
          end: Date.parse('29 November 2020 19:00:00 GMT'),
          sold_out: false,
          disabled: true,
          is_online: false,
          is_inperson: true,
        },
        // A sold out performance
        {
          start: Date.parse('30 November 2020 18:00:00 GMT'),
          end: Date.parse('30 November 2020 20:00:00 GMT'),
          sold_out: true,
          disabled: false,
          is_online: false,
          is_inperson: true,
        },
      ]);
    });

    it('displays three performances', () => {
      expect(performancesContainer.findAll('.performance').length).to.eq(3);
    });
    it('first performance is available and correct', () => {});
    it('second performance is unavailable and correct', () => {});
    it('third performance is sold out and correct', () => {});
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
