import { mount } from '@vue/test-utils';
import { expect } from 'chai';

import { generateMountOptions, RouterLinkStub } from '../../helpers';
import ProductionTile from '@/components/production/ProductionTile';

describe('Production Tile', () => {
  let productionTileComponent;
  beforeAll(() => {
    productionTileComponent = mount(
      ProductionTile,
      generateMountOptions(['router'], {
        propsData: {
          production: {
            slug: 'legally-ginger',
            name: 'Legally Ginger',
            featuredImage: {
              url: 'example.org/feature-image.png',
            },
            start: '2021-03-03T14:00:00',
            end: '2021-03-06T14:00:00',
          },
        },
      })
    );
  });

  it('links to production page', () => {
    const link = productionTileComponent.findComponent(RouterLinkStub);
    expect(link.props('to')).to.eq('/production/legally-ginger');
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
