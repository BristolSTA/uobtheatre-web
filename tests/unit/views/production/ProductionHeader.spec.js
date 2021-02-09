import { mount } from '@vue/test-utils';
import { expect } from 'chai';

import ProductionBanner from '@/components/production/ProductionBanner.vue';
import ProductionHeader from '@/views/production/ProductionHeader.vue';

import {
  executeWithServer,
  generateMountOptions,
  runApolloQuery,
} from '../../helpers';

describe('ProductionHeader', function () {
  let headerContainer;
  let productionJSON;
  beforeAll(async () => {
    await executeWithServer(async (server) => {
      let production = server.create('productionNode');
      let gqlResult = await runApolloQuery({
        query: require('@/graphql/queries/ProductionBySlug.gql'),
        variables: {
          slug: production.slug,
        },
      });
      productionJSON = gqlResult.data.production;
    });
  });
  beforeEach(async () => {
    headerContainer = mount(
      ProductionHeader,
      generateMountOptions(['router'], {
        propsData: {
          production: productionJSON,
        },
      })
    );
  });

  it('contains a production banner', () => {
    expect(headerContainer.findComponent(ProductionBanner).exists()).to.be.true;
    expect(
      headerContainer.findComponent(ProductionBanner).props('production')
    ).to.eq(productionJSON);
  });

  it('emits scroll-to-tickets event', async () => {
    await headerContainer
      .findComponent(ProductionBanner)
      .vm.$emit('on-buy-tickets-click');
    expect(headerContainer.emitted('scroll-to-tickets').length).to.eq(1);
  });
});
