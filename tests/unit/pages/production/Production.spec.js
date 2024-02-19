import { expect } from 'vitest';
import { mount } from '#testSupport/helpers';
import { GenericApolloResponse } from '#testSupport/helpers/api';

import Production from '#testSupport/fixtures/Production';
import ProductionPage from '@/pages/production/[slug]/index.vue';
import ProductionCastCredits from '@/components/production/ProductionCastCredits.vue';
import ProductionOverview from '@/components/production/ProductionOverview.vue';
import ProductionBanner from '@/components/production/ProductionBanner.vue';
import ProductionPerformances from '@/components/production/ProductionPerformances.vue';
import ProductionDraftWarningBannerVue from '@/components/production/ProductionDraftWarningBanner.vue';

describe('Production', function () {
  let productionPageComponent,
    headerComponent,
    castCreditsComponent,
    performancesComponent,
    overviewComponent,
    draftWarningBannerComponent;

  beforeEach(async () => {
    productionPageComponent = await mount(ProductionPage, {
      apollo: {
        queryResponses: [GenericApolloResponse('production', Production())]
      },
      routeInfo: {
        params: {
          slug: 'legally-ginger'
        }
      }
    });
  });

  const findComponents = () => {
    headerComponent = productionPageComponent.findComponent(ProductionBanner);
    castCreditsComponent = productionPageComponent.findComponent(
      ProductionCastCredits
    );
    overviewComponent =
      productionPageComponent.findComponent(ProductionOverview);
    performancesComponent = productionPageComponent.findComponent(
      ProductionPerformances
    );
    draftWarningBannerComponent = productionPageComponent.findComponent(
      ProductionDraftWarningBannerVue
    );
  };

  it('contains the correct components', () => {
    findComponents();

    expect(headerComponent.exists()).to.be.true;
    expect(overviewComponent.exists()).to.be.true;
    expect(draftWarningBannerComponent.exists()).to.be.true;
    expect(performancesComponent.exists()).to.be.true;

    expect(headerComponent.props('production').name).to.eq('Legally Ginger');
    expect(overviewComponent.props('production').name).to.eq('Legally Ginger');
    expect(performancesComponent.props('production').name).to.eq(
      'Legally Ginger'
    );
  });

  it('can show cast credits component', async () => {
    await productionPageComponent.setData({
      overview: false
    });
    findComponents();

    expect(castCreditsComponent.exists()).to.be.true;

    expect(castCreditsComponent.props('production').name).to.eq(
      'Legally Ginger'
    );
  });

  it('fetches the production', async () => {
    await productionPageComponent.vm.$nextTick();
    expect(productionPageComponent.vm.production.name).to.eq('Legally Ginger');
  });
});
