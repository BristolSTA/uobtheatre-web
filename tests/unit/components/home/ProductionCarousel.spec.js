import { RouterLinkStub } from '@vue/test-utils';
import { expect } from 'chai';
import { DateTime } from 'luxon';

import ProductionCarousel from '@/components/home/ProductionCarousel.vue';
import { makeServer } from '@/fakeApi';

import { fixTextSpacing, mountWithRouterMock } from '../../helpers';

describe('ProductionCarousel', function () {
  let prodCarouselComponent;
  let server;
  let bannerProductions;

  beforeEach(async () => {
    server = makeServer({ environment: 'test' });

    bannerProductions = [
      server.create('ProductionNode', {
        name: 'My production without a picture',
        coverImage: server.create('GrapheneImageFieldNode', {
          url: 'http://pathto.example/my-image0.png',
        }),
        society: server.create('SocietyNode', { name: 'Dramatic Pause' }),
        start: DateTime.fromISO('2020-11-13'),
        end: DateTime.fromISO('2020-11-14'),
      }),
      server.create('ProductionNode', {
        name: 'Upside Down Cake',
        coverImage: server.create('GrapheneImageFieldNode', {
          url: 'http://pathto.example/my-image.png',
        }),
        society: server.create('SocietyNode', {
          name: 'Joe Bloggs Productions',
        }),
        start: DateTime.fromISO('2020-11-14'),
        end: DateTime.fromISO('2020-11-18'),
      }),
      server.create('ProductionNode', {
        name: 'Legally Ginger',
        coverImage: server.create('GrapheneImageFieldNode', {
          url: 'http://pathto.example/my-image2.png',
        }),
        society: server.create('SocietyNode', { name: 'MTB' }),
        start: DateTime.fromISO('2019-11-14'),
        end: DateTime.fromISO('2019-11-18'),
      }),
    ];
    prodCarouselComponent = await mountWithRouterMock(ProductionCarousel, {
      propsData: {
        bannerProductions: bannerProductions,
        autoplay: true,
        pauseOnHover: true,
      },
    });
  });
  afterEach(() => {
    server.shutdown();
  });

  describe('carousel displays correct data', () => {
    it('slide 0', async () => {
      await prodCarouselComponent.setData({
        currentProduction: 0,
      });
      let slide = prodCarouselComponent.find('#splashscreen');
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
      let slide = prodCarouselComponent.find('#splashscreen');
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
      expect(prodCarouselComponent.vm.$props.bannerProductions.length).equals(
        3
      );
      expect(prodCarouselComponent.findAll('li').length).equals(3);
    });

    it('next button increments slide', async () => {
      let nextButton = prodCarouselComponent.find('#nextBtn');
      await prodCarouselComponent.setData({
        currentProduction: 0,
      });

      nextButton.trigger('click');
      expect(prodCarouselComponent.vm.$data.currentProduction).equals(1);
      nextButton.trigger('click');
      expect(prodCarouselComponent.vm.$data.currentProduction).equals(2);
      nextButton.trigger('click');
      expect(prodCarouselComponent.vm.$data.currentProduction).equals(0);
      nextButton.trigger('click');
      expect(prodCarouselComponent.vm.$data.currentProduction).equals(1);
      //   expect(prodCarouselComponent.restartAutoplay).to.have.been.called();
    });

    it('prev button decrements slide', async () => {
      let prevButton = prodCarouselComponent.find('#prevBtn');
      await prodCarouselComponent.setData({
        currentProduction: 1,
      });

      prevButton.trigger('click');
      expect(prodCarouselComponent.vm.$data.currentProduction).equals(0);
      prevButton.trigger('click');
      expect(prodCarouselComponent.vm.$data.currentProduction).equals(2);
      prevButton.trigger('click');
      expect(prodCarouselComponent.vm.$data.currentProduction).equals(1);
      prevButton.trigger('click');
      expect(prodCarouselComponent.vm.$data.currentProduction).equals(0);
    });

    it('buttons go to correct slide', async () => {
      let buttons = prodCarouselComponent.findAll('#slideBtn');
      await prodCarouselComponent.setData({
        currentProduction: 0,
      });
      buttons.at(1).trigger('click');
      expect(prodCarouselComponent.vm.$data.currentProduction).equals(1);
      buttons.at(0).trigger('click');
      expect(prodCarouselComponent.vm.$data.currentProduction).equals(0);
      buttons.at(2).trigger('click');
      expect(prodCarouselComponent.vm.$data.currentProduction).equals(2);
    });
  });

  describe('autoplay and pausing functionality', () => {
    it('mouseover pauses autoplay', async () => {
      expect(prodCarouselComponent.vm.$data.autoplayInterval).to.not.equal(
        null
      );
      prodCarouselComponent.find('#carousel').trigger('mouseover');
      expect(prodCarouselComponent.vm.$data.autoplayInterval).equals(null);
      prodCarouselComponent.find('#carousel').trigger('mouseout');
      expect(prodCarouselComponent.vm.$data.autoplayInterval).to.not.equal(
        null
      );
    });
    it('mouseover does nothing when disabed', async () => {
      await prodCarouselComponent.setProps({
        pauseOnHover: false,
      });
      expect(prodCarouselComponent.vm.$data.autoplayInterval).to.not.equal(
        null
      );
      prodCarouselComponent.find('#carousel').trigger('mouseover');
      expect(prodCarouselComponent.vm.$data.autoplayInterval).to.not.equal(
        null
      );
      prodCarouselComponent.find('#carousel').trigger('mouseout');
      expect(prodCarouselComponent.vm.$data.autoplayInterval).to.not.equal(
        null
      );
    });

    // it('autoplays after interval', async () => {
    //   jest.useFakeTimers();
    //   await prodCarouselComponent.setProps({
    //     autoplaySpeed: 600,
    //   });
    //   await prodCarouselComponent.setData({
    //     currentProduction: 0,
    //   });
    //   expect(setInterval).should.have.been.called();
    //   console.log(prodCarouselComponent.vm.$data.currentProduction);
    //   jest.runAllTimers;
    //   console.log(prodCarouselComponent.vm.$data.currentProduction);

    //   expect(prodCarouselComponent.vm.$data.currentProduction).equals(1);
    // });

    it('disable autoplay when destroyed', async () => {
      expect(prodCarouselComponent.vm.$data.autoplayInterval).to.not.equal(
        null
      );
      prodCarouselComponent.destroy();
      expect(prodCarouselComponent.vm.$data.autoplayInterval).equals(null);
    });
  });
});

