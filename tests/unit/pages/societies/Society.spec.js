import { expect } from 'vitest';
import { mount } from '#testSupport/helpers';
import { NuxtLinkStub } from '#testSupport/stubs';
import {
  GenericApolloResponse,
  GenericNodeConnection
} from '#testSupport/helpers/api';

import FakeSociety from '#testSupport/fixtures/Society';
import Production from '#testSupport/fixtures/Production';
import Society from '@/pages/society/[slug]/index.vue';

describe('Society page', function () {
  let societyPageComponent;

  beforeEach(async () => {
    societyPageComponent = await mount(Society, {
      shallow: false,
      apollo: {
        queryResponses: [
          GenericApolloResponse(
            'society',
            FakeSociety({
              productions: GenericNodeConnection([
                Production({
                  name: 'Bins',
                  slug: 'bins',
                  isBookable: false,
                  end: '2020-10-18T00:00:00'
                }),
                Production({
                  name: 'Centuary',
                  slug: 'centuary',
                  isBookable: false,
                  end: '2019-10-19T00:00:00'
                })
              ])
            })
          )
        ]
      },
      routeInfo: {
        params: {
          slug: 'sta'
        }
      }
    });
  });

  it('fetches the society', async () => {
    await societyPageComponent.vm.$nextTick();
    expect(societyPageComponent.vm.society.name).to.eq('STA');

    expect(societyPageComponent.text()).to.contain('STA');

    expect(societyPageComponent.text()).to.contain('We do it in the dark');

    expect(
      societyPageComponent
        .find({
          ref: 'society-logo'
        })
        .attributes('src')
    ).to.equal('http://pathto.example/logo-image.png');
  });

  it('shows society splashscreen', async () => {
    await societyPageComponent.vm.$nextTick();
    // Banner is rendered by the shared LayoutInfoPage as a div with inline background-image
    const bannerEl = societyPageComponent.find('[style*="background-image"]');
    expect(bannerEl.exists()).to.be.true;
    // Be robust to quoting differences in inline style (url("..."))
    expect(bannerEl.attributes('style')).to.contain(
      'http://pathto.example/society-banner.png'
    );
  });

  describe('society contact details', () => {
    it('displays website and contact when present', async () => {
      await societyPageComponent.vm.$nextTick();
      const sidebarText = societyPageComponent.text();
      expect(sidebarText).to.contain('Website:');
      expect(sidebarText).to.contain('Contact:');
    });

    it('hides website and contact when not present', async () => {
      const comp = await mount(Society, {
        shallow: false,
        apollo: {
          queryResponses: [
            GenericApolloResponse(
              'society',
              FakeSociety({
                website: null,
                contact: null,
                productions: GenericNodeConnection([
                  Production({
                    name: 'Bins',
                    slug: 'bins',
                    isBookable: false,
                    end: '2020-10-18T00:00:00'
                  })
                ])
              })
            )
          ]
        },
        routeInfo: { params: { slug: 'sta' } }
      });
      await comp.vm.$nextTick();
      const sidebarText = comp.text();
      expect(sidebarText).to.not.contain('Website:');
      expect(sidebarText).to.not.contain('Contact:');
    });
  });

  describe('society production list', () => {
    let links;
    let table;
    let tableRows;
    beforeEach(() => {
      table = societyPageComponent.find({ ref: 'production-list' });
      tableRows = table.findAll('tr');
      links = table.findAllComponents(NuxtLinkStub);
    });

    it('correct number of productions', () => {
      expect(tableRows.length).to.equal(2);
      expect(links.length).to.equal(2);
    });

    it('table rows have correct text', () => {
      expect(tableRows.at(0).text()).to.contain('Bins');
      expect(tableRows.at(0).text()).to.contain('October 2020');

      expect(tableRows.at(1).text()).to.contain('Centuary');
      expect(tableRows.at(1).text()).to.contain('October 2019');
    });

    it('has correct links', () => {
      expect(links.at(0).attributes('to')).to.equal('/production/bins');
      expect(links.at(1).attributes('to')).to.equal('/production/centuary');
    });
  });

  it('shows description section when provided', async () => {
    await societyPageComponent.vm.$nextTick();
    expect(societyPageComponent.text()).to.contain('Description');
    expect(societyPageComponent.text()).to.contain('We do it in the dark');
  });

  it('handles invalid society', async () => {
    await expect(async () => {
      await mount(Society, {
        apollo: {
          queryResponses: [GenericApolloResponse('society')]
        },
        routeInfo: {
          params: {
            slug: 'not-drama-soc'
          }
        }
      });
    }).rejects.toThrowError();

    expect(createError).toHaveBeenCalledOnce();
  });
});
