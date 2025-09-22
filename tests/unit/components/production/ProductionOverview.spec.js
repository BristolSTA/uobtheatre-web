import { mount, fixTextSpacing } from '#testSupport/helpers';
import { expect } from 'vitest';
import { DateTime } from 'luxon';
import Production from '#testSupport/fixtures/Production.js';
import Performance from '#testSupport/fixtures/Performance.js';
import GenericNodeConnection from '#testSupport/fixtures/support/GenericNodeConnection.js';
import ProductionOverview from '@/components/production/ProductionOverview.vue';
import { NuxtLinkStub } from '#testSupport/stubs';
import ContentWarningsDisplay from '~/components/production/content-warnings/ContentWarningsDisplay.vue';

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
        productionAlert: null,
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

  describe('the production alert', function () {
    it('shows the production alert when there is one', async () => {
      await createWithPerformances([], {
        productionAlert: 'This is an important alert.'
      });
      const productionAlertsBox = overviewContainer.find({
        ref: 'production-alert'
      });
      expect(productionAlertsBox.exists()).to.be.true;
      expect(productionAlertsBox.text()).to.contain(
        'This is an important alert.'
      );
    });

    it('does not show the production alert when there is none', async () => {
      await createWithPerformances([], { productionAlert: null });
      const productionAlertsBox = overviewContainer.find({
        ref: 'production-alert'
      });
      expect(productionAlertsBox.exists()).to.be.false;
    });

    it('shows the production email', async () => {
      await createWithPerformances([], {
        productionAlert: 'Alert',
        contactEmail: 'prodteam@example.com'
      });
      const productionAlertsBox = overviewContainer.find({
        ref: 'production-alert'
      });
      console.log(productionAlertsBox.text());
      expect(productionAlertsBox.text()).to.contain('prodteam@example.com');
    });
  });

  describe('content warnings button', function () {
    it('shows the button if there are warnings', async () => {
      await createWithPerformances([], {
        __dont_factory: ['contentWarnings'],
        contentWarnings: [{ warning: { shortDescription: 'Strobe Lighting' } }]
      });

      const warnings = overviewContainer.find({ ref: 'warnings' });
      expect(warnings.exists()).to.be.true;
    });

    it("doesn't show if there are no warnings", async () => {
      await createWithPerformances([], {
        __dont_factory: ['contentWarnings'],
        contentWarnings: []
      });

      const warnings = overviewContainer.find({ ref: 'warnings' });
      expect(warnings.exists()).to.be.false;
    });

    it('opens the content warning modal', async () => {
      await createWithPerformances([], {
        __dont_factory: ['contentWarnings'],
        contentWarnings: [{ warning: { shortDescription: 'Strobe Lighting' } }]
      });

      await overviewContainer.find({ ref: 'warnings' }).trigger('click');
      const warningsModal = overviewContainer.findComponent(
        ContentWarningsDisplay
      );
      expect(warningsModal.exists()).to.be.true;
    });
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
