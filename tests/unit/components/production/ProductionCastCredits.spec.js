import { mount } from '#testSupport/helpers';
import { expect } from 'vitest';
import { DateTime } from 'luxon';

import Production from '#testSupport/fixtures/Production.js';
import Performance from '#testSupport/fixtures/Performance.js';
import GenericNodeConnection from '#testSupport/fixtures/support/GenericNodeConnection.js';
import CrewMember from '#testSupport/fixtures/CrewMember.js';
import CrewRole from '#testSupport/fixtures/CrewRole.js';
import ProductionTeamMember from '#testSupport/fixtures/ProductionTeamMember.js';
import CastMember from '#testSupport/fixtures/CastMember.js';
import ProductionCastCredits from '@/components/production/ProductionCastCredits.vue';

describe('Production Cast and Credits', function () {
  let castCreditsContainer;

  beforeEach(async () => {
    await createWithPerformances(
      [
        {
          start: DateTime.fromISO('2020-11-14'),
          isInperson: true,
          isOnline: false
        }
      ],
      {
        crew: [
          CrewMember({
            name: 'James E',
            role: CrewRole({ department: { description: 'Lighting' } })
          }),
          CrewMember({
            name: 'Alex T',
            role: CrewRole({ department: { description: 'Lighting' } })
          }),
          CrewMember({
            name: 'Tom S',
            role: CrewRole({ department: { description: 'Sound' } })
          })
        ],
        productionTeam: [
          ProductionTeamMember({ name: 'Joe Bloggs', role: 'Producer' }),
          ProductionTeamMember({
            name: 'Jill Bloggs',
            role: 'Musical Director'
          })
        ],
        cast: [
          CastMember({ name: 'Kit', role: 'Crazy Person' }),
          CastMember({
            name: 'John',
            role: 'Good Guy',
            profilePicture: null
          })
        ]
      }
    );
  });

  it('contains production team', () => {
    expect(castCreditsContainer.text()).to.contain('Production Team');

    expect(castCreditsContainer.text()).to.contain('Producer');
    expect(castCreditsContainer.text()).to.contain('Joe Bloggs');

    expect(castCreditsContainer.text()).to.contain('Musical Director');
    expect(castCreditsContainer.text()).to.contain('Jill Bloggs');
  });

  it('contains crew', () => {
    expect(castCreditsContainer.text()).to.contain('Crew');

    expect(castCreditsContainer.text()).to.contain('Sound');
    expect(castCreditsContainer.text()).to.contain('Tom S');

    expect(castCreditsContainer.text()).to.contain('Lighting');
    expect(castCreditsContainer.text()).to.contain('James E');
    expect(castCreditsContainer.text()).to.contain('Alex T');
  });

  it('contains cast', () => {
    expect(castCreditsContainer.text()).to.contain('Cast');

    const castArray = castCreditsContainer.findAll('.production-cast-member');
    // cast memeber with picture
    expect(castArray.at(0).text()).to.contain('Kit');
    expect(castArray.at(0).text()).to.contain('Crazy Person');

    expect(castArray.at(0).find('img').exists()).to.be.true;
    expect(castArray.at(0).find('img').attributes('src')).to.equal(
      'http://pathto.example/profile-pic.png'
    );

    // cast memebr no picture
    expect(castArray.at(1).text()).to.contain('John');
    expect(castArray.at(1).text()).to.contain('Good Guy');

    expect(castArray.at(1).find('img').exists()).to.be.false;
  });

  afterEach(() => {
    // Clean up the component after each test.
    castCreditsContainer = null;
  });

  const createWithPerformances = async (performances, productionOverrides) => {
    const production = Production(productionOverrides);
    production.performances = GenericNodeConnection(
      performances.map((performance) => Performance(performance))
    );

    castCreditsContainer = await mount(ProductionCastCredits, {
      shallow: false,
      props: {
        production
      }
    });
  };
});
