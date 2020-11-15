import { makeServer } from '@/server';
import { shallowMount } from '@vue/test-utils';
import { expect } from 'chai';
import Home from '@/views/Home.vue';
import { fixTextSpacing, waitFor } from '../../helpers';

describe('Home', function () {
  let homepageComponent;
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
    homepageComponent = shallowMount(Home);
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
      expect(splashscreenContainer.text()).to.contain('Welcome to UOB Theatre');
    });

    it('shows featured production on splashscreen', async () => {
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
      // Seed a second production that can be featurted
      server.create('production', {
        name: 'Not This One Again...',
        society: server.create('society', { name: 'Jill Bowls Films' }),
      });

      homepageComponent = shallowMount(Home);
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
});
