import { DateTime } from 'luxon';

import ProductionCarousel from '@/components/home/ProductionCarousel.vue';
import { makeServer } from '@/fakeApi';

import { mountWithRouterMock } from '../../helpers';

jest.useFakeTimers();

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

  it('autoplays after interval', async () => {
    jest.useFakeTimers();
    await prodCarouselComponent.setProps({
      autoplaySpeed: 600,
    });
    await prodCarouselComponent.setData({
      currentProduction: 0,
    });
    await prodCarouselComponent.vm.enableAutoPlay();
    console.log(prodCarouselComponent.vm.$data.currentProduction);
    jest.advanceTimersByTime(5000);
    expect(setInterval).toHaveBeenCalled();
    console.log(prodCarouselComponent.vm.$data.currentProduction);
    expect(prodCarouselComponent.vm.$data.currentProduction).toBe(1);
  });
});
