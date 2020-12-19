import { RouterLinkStub } from '@vue/test-utils';
import { expect } from 'chai';

import { makeServer } from '@/fakeApi';
import Home from '@/views/Home.vue';

import { fixTextSpacing, mountWithRouterMock, waitFor } from '../helpers';

describe('Home', function () {
  let homepageComponent;
  let server;

  beforeEach(async () => {
    server = makeServer({ environment: 'test' });
    homepageComponent = await mountWithRouterMock(Home);
  });

  afterEach(() => {
    server.shutdown();
  });

  describe('Splashscreen', () => {
    let splashscreenContainer;

    beforeEach(() => {
      splashscreenContainer = homepageComponent.find('#splashscreen');
    });

    it('shows fallback with no productions', () => {
      expect(splashscreenContainer.text()).to.contain(`Welcome to UOB Theatre`);
    });

    it('shows featured production on splashscreen', async () => {
      seedProductions();

      homepageComponent = await mountWithRouterMock(Home);
      splashscreenContainer = homepageComponent.find('#splashscreen');
      await waitFor(() => homepageComponent.vm.featuredProduction);

      // Should have production name
      expect(splashscreenContainer.text()).to.contain('Upside Down Cake');

      // Should have society putting on
      expect(splashscreenContainer.text()).to.contain('Joe Bloggs Productions');

      // Should have background image
      expect(splashscreenContainer.attributes('style')).to.contain(
        'background-image: url(http://pathto.example/my-image.png)'
      );

      // Should have production's run dates
      expect(fixTextSpacing(splashscreenContainer.text())).to.contain(
        '14 November - 18 November 2020'
      );

      // Shouldn't contain the name of the other production
      expect(splashscreenContainer.text()).not.to.contain(
        'Not This One Again...'
      );
    });
  });

  describe("What's On", () => {
    let whatsOnContainer;
    beforeEach(() => {
      whatsOnContainer = homepageComponent.findComponent({ ref: 'whatson' });
    });
    it('falls back with no productions', () => {
      expect(whatsOnContainer.text()).to.contain(
        'There are currently no upcoming productions'
      );
    });

    it('shows upcoming productions', async () => {
      seedProductions();

      homepageComponent = await mountWithRouterMock(Home);

      await waitFor(() => homepageComponent.vm.upcomingProductions.length > 0);
      let whatsOnProductions = homepageComponent
        .findComponent({
          ref: 'whatson',
        })
        .findAll('.production-feature');

      expect(whatsOnProductions.length).to.equal(3);

      // Checks for the first production
      // Has image in first div
      expect(whatsOnProductions.at(0).find('div:first-of-type img').exists()).to
        .be.true;
      // Is for the first production in the list
      expect(
        whatsOnProductions.at(0).find('div:last-of-type').text()
      ).to.contain('My production without a picture');
      // Has correct dates
      expect(
        fixTextSpacing(whatsOnProductions.at(0).find('div:last-of-type').text())
      ).to.contain('13 November - 14 November 2020');
      // Link to production
      expect(whatsOnProductions.at(0).find('a').exists()).to.be.true;
      expect(
        homepageComponent.findAllComponents(RouterLinkStub).at(1).props('to')
          .name
      ).to.equal('production');
      expect(
        homepageComponent.findAllComponents(RouterLinkStub).at(1).props('to')
          .params.productionSlug
      ).to.equal('my-production-without-a-picture');

      // Second div should be reversed
      expect(whatsOnProductions.at(0).classes()).not.to.contain(
        'flex-row-reverse'
      );
      expect(whatsOnProductions.at(1).classes()).to.contain('flex-row-reverse');
      expect(whatsOnProductions.at(2).classes()).not.to.contain(
        'flex-row-reverse'
      );
    });
  });

  let seedProductions = () => {
    // Seed a production that can't be featured (no cover photo)
    server.create('production', {
      name: 'My production without a picture',
      cover_image: null,
      society: server.create('society', { name: 'Dramatic Pause' }),
      start_date: new Date('2020-11-13'),
      end_date: new Date('2020-11-14'),
    });
    // Seed a production that can be featured
    server.create('production', {
      name: 'Upside Down Cake',
      cover_image: 'http://pathto.example/my-image.png',
      society: server.create('society', { name: 'Joe Bloggs Productions' }),
      start_date: new Date('2020-11-14'),
      end_date: new Date('2020-11-18'),
    });
    // Seed a second production that can be featured
    server.create('production', {
      name: 'Not This One Again...',
      society: server.create('society', { name: 'Jill Bowls Films' }),
    });
  };
});
