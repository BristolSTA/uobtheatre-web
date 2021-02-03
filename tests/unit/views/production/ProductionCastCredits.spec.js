import { mount } from '@vue/test-utils';
import { RouterLinkStub } from '@vue/test-utils';
import { expect } from 'chai';

import ProductionCastCredits from '@/views/production/ProductionCastCredits.vue';

import FakePerformance from '../../fixtures/FakePerformance';
import FakeProduction from '../../fixtures/FakeProduction';
import { fixTextSpacing, generateMountOptions } from '../../helpers.js';

describe('CastCreditsContainer', function () {
  let castCreditsContainer;

  describe('Overview', () => {
    it('shows the correct overview', async () => {
      await createWithPerformances([
        {
          start: Date('2020-11-14'),
          isInperson: true,
          isOnline: false,
        },
      ]);

      // correct descriprion
      expect(castCreditsContainer.text()).to.contain(
        'The description of the show.'
      );

      // correct poster image
      expect(
        castCreditsContainer
          .findComponent({
            ref: 'poster-image',
          })
          .attributes('src')
      ).to.equal('http://pathto.example/poster-image.png');
    });

    it('shows the correct show information', async () => {
      await createWithPerformances([
        {
          start: Date('2020-11-14'),
          isInperson: true,
          isOnline: false,
        },
      ]);

      // correct warnings
      let warnings = castCreditsContainer.findComponent({ ref: 'warnings' });
      expect(warnings.exists()).to.be.true;
      expect(warnings.text()).to.contain('Strobe Lighting');
      expect(warnings.text()).to.contain('Nudity');

      //correct medium for in person
      expect(castCreditsContainer.text()).to.contain('Medium: In Person Only');

      //correct age rating
      expect(castCreditsContainer.findComponent({ ref: 'age-rating' }).exists())
        .to.be.true;
      expect(castCreditsContainer.text()).to.contain('Ages 18+');

      // correct description
      expect(fixTextSpacing(castCreditsContainer.text())).to.contain(
        'A production by Joe Bloggs Productions'
      );

      expect(
        castCreditsContainer.findAllComponents(RouterLinkStub).at(0).props('to')
          .name
      ).to.equal('society');
      expect(
        castCreditsContainer.findAllComponents(RouterLinkStub).at(0).props('to')
          .params.societySlug
      ).to.equal('joe-bloggs-productions');

      // correct facebook link
      let link = castCreditsContainer.findComponent({ ref: 'facebook-link' });
      expect(link.exists()).to.be.true;
      expect(link.attributes('href')).to.eq(
        'https://facebook.com/legally-ginger'
      );
    });

    it('shows the correct medium for online and no show warnings', async () => {
      await createWithPerformances(
        [
          {
            start: Date('2020-11-14'),
            isInperson: false,
            isOnline: true,
          },
        ],
        { warnings: [], ageRating: null, facebookEvent: null }
      );

      // no warnings
      expect(castCreditsContainer.findComponent({ ref: 'warnings' }).exists())
        .to.be.false;

      // no age rating
      expect(castCreditsContainer.findComponent({ ref: 'age-rating' }).exists())
        .to.be.false;

      // no facebook link
      expect(
        castCreditsContainer.findComponent({ ref: 'facebook-link' }).exists()
      ).to.be.false;

      //online only medium
      expect(castCreditsContainer.text()).to.contain('Medium: Online Only');
    });

    it('shows the correct medium for online and in person', async () => {
      await createWithPerformances([
        {
          start: Date('2020-11-14'),
          isInperson: true,
          isOnline: true,
        },
      ]);

      //medium is online and in person
      expect(castCreditsContainer.text()).to.contain(
        'Medium: In Person + Online'
      );
    });

    it('handles having no performances', async () => {
      await createWithPerformances([]);
      expect(castCreditsContainer.text()).not.to.contain('Medium');
    });
  });

  describe('CastAndCredits', () => {
    let castCredits;

    beforeEach(async () => {
      await createWithPerformances([
        {
          start: Date('2020-11-14'),
          isInperson: true,
          isOnline: false,
        },
      ]);
      await castCreditsContainer.setData({ overview: false });

      castCredits = castCreditsContainer.findComponent({
        ref: 'cast-credits',
      });
    });

    it('contains production team', () => {
      expect(castCredits.text()).to.contain('Production Team');

      expect(castCredits.text()).to.contain('Producer');
      expect(castCredits.text()).to.contain('James');

      expect(castCredits.text()).to.contain('Musical Director');
      expect(castCredits.text()).to.contain('Nicole');
    });

    it('contains crew', () => {
      expect(castCredits.text()).to.contain('Crew');

      expect(castCredits.text()).to.contain('Sound');
      expect(castCredits.text()).to.contain('Tom');

      expect(castCredits.text()).to.contain('Lighting');
      expect(castCredits.text()).to.contain('Millie');
    });

    it('contains cast', () => {
      expect(castCredits.text()).to.contain('Cast');

      let castArray = castCreditsContainer.findAll('.production-cast-member');
      // cast memeber with picture
      expect(castArray.at(0).text()).to.contain('Kit');
      expect(castArray.at(0).text()).to.contain('Crazy person');

      expect(castArray.at(0).find('img').exists()).to.be.true;
      expect(castArray.at(0).find('img').attributes('src')).to.equal(
        'http://pathto.example/profile-pic.png'
      );

      // cast memebr no picture
      expect(castArray.at(1).text()).to.contain('Alex T');
      expect(castArray.at(1).text()).to.contain('Good Guy');

      expect(castArray.at(1).find('img').exists()).to.be.false;
    });
  });

  let createWithPerformances = (performances, productionOverrides) => {
    let perfs = [];
    performances.forEach((perf) => {
      perfs.push({
        node: Object.assign(FakePerformance(), perf),
      });
    });

    let production = Object.assign(FakeProduction(), productionOverrides);
    production.performances.edges = perfs;

    castCreditsContainer = mount(
      ProductionCastCredits,
      generateMountOptions(['router'], {
        propsData: {
          production: production,
        },
      })
    );
  };
});
