import { mount } from '@vue/test-utils';
import { expect } from 'chai';

import ProductionPage from '@/views/production/Production.vue';
import ProductionCastCredits from '@/views/production/ProductionCastCredits.vue';
import ProductionHeader from '@/views/production/ProductionHeader.vue';
import ProductionPerformances from '@/views/production/ProductionPerformances.vue';

import {
  generateMountOptions,
  makeServer,
  mountWithRouterMock,
  runApolloQuery,
  waitFor,
} from '../../helpers';

describe('Production', function () {
  let productionPageComponent;
  let productionObject;
  let server;

  let headerComponent, castCreditsComponent, performancesComponent;

  beforeEach(async () => {
    server = makeServer();

    // Create a production
    server.create('productionNode', {
      name: 'Legally Ginger',
      slug: 'legally-ginger',
    });

    let { data } = await runApolloQuery({
      query: require('@/graphql/queries/ProductionBySlug.gql'),
      variables: {
        slug: 'legally-ginger',
      },
    });
    productionObject = data.production;
    productionPageComponent = await mountWithRouterMock(ProductionPage, {
      propsData: {
        production: productionObject,
      },
    });
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
});
