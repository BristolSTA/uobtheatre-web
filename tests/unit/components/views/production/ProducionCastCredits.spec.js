import { makeServer } from '@/fakeApi';
import { expect } from 'chai';
import ProductionCastCredits from '@/views/production/ProductionCastCredits.vue';

import { mount } from '@vue/test-utils';
import { productionService } from '@/services';
import { fixTextSpacing } from '../../../helpers.js';

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
    let overview;

    beforeEach(() => {
      overview = castCreditsContainer.findComponent({
        ref: 'overview',
      });
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

    it('contains crew ', () => {
      expect(castCredits.text()).to.contain('Crew');

      expect(castCredits.text()).to.contain('Sound');
      expect(castCredits.text()).to.contain('Tom');

      expect(castCredits.text()).to.contain('Lighting');
      expect(castCredits.text()).to.contain('Millie');
    });

    it('contains cast ', () => {
      expect(castCredits.text()).to.contain('Cast');

      expect(castCredits.text()).to.contain('Alex T');
      expect(castCredits.text()).to.contain('Good Guy');

      expect(castCredits.text()).to.contain('Jeff');
      expect(castCredits.text()).to.contain('Bad Guy');
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
          cover_image: 'http://pathto.example/cover-image.png',
          society: server.create('society', {
            name: 'Joe Bloggs Productions',
          }),
          start_date: new Date('2020-11-14'),
          end_date: new Date('2020-11-18'),
          performances: perfs,
          cast: [
            server.create('cast', { name: 'Alex T', role: 'Good Guy' }),
            server.create('cast', { name: 'Jeff', role: 'Bad Guy' }),
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
          productionTeam: [
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
