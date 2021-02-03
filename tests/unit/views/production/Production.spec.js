import { mount } from '@vue/test-utils';
import { expect } from 'chai';

import { makeServer } from '@/fakeApi';
import { productionService } from '@/services';
import ProductionPage from '@/views/production/Production.vue';
import ProductionCastCredits from '@/views/production/ProductionCastCredits.vue';
import ProductionHeader from '@/views/production/ProductionHeader.vue';
import ProductionPerformances from '@/views/production/ProductionPerformances.vue';

import { generateMountOptions, waitFor } from '../../helpers';

describe('Production', function () {
  let productionPageComponent;
  let productionObject;
  let server;

  let headerComponent, castCreditsComponent, performancesComponent;

  beforeEach(async () => {
    server = makeServer({ environment: 'test' });

    // Create a production
    server.create('productionNode', {
      name: 'Legally Ginger',
      slug: 'legally-ginger',
    });

    productionPageComponent = mount(
      ProductionPage,
      generateMountOptions(['apollo', 'router'], {
        mocks: {
          $route: {
            params: {
              productionSlug: 'legally-ginger',
            },
          },
        },
      })
    );
  });

  afterEach(() => {
    server.shutdown();
  });

  let findComponents = () => {
    headerComponent = productionPageComponent.findComponent(ProductionHeader);
    castCreditsComponent = productionPageComponent.findComponent(
      ProductionCastCredits
    );
    performancesComponent = productionPageComponent.findComponent(
      ProductionPerformances
    );
  };

  it('contains the correct components', async () => {
    findComponents();

    expect(headerComponent.exists()).to.be.true;
    expect(castCreditsComponent.exists()).to.be.true;
    expect(performancesComponent.exists()).to.be.true;

    expect(headerComponent.props('production')).to.eq(productionObject);
    expect(castCreditsComponent.props('production')).to.eq(productionObject);
    expect(performancesComponent.props('production')).to.eq(productionObject);
  });

  it('fetches the production', async () => {
    await waitFor(() => productionPageComponent.vm.production);
    expect(productionPageComponent.vm.production.name).to.eq('Legally Ginger');
  });

  it('handles invalid production', async () => {
    let fakeRouterPush = jest.fn();
    productionPageComponent = mount(
      ProductionPage,
      generateMountOptions(['apollo', 'router'], {
        mocks: {
          $route: {
            params: {
              productionSlug: 'legally-not-allowed',
            },
          },
          $router: {
            push: fakeRouterPush,
          },
        },
      })
    );
    await waitFor(() => fakeRouterPush.mock.calls.length);
    expect(fakeRouterPush.mock.calls.length).to.eq(1);
  });
});