describe('ProductionCarousel no autoplay', function () {
  let prodCarouselComponent;
  let server;
  let bannerProductions;

  beforeEach(async () => {
    server = makeServer({ environment: 'test' });

    bannerProductions = [
      server.create('ProductionNode', {
        name: 'My production without a picture',
        coverImage: server.create('GrapheneImageFieldNode', {
          url: 'http://pathto.example/my-image0.png',
        }),
        society: server.create('SocietyNode', { name: 'Dramatic Pause' }),
        start: DateTime.fromISO('2020-11-13'),
        end: DateTime.fromISO('2020-11-14'),
      }),
      server.create('ProductionNode', {
        name: 'Upside Down Cake',
        coverImage: server.create('GrapheneImageFieldNode', {
          url: 'http://pathto.example/my-image.png',
        }),
        society: server.create('SocietyNode', {
          name: 'Joe Bloggs Productions',
        }),
        start: DateTime.fromISO('2020-11-14'),
        end: DateTime.fromISO('2020-11-18'),
      }),
    ];
    prodCarouselComponent = await mountWithRouterMock(ProductionCarousel, {
      propsData: {
        bannerProductions: bannerProductions,
        autoplay: false,
        pauseOnHover: true,
      },
    });
  });
  afterEach(() => {
    server.shutdown();
  });

  it('doesnt autoplay', async () => {
    expect(prodCarouselComponent.vm.$data.autoplayInterval).equals(null);
  });

  it('mouseover does nothing when no autoplay', async () => {
    expect(prodCarouselComponent.vm.$data.autoplayInterval).equals(null);
    prodCarouselComponent.find('#carousel').trigger('mouseover');
    expect(prodCarouselComponent.vm.$data.autoplayInterval).equals(null);
    prodCarouselComponent.find('#carousel').trigger('mouseout');
    expect(prodCarouselComponent.vm.$data.autoplayInterval).equals(null);
  });
});
