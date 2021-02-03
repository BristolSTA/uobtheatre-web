import { expect } from 'chai';
import { DateTime } from 'luxon';

import { makeServer } from '@/fakeApi';
import Society from '@/views/societies/Society.vue';

import { mountWithRouterMock, waitFor } from '../../helpers';

describe('Society page', function () {
  let societyPageComponent;
  let server;

  beforeEach(async () => {
    server = makeServer({ environment: 'test' });

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
    server.create('ProductionNode', {
      name: 'Current Humour',
      slug: 'current-humour',
      isBookable: false,
      end: DateTime.fromISO('2018-11-20'),
      society: testSociety,
    });

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

  it('displays message while loading society', async () => {
    expect(societyPageComponent.text()).to.contain('Loading Society');
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
          ref: 'society_logo',
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
    let producionTableRows;
    beforeEach(async () => {
      await waitFor(() => societyPageComponent.vm.society);
      producionTableRows = societyPageComponent.findAll('tr');
    });

    it('correct number of productions', async () => {
      expect(producionTableRows.length).to.equal(3);
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
