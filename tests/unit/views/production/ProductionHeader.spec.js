import { shallowMount } from '@vue/test-utils';
import { expect } from 'chai';

import ProductionBanner from '@/components/production/ProductionBanner.vue';
import ProductionHeader from '@/views/production/ProductionHeader.vue';

describe('ProductionHeader', function () {
  let headerContainer;
  let fakeProduction = {
    name: 'Something',
  };
  beforeEach(async () => {
    headerContainer = shallowMount(ProductionHeader, {
      propsData: {
        production: fakeProduction,
      },
    });
  });

  it('contains a production banner', () => {
    expect(headerContainer.findComponent(ProductionBanner).exists()).to.be.true;
    expect(
      headerContainer.findComponent(ProductionBanner).props('production')
    ).to.eq(fakeProduction);
  });

  it('emits scroll-to-tickets event', async () => {
    await headerContainer
      .findComponent(ProductionBanner)
      .vm.$emit('on-buy-tickets-click');
    expect(headerContainer.emitted('scroll-to-tickets').length).to.eq(1);
  });
});
