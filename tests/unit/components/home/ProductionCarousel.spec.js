import { RouterLinkStub } from '@vue/test-utils'
import { expect } from 'chai'

import ProductionCarousel from '@/components/home/ProductionCarousel.vue'

import { fixTextSpacing, mountWithRouterMock } from '../../helpers'
import Production from '../../fixtures/Production'
import Society from '../../fixtures/Society'

describe('ProductionCarousel', function () {
  let prodCarouselComponent
  let bannerProductions

  beforeEach(async () => {
    bannerProductions = [
      Production({
        id: 1,
        name: 'My production without a picture',
        slug: 'my-production-without-a-picture',
        coverImage: {
          url: 'http://pathto.example/my-image0.png',
        },
        society: Society({ name: 'Dramatic Pause', slug: 'dramatic-pause' }),
        start: '2020-11-13T00:00:00.000',
        end: '2020-11-14T00:00:00.000',
      }),
      Production({
        id: 2,
        name: 'Upside Down Cake',
        slug: 'upside-down-cake',
        coverImage: {
          url: 'http://pathto.example/my-image.png',
        },
        society: Society({
          name: 'Joe Bloggs Productions',
          slug: 'joe-bloggs-productions',
        }),
        start: '2020-11-14T00:00:00.000',
        end: '2020-11-18T00:00:00.000',
      }),
      Production({
        id: 3,
        name: 'Legally Ginger',
        coverImage: {
          url: 'http://pathto.example/my-image2.png',
        },
        society: Society({ name: 'MTB', slug: 'mtb' }),
        start: '2019-11-14T00:00:00.000',
        end: '2019-11-18T00:00:00.000',
      }),
    ]

    jest.useFakeTimers()
    prodCarouselComponent = await mountWithRouterMock(ProductionCarousel, {
      propsData: {
        bannerProductions,
        autoplay: true,
        pauseOnHover: true,
      },
    })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('carousel displays correct data', () => {
    it('slide 0', () => {
      const slide = prodCarouselComponent.findComponent({ ref: 'carousel' })
      expect(slide.text()).to.contain('Dramatic Pause')
      expect(slide.text()).to.contain('My production without a picture')
      expect(fixTextSpacing(slide.text())).to.contain(
        '13 November - 14 November 2020'
      )
      expect(slide.attributes('style')).to.contain(
        'background-image: url(http://pathto.example/my-image0.png)'
      )
      expect(
        prodCarouselComponent
          .findAllComponents(RouterLinkStub)
          .at(0)
          .props('to')
      ).to.equal('/production/my-production-without-a-picture')
    })

    it('slide 1', async () => {
      await prodCarouselComponent.setData({
        currentProduction: 1,
      })
      const slide = prodCarouselComponent.findComponent({ ref: 'carousel' })
      expect(slide.text()).to.contain('Joe Bloggs Productions')
      expect(slide.text()).to.contain('Upside Down Cake')
      expect(fixTextSpacing(slide.text())).to.contain(
        '14 November - 18 November 2020'
      )
      expect(slide.attributes('style')).to.contain(
        'background-image: url(http://pathto.example/my-image.png)'
      )
      expect(
        prodCarouselComponent
          .findAllComponents(RouterLinkStub)
          .at(0)
          .props('to')
      ).to.equal('/production/upside-down-cake')
    })
  })

  describe('carousel functions as a carousel', () => {
    it('has 3 slides', () => {
      expect(prodCarouselComponent.findAll('li').length).equals(3)
    })

    it('next button increments slide', () => {
      const nextButton = prodCarouselComponent.find('#nextBtn')

      nextButton.trigger('click')
      expect(prodCarouselComponent.vm.currentProduction).equals(1)
      nextButton.trigger('click')
      expect(prodCarouselComponent.vm.currentProduction).equals(2)
      nextButton.trigger('click')
      expect(prodCarouselComponent.vm.currentProduction).equals(0)
      nextButton.trigger('click')
      expect(prodCarouselComponent.vm.currentProduction).equals(1)
    })

    it('prev button decrements slide', async () => {
      const prevButton = prodCarouselComponent.find('#prevBtn')
      await prodCarouselComponent.setData({
        currentProduction: 1,
      })

      prevButton.trigger('click')
      expect(prodCarouselComponent.vm.currentProduction).equals(0)
      prevButton.trigger('click')
      expect(prodCarouselComponent.vm.currentProduction).equals(2)
      prevButton.trigger('click')
      expect(prodCarouselComponent.vm.currentProduction).equals(1)
      prevButton.trigger('click')
      expect(prodCarouselComponent.vm.currentProduction).equals(0)
    })

    it('buttons go to correct slide', () => {
      const buttons = prodCarouselComponent.findAll('.carousel-indicator')

      buttons.at(1).trigger('click')
      expect(prodCarouselComponent.vm.currentProduction).equals(1)
      buttons.at(0).trigger('click')
      expect(prodCarouselComponent.vm.currentProduction).equals(0)
      buttons.at(2).trigger('click')
      expect(prodCarouselComponent.vm.currentProduction).equals(2)
      jest.advanceTimersByTime(5000)
      expect(prodCarouselComponent.vm.currentProduction).equals(0)
    })
  })

  describe('autoplay and pausing functionality', () => {
    it('mouseover pauses autoplay', () => {
      expect(prodCarouselComponent.vm.autoplayInterval).to.not.equal(null)
      prodCarouselComponent.find('#carousel').trigger('mouseover')
      expect(prodCarouselComponent.vm.autoplayInterval).equals(null)
      prodCarouselComponent.find('#carousel').trigger('mouseout')
      expect(prodCarouselComponent.vm.autoplayInterval).to.not.equal(null)
      jest.advanceTimersByTime(5000)
      expect(prodCarouselComponent.vm.currentProduction).equals(1)
    })
    it('mouseover does nothing when disabed', async () => {
      await prodCarouselComponent.setProps({
        pauseOnHover: false,
      })
      expect(prodCarouselComponent.vm.autoplayInterval).to.not.equal(null)
      prodCarouselComponent.find('#carousel').trigger('mouseover')
      expect(prodCarouselComponent.vm.autoplayInterval).to.not.equal(null)
      prodCarouselComponent.find('#carousel').trigger('mouseout')
      expect(prodCarouselComponent.vm.autoplayInterval).to.not.equal(null)
    })

    it('autoplays after interval', () => {
      jest.advanceTimersByTime(4000)
      expect(prodCarouselComponent.vm.currentProduction).equals(0)
      jest.advanceTimersByTime(1000)
      expect(prodCarouselComponent.vm.currentProduction).equals(1)
    })

    it('autoplays with non default interval', async () => {
      prodCarouselComponent = await mountWithRouterMock(ProductionCarousel, {
        propsData: {
          bannerProductions,
          autoplay: true,
          pauseOnHover: true,
          autoplaySpeed: 2000,
        },
      })

      jest.advanceTimersByTime(1000)
      expect(prodCarouselComponent.vm.currentProduction).equals(0)
      jest.advanceTimersByTime(1000)
      expect(prodCarouselComponent.vm.currentProduction).equals(1)
    })

    it('disable autoplay when destroyed', () => {
      expect(prodCarouselComponent.vm.autoplayInterval).to.not.equal(null)
      prodCarouselComponent.destroy()
      expect(prodCarouselComponent.vm.autoplayInterval).equals(null)
    })
  })

  describe('with no autoplay', () => {
    beforeEach(async () => {
      prodCarouselComponent = await mountWithRouterMock(ProductionCarousel, {
        propsData: {
          bannerProductions,
          autoplay: false,
          pauseOnHover: true,
        },
      })
    })

    it('doesnt autoplay', () => {
      expect(prodCarouselComponent.vm.autoplayInterval).equals(null)
    })

    it('mouseover does nothing when no autoplay', () => {
      expect(prodCarouselComponent.vm.autoplayInterval).equals(null)
      prodCarouselComponent.find('#carousel').trigger('mouseover')
      expect(prodCarouselComponent.vm.autoplayInterval).equals(null)
      prodCarouselComponent.find('#carousel').trigger('mouseout')
      expect(prodCarouselComponent.vm.autoplayInterval).equals(null)
    })
  })

  describe('with only one banner production', () => {
    beforeEach(async () => {
      prodCarouselComponent = await mountWithRouterMock(ProductionCarousel, {
        propsData: {
          bannerProductions: bannerProductions.slice(0, 1),
          autoplay: true,
          pauseOnHover: true,
        },
      })
    })

    it('has no buttons, arrows, or autoplay', () => {
      expect(prodCarouselComponent.find('#nextBtn').exists()).to.be.false
      expect(prodCarouselComponent.find('#prevBtn').exists()).to.be.false
      expect(prodCarouselComponent.find('.carousel-indicator').exists()).to.be
        .false
      expect(prodCarouselComponent.vm.autoplayInterval).equals(null)
    })
  })
})
