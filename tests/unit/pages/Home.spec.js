import { RouterLinkStub } from '@vue/test-utils';
import { expect } from 'chai';

import {
  fixTextSpacing,
  generateMountOptions,
  mountWithRouterMock,
} from '../helpers';
import Production from '../fixtures/Production';
import Carousel from '@/components/ui/Carousel.vue';
import Home from '@/pages/index.vue';

describe('Home', function () {
  let homepageComponent;

  beforeEach(async () => {
    homepageComponent = await mountWithRouterMock(
      Home,
      generateMountOptions(['apollo'])
    );
  });

  describe('Splashscreen', () => {
    let splashscreenContainer;

    beforeEach(() => {
      splashscreenContainer = homepageComponent.find('#splashscreen');
    });

    it('shows fallback with no productions', () => {
      expect(fixTextSpacing(splashscreenContainer.text())).to.contain(
        'Welcome to UOB Theatre The Home of Bristol Student Performing Arts'
      );
    });

    it('shows fallback with no featured production with image', async () => {
      homepageComponent = await mountWithRouterMock(Home, {
        data() {
          return { upcomingProductions: [Production({ coverImage: null })] };
        },
      });

      expect(fixTextSpacing(homepageComponent.text())).to.contain(
        'Welcome to UOB Theatre The Home of Bristol Student Performing Arts'
      );
      expect(homepageComponent.findComponent(Carousel).exists()).to.be.false;
    });

    it('shows carousel component with correct data', async () => {
      await seedProductions();

      expect(homepageComponent.findComponent(Carousel).exists()).to.be.true;
      expect(homepageComponent.vm.bannerProductions.length).equals(3);
    });

    it('carousel displays correct data', async () => {
      await seedProductions();

      const carousel = homepageComponent.findComponent(Carousel);
      const slide = carousel.findComponent({ ref: 'carousel' });
      expect(slide.text()).to.contain('STA');
      expect(slide.text()).to.contain('Legally Ginger');
      expect(fixTextSpacing(slide.text())).to.contain(
        '14 November - 18 November 2020'
      );

      expect(slide.attributes('style')).to.contain(
        'background-image: url(http://pathto.example/cover-image.png)'
      );
      expect(
        homepageComponent.findAllComponents(RouterLinkStub).at(0).props('to')
      ).to.equal('/production/legally-ginger');
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
      await seedProductions();

      const whatsOnProductions = homepageComponent
        .findComponent({
          ref: 'whatson',
        })
        .findAll('.production-feature');

      expect(whatsOnProductions.length).to.equal(4);

      // Checks for the first production
      // Has image in first div
      expect(whatsOnProductions.at(0).find('div:first-of-type img').exists()).to
        .be.true;
      // Is for the first production in the list
      expect(
        whatsOnProductions.at(0).find('div:last-of-type').text()
      ).to.contain('Legally Ginger');
      // Has correct dates
      expect(
        fixTextSpacing(whatsOnProductions.at(0).find('div:last-of-type').text())
      ).to.contain('13 November 2020');
      // Link to production
      expect(whatsOnProductions.at(0).find('a').exists()).to.be.true;
      expect(
        homepageComponent.findAllComponents(RouterLinkStub).at(2).props('to')
      ).to.equal('/production/legally-ginger');

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

  const seedProductions = async () => {
    homepageComponent = await mountWithRouterMock(
      Home,
      generateMountOptions(['apollo'], {
        data() {
          return {
            upcomingProductions: [
              // Seed a production that can't be featured (no cover photo)
              Production({
                coverImage: null,
                start: '2020-11-13',
                end: '2020-11-13',
              }),
              // Seed a production that can be featured
              Production({ id: 2, start: '2020-11-14', end: '2020-11-18' }),
              Production({ id: 3, start: '2020-11-14', end: '2020-11-18' }),
              Production({ id: 4 }),
            ],
          };
        },
      })
    );
  };
});
