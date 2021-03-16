import { mount } from '@vue/test-utils';
import { expect } from 'chai';

import SocietyTile from '@/components/society/SocietyTile.vue';

import { generateMountOptions, RouterLinkStub } from '../../helpers';

describe('Society Tile', () => {
  let societyTileComponent;
  beforeAll(() => {
    societyTileComponent = mount(
      SocietyTile,
      generateMountOptions(['router'], {
        propsData: {
          society: {
            name: 'Dramsoc',
            slug: 'dramsoc',
            logo: {
              url: 'example.org/logo.png',
            },
          },
        },
      })
    );
  });

  it('links to society page', () => {
    let link = societyTileComponent.findComponent(RouterLinkStub);
    expect(link.props('to').name).to.eq('society');
    expect(link.props('to').params.societySlug).to.eq('dramsoc');
  });
  it('has logo', () => {
    expect(societyTileComponent.find('img').attributes('src')).to.eq(
      'example.org/logo.png'
    );
  });
  it('has society name', () => {
    expect(societyTileComponent.text()).to.contain('Dramsoc');
  });
});
