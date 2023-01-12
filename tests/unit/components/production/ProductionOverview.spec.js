import { mount, fixTextSpacing } from '#testSupport/helpers';
import { expect } from 'vitest';
import { DateTime } from 'luxon';
import Production from '#testSupport/fixtures/Production.js';
import Performance from '#testSupport/fixtures/Performance.js';
import GenericNodeConnection from '#testSupport/fixtures/support/GenericNodeConnection.js';
import ProductionOverview from '@/components/production/ProductionOverview.vue';
import { NuxtLinkStub } from '#testSupport/stubs';

describe('Production Overview', function () {
  let overviewContainer;
  it('shows the correct overview', async () => {
    await createWithPerformances([
      {
        start: DateTime.fromISO('2020-11-14'),
        isInperson: true,
        isOnline: false
      }
    ]);

    // correct descriprion
    expect(overviewContainer.text()).to.contain('The description of the show.');

    // correct poster image
    expect(
      overviewContainer
        .findComponent({
          ref: 'poster-image'
        })
        .attributes('src')
    ).to.equal('http://pathto.example/poster-image.png');
  });

  it('shows the correct show information', async () => {
    await createWithPerformances([
      {
        start: DateTime.fromISO('2020-11-14'),
        isInperson: true,
        isOnline: false
      }
    ]);

    // correct warnings
    const warnings = overviewContainer.find({ ref: 'warnings' });
    expect(warnings.exists()).to.be.true;

    // correct medium for in person
    expect(overviewContainer.text()).to.contain('Medium: In Person Only');

    // correct age rating
    expect(overviewContainer.find({ ref: 'age-rating' }).exists()).to.be.true;
    expect(overviewContainer.text()).to.contain('Ages 18+');

    // correct description
    expect(fixTextSpacing(overviewContainer.text())).to.contain(
      'A production by STA'
    );

    expect(
      overviewContainer.findAllComponents(NuxtLinkStub).at(0).attributes('to')
    ).to.equal('/society/sta');

    // correct facebook link
    const link = overviewContainer.find({ ref: 'facebook-link' });
    expect(link.exists()).to.be.true;
    expect(link.attributes('href')).to.eq(
      'https://facebook.com/legally-ginger'
    );
  });

  it('shows the correct medium for online and no show warnings', async () => {
    await createWithPerformances(
      [
        {
          start: DateTime.fromISO('2020-11-14'),
          isInperson: false,
          isOnline: true
        }
      ],
      {
        __dont_factory: ['contentWarnings'],
        contentWarnings: [],
        ageRating: null,
        facebookEvent: null
      }
    );

    // no warnings
    expect(overviewContainer.find({ ref: 'warnings' }).exists()).to.be.false;

    // no age rating
    expect(overviewContainer.find({ ref: 'age-rating' }).exists()).to.be.false;

    // no facebook link
    expect(overviewContainer.find({ ref: 'facebook-link' }).exists()).to.be
      .false;

    // online only medium
    expect(overviewContainer.text()).to.contain('Medium: Online Only');
  });

  it('shows the correct medium for online and in person', async () => {
    await createWithPerformances([
      {
        start: DateTime.fromISO('2020-11-14'),
        isInperson: true,
        isOnline: true
      }
    ]);

    // medium is online and in person
    expect(overviewContainer.text()).to.contain('Medium: In Person + Online');
  });

  it('handles having no performances', async () => {
    await createWithPerformances([]);
    expect(overviewContainer.text()).not.to.contain('Medium');
  });

  const createWithPerformances = async (performances, productionOverrides) => {
    const production = Production(productionOverrides);
    production.performances = GenericNodeConnection(
      performances.map((performance) => Performance(performance))
    );

    overviewContainer = await mount(ProductionOverview, {
      shallow: false,
      props: {
        production
      }
    });
  };
});
