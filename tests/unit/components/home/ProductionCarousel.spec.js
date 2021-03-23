import { RouterLinkStub } from '@vue/test-utils';
import { expect } from 'chai';
import { DateTime } from 'luxon';

import ProductionCarousel from '@/components/home/ProductionCarousel.vue';

import {
  executeWithServer,
  fixTextSpacing,
  mountWithRouterMock,
  runApolloQuery,
} from '../../helpers';

describe('ProductionCarousel', function () {
  let prodCarouselComponent;
  let bannerProductions;

  beforeEach(async () => {
    await executeWithServer(async (server) => {
      server.create('ProductionNode', {
        name: 'My production without a picture',
        coverImage: server.create('ImageNode', {
          url: 'http://pathto.example/my-image0.png',
        }),
        society: server.create('SocietyNode', { name: 'Dramatic Pause' }),
        start: DateTime.fromISO('2020-11-13'),
        end: DateTime.fromISO('2020-11-14'),
      });
      server.create('ProductionNode', {
        name: 'Upside Down Cake',
        coverImage: server.create('ImageNode', {
          url: 'http://pathto.example/my-image.png',
        }),
        society: server.create('SocietyNode', {
          name: 'Joe Bloggs Productions',
        }),
        start: DateTime.fromISO('2020-11-14'),
        end: DateTime.fromISO('2020-11-18'),
      });
      server.create('ProductionNode', {
        name: 'Legally Ginger',
        coverImage: server.create('ImageNode', {
          url: 'http://pathto.example/my-image2.png',
        }),
        society: server.create('SocietyNode', { name: 'MTB' }),
        start: DateTime.fromISO('2019-11-14'),
        end: DateTime.fromISO('2019-11-18'),
      });

      let { data } = await runApolloQuery({
        query: require('@/graphql/queries/HomeUpcomingProductions.gql'),
      });

      jest.useFakeTimers();
      prodCarouselComponent = await mountWithRouterMock(ProductionCarousel, {
        propsData: {
          bannerProductions: (bannerProductions = data.productions.edges.map(
            (edge) => edge.node
          )),
          autoplay: true,
          pauseOnHover: true,
        },
      });
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('carousel displays correct data', () => {
    it('slide 0', async () => {
      let slide = prodCarouselComponent.findComponent({ ref: 'carousel' });
      expect(slide.text()).to.contain('Dramatic Pause');
      expect(slide.text()).to.contain('My production without a picture');
      expect(fixTextSpacing(slide.text())).to.contain(
        '13 November - 14 November 2020'
      );
      expect(slide.attributes('style')).to.contain(
        'background-image: url(http://pathto.example/my-image0.png)'
      );
      expect(
        prodCarouselComponent
          .findAllComponents(RouterLinkStub)
          .at(0)
          .props('to').name
      ).to.equal('production');
      expect(
        prodCarouselComponent
          .findAllComponents(RouterLinkStub)
          .at(0)
          .props('to').params.productionSlug
      ).to.equal('my-production-without-a-picture');
    });

    it('slide 1', async () => {
      await prodCarouselComponent.setData({
        currentProduction: 1,
      });
      let slide = prodCarouselComponent.findComponent({ ref: 'carousel' });
      expect(slide.text()).to.contain('Joe Bloggs Productions');
      expect(slide.text()).to.contain('Upside Down Cake');
      expect(fixTextSpacing(slide.text())).to.contain(
        '14 November - 18 November 2020'
      );
      expect(slide.attributes('style')).to.contain(
        'background-image: url(http://pathto.example/my-image.png)'
      );
      expect(
        prodCarouselComponent
          .findAllComponents(RouterLinkStub)
          .at(0)
          .props('to').name
      ).to.equal('production');
      expect(
        prodCarouselComponent
          .findAllComponents(RouterLinkStub)
          .at(0)
          .props('to').params.productionSlug
      ).to.equal('upside-down-cake');
    });
  });

  describe('carousel functions as a carousel', () => {
    it('has 3 slides', async () => {
      expect(prodCarouselComponent.findAll('li').length).equals(3);
    });

    it('next button increments slide', async () => {
      let nextButton = prodCarouselComponent.find('#nextBtn');

      nextButton.trigger('click');
      expect(prodCarouselComponent.vm.currentProduction).equals(1);
      nextButton.trigger('click');
      expect(prodCarouselComponent.vm.currentProduction).equals(2);
      nextButton.trigger('click');
      expect(prodCarouselComponent.vm.currentProduction).equals(0);
      nextButton.trigger('click');
      expect(prodCarouselComponent.vm.currentProduction).equals(1);
    });

    it('prev button decrements slide', async () => {
      let prevButton = prodCarouselComponent.find('#prevBtn');
      await prodCarouselComponent.setData({
        currentProduction: 1,
      });

      prevButton.trigger('click');
      expect(prodCarouselComponent.vm.currentProduction).equals(0);
      prevButton.trigger('click');
      expect(prodCarouselComponent.vm.currentProduction).equals(2);
      prevButton.trigger('click');
      expect(prodCarouselComponent.vm.currentProduction).equals(1);
      prevButton.trigger('click');
      expect(prodCarouselComponent.vm.currentProduction).equals(0);
    });

    it('buttons go to correct slide', async () => {
      let buttons = prodCarouselComponent.findAll('.carousel-indicator');

      buttons.at(1).trigger('click');
      expect(prodCarouselComponent.vm.currentProduction).equals(1);
      buttons.at(0).trigger('click');
      expect(prodCarouselComponent.vm.currentProduction).equals(0);
      buttons.at(2).trigger('click');
      expect(prodCarouselComponent.vm.currentProduction).equals(2);
      jest.advanceTimersByTime(5000);
      expect(prodCarouselComponent.vm.currentProduction).equals(0);
    });
  });

  describe('autoplay and pausing functionality', () => {
    it('mouseover pauses autoplay', async () => {
      expect(prodCarouselComponent.vm.autoplayInterval).to.not.equal(null);
      prodCarouselComponent.find('#carousel').trigger('mouseover');
      expect(prodCarouselComponent.vm.autoplayInterval).equals(null);
      prodCarouselComponent.find('#carousel').trigger('mouseout');
      expect(prodCarouselComponent.vm.autoplayInterval).to.not.equal(null);
      jest.advanceTimersByTime(5000);
      expect(prodCarouselComponent.vm.currentProduction).equals(1);
    });
    it('mouseover does nothing when disabed', async () => {
      await prodCarouselComponent.setProps({
        pauseOnHover: false,
      });
      expect(prodCarouselComponent.vm.autoplayInterval).to.not.equal(null);
      prodCarouselComponent.find('#carousel').trigger('mouseover');
      expect(prodCarouselComponent.vm.autoplayInterval).to.not.equal(null);
      prodCarouselComponent.find('#carousel').trigger('mouseout');
      expect(prodCarouselComponent.vm.autoplayInterval).to.not.equal(null);
    });

    it('autoplays after interval', async () => {
      jest.advanceTimersByTime(4000);
      expect(prodCarouselComponent.vm.currentProduction).equals(0);
      jest.advanceTimersByTime(1000);
      expect(prodCarouselComponent.vm.currentProduction).equals(1);
    });

    it('autoplays with non default interval', async () => {
      prodCarouselComponent = await mountWithRouterMock(ProductionCarousel, {
        propsData: {
          bannerProductions: bannerProductions,
          autoplay: true,
          pauseOnHover: true,
          autoplaySpeed: 2000,
        },
      });

      jest.advanceTimersByTime(1000);
      expect(prodCarouselComponent.vm.currentProduction).equals(0);
      jest.advanceTimersByTime(1000);
      expect(prodCarouselComponent.vm.currentProduction).equals(1);
    });

    it('disable autoplay when destroyed', async () => {
      expect(prodCarouselComponent.vm.autoplayInterval).to.not.equal(null);
      prodCarouselComponent.destroy();
      expect(prodCarouselComponent.vm.autoplayInterval).equals(null);
    });
  });

  describe('with no autoplay', () => {
    beforeEach(async () => {
      prodCarouselComponent = await mountWithRouterMock(ProductionCarousel, {
        propsData: {
          bannerProductions: bannerProductions,
          autoplay: false,
          pauseOnHover: true,
        },
      });
    });

    it('doesnt autoplay', async () => {
      expect(prodCarouselComponent.vm.autoplayInterval).equals(null);
    });

    it('mouseover does nothing when no autoplay', async () => {
      expect(prodCarouselComponent.vm.autoplayInterval).equals(null);
      prodCarouselComponent.find('#carousel').trigger('mouseover');
      expect(prodCarouselComponent.vm.autoplayInterval).equals(null);
      prodCarouselComponent.find('#carousel').trigger('mouseout');
      expect(prodCarouselComponent.vm.autoplayInterval).equals(null);
    });
  });

  describe('with only one banner production', () => {
    beforeEach(async () => {
      prodCarouselComponent = await mountWithRouterMock(ProductionCarousel, {
        propsData: {
          bannerProductions: bannerProductions.slice(0, 1),
          autoplay: true,
          pauseOnHover: true,
        },
      });
    });

    it('has no buttons, arrows, or autoplay', async () => {
      expect(prodCarouselComponent.find('#nextBtn').exists()).to.be.false;
      expect(prodCarouselComponent.find('#prevBtn').exists()).to.be.false;
      expect(prodCarouselComponent.find('.carousel-indicator').exists()).to.be
        .false;
      expect(prodCarouselComponent.vm.autoplayInterval).equals(null);
    });
  });
});
