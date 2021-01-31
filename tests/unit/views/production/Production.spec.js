import { mount } from '@vue/test-utils';
import { expect } from 'chai';

import { makeServer } from '@/fakeApi';
import ProductionPage from '@/views/production/Production.vue';
import ProductionCastCredits from '@/views/production/ProductionCastCredits.vue';
import ProductionHeader from '@/views/production/ProductionHeader.vue';
import ProductionPerformances from '@/views/production/ProductionPerformances.vue';

import { mountOptionsWithApollo, waitFor } from '../../helpers';

describe('Production', function () {
  let productionPageComponent;
  let server;

  let headerComponent, castCreditsComponent, performancesComponent;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });

    // Create a production
    server.create('productionNode', {
      name: 'Legally Ginger',
      slug: 'legally-ginger',
    });

    productionPageComponent = mount(
      ProductionPage,
      mountOptionsWithApollo({
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

  it('starts by showing loading screen', () => {
    findComponents();
    expect(productionPageComponent.text()).to.contain('Loading Production...');
    expect(headerComponent.exists()).to.be.false;
    expect(castCreditsComponent.exists()).to.be.false;
    expect(performancesComponent.exists()).to.be.false;
  });

  it('contains the correct components', async () => {
    await waitFor(() => productionPageComponent.vm.production);

    findComponents();

    expect(headerComponent.exists()).to.be.true;
    expect(castCreditsComponent.exists()).to.be.true;
    expect(performancesComponent.exists()).to.be.true;

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

  it('handles invalid production', async () => {
    let fakeRouterPush = jest.fn();
    productionPageComponent = mount(
      ProductionPage,
      mountOptionsWithApollo({
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
