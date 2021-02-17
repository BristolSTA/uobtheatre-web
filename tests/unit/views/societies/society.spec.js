import { RouterLinkStub } from '@vue/test-utils';
import { expect } from 'chai';
import { DateTime } from 'luxon';

import Society from '@/views/societies/Society.vue';

import { executeWithServer, mountWithRouterMock, waitFor } from '../../helpers';

describe('Society page', function () {
  let societyPageComponent;
  let server;

  beforeEach(async () => {
    server = await executeWithServer((server) => {
      // Create a society
      let testSociety = server.create('SocietyNode', {
        name: 'Drama Society',
        slug: 'drama-soc',
        description: 'not a musical theatre society',
        logo: server.create('GrapheneImageFieldNode', {
          url: 'http://pathto.example/society-logo.png',
        }),
        banner: server.create('GrapheneImageFieldNode', {
          url: 'http://pathto.example/society-banner.png',
        }),
      });

      server.create('ProductionNode', {
        name: 'Bins',
        slug: 'bins',
        isBookable: true,
        end: DateTime.fromISO('2020-10-18'),
        society: testSociety,
      });
      server.create('ProductionNode', {
        name: 'Centuary',
        slug: 'centuary',
        isBookable: false,
        end: DateTime.fromISO('2019-10-19'),
        society: testSociety,
      });
    }, false);

    societyPageComponent = await mountWithRouterMock(
      Society,
      {},
      {
        params: {
          societySlug: 'drama-soc',
        },
      }
    );
  });

  afterEach(() => {
    server.shutdown();
  });

  it('displays message while loading society', () => {
    expect(societyPageComponent.text()).to.contain('Loading Society...');
  });

  it('fetches the society', async () => {
    await waitFor(() => societyPageComponent.vm.society);
    expect(societyPageComponent.vm.society.name).to.eq('Drama Society');

    expect(societyPageComponent.text()).to.contain('Drama Society');

    expect(societyPageComponent.text()).to.contain(
      'not a musical theatre society'
    );

    expect(
      societyPageComponent
        .findComponent({
          ref: 'society-logo',
        })
        .attributes('src')
    ).to.equal('http://pathto.example/society-logo.png');
  });

  it('shows society splashscreen', async () => {
    await waitFor(() => societyPageComponent.vm.society);
    let splashscreenContainer = societyPageComponent.find('#splashscreen');

    expect(splashscreenContainer.text()).to.contain('Drama Society');

    expect(splashscreenContainer.attributes('style')).to.contain(
      'background-image: url(http://pathto.example/society-banner.png)'
    );
  });

  describe('society production list', () => {
    let links;
    let tableRows;
    beforeEach(async () => {
      await waitFor(() => societyPageComponent.vm.society);
      tableRows = societyPageComponent.findAll('tr');
      links = societyPageComponent.findAllComponents(RouterLinkStub);
    });

    it('correct number of productions', async () => {
      expect(tableRows.length).to.equal(2);
      expect(links.length).to.equal(3);
    });

    it('table rows have correct text', async () => {
      expect(tableRows.at(0).text()).to.contain('Bins');
      expect(tableRows.at(0).text()).to.contain('Book Now');

      expect(tableRows.at(1).text()).to.contain('Centuary');
      expect(tableRows.at(1).text()).to.contain('October 2019');
    });

    it('has correct links', async () => {
      expect(links.at(0).props('to').name).to.equal('production');
      expect(links.at(0).props('to').params.productionSlug).to.equal('bins');

      expect(links.at(1).props('to').name).to.equal('production.book.select');
      expect(links.at(1).props('to').params.productionSlug).to.equal('bins');

      expect(links.at(2).props('to').name).to.equal('production');
      expect(links.at(2).props('to').params.productionSlug).to.equal(
        'centuary'
      );
    });
  });

  it('handles invalid society', async () => {
    let fakeRouterNext = jest.fn();
    societyPageComponent = await mountWithRouterMock(
      Society,
      {},
      {
        params: {
          societySlug: 'not-drama-soc',
        },
      },
      null,
      fakeRouterNext
    );
    await waitFor(() => fakeRouterNext.mock.calls.length);
    expect(fakeRouterNext.mock.calls.length).to.eq(1);
    expect(fakeRouterNext.mock.calls[0][0]).to.include({ name: '404' });
  });
});
