import { makeServer } from '@/fakeApi';
import { expect } from 'chai';
import ProductionPage from '@/views/production/Production.vue';
import ProductionHeader from '@/views/production/ProductionHeader.vue';
import ProductionCastCredits from '@/views/production/ProductionCastCredits.vue';
import ProductionPerformances from '@/views/production/ProductionPerformances.vue';

import { mount } from '@vue/test-utils';
import { waitFor } from '../../../helpers';

describe('Production', function () {
  let productionPageComponent;
  let server;

  let headerComponent, castCreditsComponent, performancesComponent;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });

    // Create a production
    server.create('production', {
      name: 'Legally Ginger',
      slug: 'legally-ginger',
    });

    productionPageComponent = mount(ProductionPage, {
      mocks: {
        $route: {
          params: {
            productionSlug: 'legally-ginger',
          },
        },
      },
    });

    headerComponent = productionPageComponent.findComponent(ProductionHeader);
    castCreditsComponent = productionPageComponent.findComponent(
      ProductionCastCredits
    );
    performancesComponent = productionPageComponent.findComponent(
      ProductionPerformances
    );
  });

  afterEach(() => {
    server.shutdown();
  });

  it('contains the correct components', async () => {
    expect(headerComponent.exists()).to.be.true;
    expect(castCreditsComponent.exists()).to.be.true;
    expect(performancesComponent.exists()).to.be.true;

    await waitFor(() => productionPageComponent.vm.production);

    headerComponent = productionPageComponent.findComponent(ProductionHeader);

    expect(headerComponent.props('production')).to.eq(
      productionPageComponent.vm.production
    );
    expect(castCreditsComponent.props('production')).to.eq(
      productionPageComponent.vm.production
    );
    expect(performancesComponent.props('production')).to.eq(
      productionPageComponent.vm.production
    );
  });

  it('fetches the production', async () => {
    await waitFor(() => productionPageComponent.vm.production);
    expect(productionPageComponent.vm.production.name).to.eq('Legally Ginger');
  });

  it('handles invalid production', () => {
    // TODO: Implement after 404 ready
  });
});
