import { mount } from '#testSupport/helpers';
import { expect } from 'vitest';

import ProductionDraftWarningBannerVue from '~~/components/production/ProductionDraftWarningBanner.vue';
import Production from '../../support/fixtures/Production';

describe('Production draft warning banner', () => {
  let draftWarningBannerComponent;

  it.each([['PUBLISHED'], ['CLOSED'], ['COMPLETE']])(
    'does appear on draft prod',
    async (status) => {
      await createWithStatus(status);
      expect(draftWarningBannerComponent.find({ ref: 'draft-banner' }).exists())
        .to.be.false;
    }
  );

  it.each([
    ['DRAFT', 'Draft'],
    ['PENDING', 'Pending'],
    ['APPROVED', 'Approved']
  ])('does appear on draft prod', async (status, statusName) => {
    await createWithStatus(status);

    expect(draftWarningBannerComponent.find({ ref: 'draft-banner' }).exists())
      .to.be.true;
    expect(draftWarningBannerComponent.text()).to.contain(
      `${statusName} Production Preview - This Page Is Not Public Yet`
    );
  });

  const createWithStatus = async (prodStatus) => {
    draftWarningBannerComponent = await mount(ProductionDraftWarningBannerVue, {
      shallow: false,
      props: {
        production: Production({
          status: prodStatus
        })
      }
    });
  };
});
