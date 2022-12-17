import { mount } from '#testSupport/helpers';
import { NuxtLinkStub } from '#testSupport/stubs';
import { expect } from 'vitest';

import ProductionTile from '@/components/production/ProductionTile.vue';

describe('Production Tile', () => {
  let productionTileComponent;
  beforeAll(() => {
    productionTileComponent = mount(ProductionTile, {
      shallow: false,
      props: {
        production: {
          slug: 'legally-ginger',
          name: 'Legally Ginger',
          featuredImage: {
            url: 'example.org/feature-image.png'
          },
          start: '2021-03-03T14:00:00',
          end: '2021-03-06T14:00:00'
        }
      }
    });
  });

  it('links to production page', () => {
    const link = productionTileComponent.findComponent(NuxtLinkStub);
    expect(link.attributes('to')).to.eq('/production/legally-ginger');
  });
  it('has feature image', () => {
    expect(productionTileComponent.find('img').attributes('src')).to.eq(
      'example.org/feature-image.png'
    );
  });
  it('has show name', () => {
    expect(productionTileComponent.text()).to.contain('Legally Ginger');
  });
  it('has show dates', () => {
    expect(productionTileComponent.text()).to.contain('3 Mar - 6 Mar 2021');
  });
});
