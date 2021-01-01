import { mount } from '@vue/test-utils';
import { expect } from 'chai';

import { makeServer } from '@/fakeApi';
import { productionService } from '@/services';
import ProductionCastCredits from '@/views/production/ProductionCastCredits.vue';

describe('CastCreditsContainer', function () {
  let castCreditsContainer;
  let server;
  beforeEach(async () => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  describe('Overview', () => {
    it('shows the correct overview', async () => {
      await createWithPerformances([
        {
          start: Date('2020-11-14'),
          venue: server.create('venue'),
          is_inperson: true,
          is_online: false,
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
            ref: 'poster_image',
          })
          .attributes('src')
      ).to.equal('http://pathto.example/poster-image.png');
    });

    it('shows the correct show information', async () => {
      await createWithPerformances([
        {
          start: Date('2020-11-14'),
          venue: server.create('venue'),
          is_inperson: true,
          is_online: false,
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
      expect(castCreditsContainer.findComponent({ ref: 'age_rating' }).exists())
        .to.be.true;
      expect(castCreditsContainer.text()).to.contain('Ages 18+');

      // correct description
      expect(castCreditsContainer.text()).to.contain(
        'A production by Joe Bloggs Productions'
      );

      // correct facebook link
      let link = castCreditsContainer.findComponent({ ref: 'facebook_link' });
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
            venue: server.create('venue'),
            is_inperson: false,
            is_online: true,
          },
        ],
        { warnings: null, age_rating: null, facebook_event: null }
      );

      // no warnings
      expect(castCreditsContainer.findComponent({ ref: 'warnings' }).exists())
        .to.be.false;

      // no age rating
      expect(castCreditsContainer.findComponent({ ref: 'age_rating' }).exists())
        .to.be.false;

      // no facebook link
      expect(
        castCreditsContainer.findComponent({ ref: 'facebook_link' }).exists()
      ).to.be.false;

      //online only medium
      expect(castCreditsContainer.text()).to.contain('Medium: Online Only');
    });

    it('shows the correct medium for online and in person', async () => {
      await createWithPerformances([
        {
          start: Date('2020-11-14'),
          venue: server.create('venue'),
          is_inperson: true,
          is_online: true,
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
          venue: server.create('venue'),
          is_inperson: true,
          is_online: false,
        },
      ]);
      await castCreditsContainer.setData({ overview: false });

      castCredits = castCreditsContainer.findComponent({
        ref: 'cast_credits',
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
      perfs.push(server.create('performance', perf));
    });

    server.create(
      'production',
      Object.assign(
        {
          name: 'Legally Ginger',
          slug: 'legally-ginger',
          poster_image: 'http://pathto.example/poster-image.png',
          society: server.create('society', {
            name: 'Joe Bloggs Productions',
          }),
          performances: perfs,
          facebook_event: 'https://facebook.com/legally-ginger',
          warnings: ['Strobe Lighting', 'Nudity'],
          age_rating: '18',
          description: 'The description of the show.',
          cast: [
            server.create('cast', {
              name: 'Alex T',
              role: 'Good Guy',
              profile_picture: null,
            }),
            server.create('cast', {
              name: 'Kit',
              role: 'Crazy person',
              profile_picture: 'http://pathto.example/profile-pic.png',
            }),
          ],
          crew: [
            server.create('crew', { name: 'Tom', department: 'Sound' }),
            server.create('crew', { name: 'Millie', department: 'Lighting' }),
          ],
          production_team: [
            server.create('productionTeam', {
              name: 'James',
              role: 'Producer',
            }),
            server.create('productionTeam', {
              name: 'Nicole',
              role: 'Musical Director',
            }),
          ],
        },
        productionOverrides
      )
    );

    return productionService
      .fetchProductionBySlug('legally-ginger')
      .then((production) => {
        castCreditsContainer = mount(ProductionCastCredits, {
          propsData: {
            production: production,
          },
        });
      });
  };
});
