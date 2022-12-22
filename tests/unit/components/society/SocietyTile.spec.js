import { mount } from '#testSupport/helpers';
import { NuxtLinkStub } from '#testSupport/stubs';
import { expect } from 'vitest';

import SocietyTile from '@/components/society/SocietyTile.vue';

describe('Society Tile', () => {
  let societyTileComponent;
  beforeAll(async () => {
    societyTileComponent = await mount(SocietyTile, {
      shallow: false,
      props: {
        society: {
          name: 'Dramsoc',
          slug: 'dramsoc',
          logo: {
            url: 'example.org/logo.png'
          }
        }
      }
    });
  });

  it('links to society page', () => {
    const link = societyTileComponent.findComponent(NuxtLinkStub);
    expect(link.attributes('to')).to.eq('/society/dramsoc');
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
