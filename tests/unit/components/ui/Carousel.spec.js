import { expect } from 'chai';

import { mountWithRouterMock } from '../../helpers';
import Society from '../../fixtures/Society';
import Carousel from '@/components/ui/Carousel.vue';

describe('Carousel', function () {
  let carouselComponent;
  let carouselItems;

  beforeEach(async () => {
    carouselItems = [
      {
        id: 1,
        displayImage: {
          url: 'http://pathto.example/my-image0.png',
        },
        text: {
          name: 'My production without a picture',
          slug: 'my-production-without-a-picture',
          society: Society({ name: 'Dramatic Pause', slug: 'dramatic-pause' }),
          start: '2020-11-13T00:00:00.000',
          end: '2020-11-14T00:00:00.000',
        },
      },
      {
        id: 2,
        displayImage: {
          url: 'http://pathto.example/my-image.png',
        },
        text: {
          name: 'Upside Down Cake',
          slug: 'upside-down-cake',
          society: Society({
            name: 'Joe Bloggs Productions',
            slug: 'joe-bloggs-productions',
          }),
          start: '2020-11-14T00:00:00.000',
          end: '2020-11-18T00:00:00.000',
        },
      },
      {
        id: 3,
        displayImage: {
          url: 'http://pathto.example/my-image2.png',
        },
        text: {
          name: 'Legally Ginger',
          society: Society({ name: 'MTB', slug: 'mtb' }),
          start: '2019-11-14T00:00:00.000',
          end: '2019-11-18T00:00:00.000',
        },
      },
    ];

    jest.useFakeTimers();
    carouselComponent = await mountWithRouterMock(Carousel, {
      propsData: {
        carouselItems,
        autoplay: true,
        pauseOnHover: true,
      },
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('carousel functions as a carousel', () => {
    it('has 3 slides', () => {
      expect(carouselComponent.findAll('li').length).equals(3);
    });

    it('next button increments slide', () => {
      const nextButton = carouselComponent.find('#nextBtn');

      nextButton.trigger('click');
      expect(carouselComponent.vm.currentItem).equals(1);
      nextButton.trigger('click');
      expect(carouselComponent.vm.currentItem).equals(2);
      nextButton.trigger('click');
      expect(carouselComponent.vm.currentItem).equals(0);
      nextButton.trigger('click');
      expect(carouselComponent.vm.currentItem).equals(1);
    });

    it('prev button decrements slide', async () => {
      const prevButton = carouselComponent.find('#prevBtn');
      await carouselComponent.setData({
        currentItem: 1,
      });

      prevButton.trigger('click');
      expect(carouselComponent.vm.currentItem).equals(0);
      prevButton.trigger('click');
      expect(carouselComponent.vm.currentItem).equals(2);
      prevButton.trigger('click');
      expect(carouselComponent.vm.currentItem).equals(1);
      prevButton.trigger('click');
      expect(carouselComponent.vm.currentItem).equals(0);
    });

    it('buttons go to correct slide', () => {
      const buttons = carouselComponent.findAll('.carousel-indicator');

      buttons.at(1).trigger('click');
      expect(carouselComponent.vm.currentItem).equals(1);
      buttons.at(0).trigger('click');
      expect(carouselComponent.vm.currentItem).equals(0);
      buttons.at(2).trigger('click');
      expect(carouselComponent.vm.currentItem).equals(2);
      jest.advanceTimersByTime(5000);
      expect(carouselComponent.vm.currentItem).equals(0);
    });
  });

  describe('autoplay and pausing functionality', () => {
    it('mouseover pauses autoplay', () => {
      expect(carouselComponent.vm.autoplayInterval).to.not.equal(null);
      carouselComponent.find('#carousel').trigger('mouseover');
      expect(carouselComponent.vm.autoplayInterval).equals(null);
      carouselComponent.find('#carousel').trigger('mouseout');
      expect(carouselComponent.vm.autoplayInterval).to.not.equal(null);
      jest.advanceTimersByTime(5000);
      expect(carouselComponent.vm.currentItem).equals(1);
    });
    it('mouseover does nothing when disabed', async () => {
      await carouselComponent.setProps({
        pauseOnHover: false,
      });
      expect(carouselComponent.vm.autoplayInterval).to.not.equal(null);
      carouselComponent.find('#carousel').trigger('mouseover');
      expect(carouselComponent.vm.autoplayInterval).to.not.equal(null);
      carouselComponent.find('#carousel').trigger('mouseout');
      expect(carouselComponent.vm.autoplayInterval).to.not.equal(null);
    });

    it('autoplays after interval', () => {
      jest.advanceTimersByTime(4000);
      expect(carouselComponent.vm.currentItem).equals(0);
      jest.advanceTimersByTime(1000);
      expect(carouselComponent.vm.currentItem).equals(1);
    });

    it('autoplays with non default interval', async () => {
      carouselComponent = await mountWithRouterMock(Carousel, {
        propsData: {
          carouselItems,
          autoplay: true,
          pauseOnHover: true,
          autoplaySpeed: 2000,
        },
      });

      jest.advanceTimersByTime(1000);
      expect(carouselComponent.vm.currentItem).equals(0);
      jest.advanceTimersByTime(1000);
      expect(carouselComponent.vm.currentItem).equals(1);
    });

    it('disable autoplay when destroyed', () => {
      expect(carouselComponent.vm.autoplayInterval).to.not.equal(null);
      carouselComponent.destroy();
      expect(carouselComponent.vm.autoplayInterval).equals(null);
    });
  });

  describe('with no autoplay', () => {
    beforeEach(async () => {
      carouselComponent = await mountWithRouterMock(Carousel, {
        propsData: {
          carouselItems,
          autoplay: false,
          pauseOnHover: true,
        },
      });
    });

    it('doesnt autoplay', () => {
      expect(carouselComponent.vm.autoplayInterval).equals(null);
    });

    it('mouseover does nothing when no autoplay', () => {
      expect(carouselComponent.vm.autoplayInterval).equals(null);
      carouselComponent.find('#carousel').trigger('mouseover');
      expect(carouselComponent.vm.autoplayInterval).equals(null);
      carouselComponent.find('#carousel').trigger('mouseout');
      expect(carouselComponent.vm.autoplayInterval).equals(null);
    });
  });

  describe('with only one banner production', () => {
    beforeEach(async () => {
      carouselComponent = await mountWithRouterMock(Carousel, {
        propsData: {
          carouselItems: carouselItems.slice(0, 1),
          autoplay: true,
          pauseOnHover: true,
        },
      });
    });

    it('has no buttons, arrows, or autoplay', () => {
      expect(carouselComponent.find('#nextBtn').exists()).to.be.false;
      expect(carouselComponent.find('#prevBtn').exists()).to.be.false;
      expect(carouselComponent.find('.carousel-indicator').exists()).to.be
        .false;
      expect(carouselComponent.vm.autoplayInterval).equals(null);
    });
  });
});
