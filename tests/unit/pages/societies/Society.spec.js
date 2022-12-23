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
                  isBookable: true,
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
    const splashscreenContainer = societyPageComponent.find({
      ref: 'banner'
    });

    expect(splashscreenContainer.attributes('style')).to.contain(
      'background-image: url(http://pathto.example/society-banner.png)'
    );
  });

  describe('society production list', () => {
    let links;
    let tableRows;
    beforeEach(() => {
      tableRows = societyPageComponent.findAll('tr');
      links = societyPageComponent.findAllComponents(NuxtLinkStub);
    });

    it('correct number of productions', () => {
      expect(tableRows.length).to.equal(2);
      expect(links.length).to.equal(3);
    });

    it('table rows have correct text', () => {
      expect(tableRows.at(0).text()).to.contain('Bins');
      expect(tableRows.at(0).text()).to.contain('Book Now');

      expect(tableRows.at(1).text()).to.contain('Centuary');
      expect(tableRows.at(1).text()).to.contain('October 2019');
    });

    it('has correct links', () => {
      expect(links.at(0).attributes('to')).to.equal('/production/bins');
      expect(links.at(1).attributes('to')).to.equal('/production/bins/book');
      expect(links.at(2).attributes('to')).to.equal('/production/centuary');
    });
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

    expect(createError).toHaveBeenCalledWith({
      statusCode: 404,
      message: 'This society does not exist'
    });
  });
});
