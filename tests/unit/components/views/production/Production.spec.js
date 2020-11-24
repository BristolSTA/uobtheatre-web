import { makeServer } from '@/server';
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

  describe('ProductionHeader', () => {
    let productionHeaderContainer;

    beforeEach(() => {
      productionHeaderContainer = productionComponent.findComponent({ ref: 'header'});
    });

    it('fall back while producion is loading', () => {
      expect(productionHeaderContainer.text()).to.contain(
        'Loading Production...'
      );
    });

    it('shows production with all details in header', async () => {
      seedProductions();

      productionComponent = mountWithRouterMock(Producion);
      productionHeaderContainer = productionComponent.findComponent({ ref: 'header'});
      await waitFor(() => productionComponent.vm.production);

    });
  });

  let seedProductions = () => {
    // Seed a production that can be featured
    server.create('production', {
      name: 'Upside Down Cake',
      cover_image: 'http://pathto.example/my-image.png',
      society: server.create('society', { name: 'Joe Bloggs Productions' }),
      start_date: new Date('2020-11-14'),
      end_date: new Date('2020-11-18'),
      performances: server.createList('performance', 3),
    });
  };
});
