import { mount, fixTextSpacing } from '#testSupport/helpers';
import { NuxtLinkStub } from '#testSupport/stubs';
import { expect } from 'vitest';
import { DateTime } from 'luxon';

import Production from '#testSupport/fixtures/Production.js';
import Performance from '#testSupport/fixtures/Performance.js';
import GenericNodeConnection from '#testSupport/fixtures/support/GenericNodeConnection.js';
import ProductionBanner from '@/components/production/ProductionBanner.vue';

describe('ProductionBanner', function () {
  let headerContainer;

  it('shows production details correctly', async () => {
    const venue1 = {
      name: 'The New Vic',
      slug: 'the-new-vic',
      publiclyListed: false
    };
    const venue2 = {
      name: 'The Newer Vic',
      slug: 'the-newer-vic',
      publiclyListed: true
    };
    await createWithPerformances([
      {
        start: DateTime.fromISO('2020-11-14'),
        venue: venue1,
        isInperson: true,
        isOnline: false,
        durationMins: 102
      },
      {
        start: DateTime.fromISO('2020-11-15'),
        venue: venue2,
        isInperson: true,
        isOnline: false,
        durationMins: 112
      }
    ]);

    expect(headerContainer.text()).to.contain('Legally Ginger');
    expect(fixTextSpacing(headerContainer.text())).to.contain('by STA');

    expect(
      headerContainer.findAllComponents(NuxtLinkStub).at(0).attributes('to')
    ).to.equal('/society/sta');

    // test combination of two venues
    expect(fixTextSpacing(headerContainer.text())).to.contain(
      'Live at The New VicandThe Newer Vic'
    );

    expect(
      headerContainer.findAllComponents(NuxtLinkStub).at(1).attributes('to')
    ).to.equal('/venue/the-newer-vic');
    expect(headerContainer.findAllComponents(NuxtLinkStub).length).to.equal(2);

    expect(headerContainer.text()).to.contain('14 Nov - 18 Nov 2020');
    expect(headerContainer.text()).to.contain('1 hour, 42 minutes');
    expect(fixTextSpacing(headerContainer.text())).to.contain(
      'Tickets from £1.20'
    );

    // correct feature image
    expect(
      headerContainer
        .findComponent('[data-test="featured-image"]')
        .attributes('src')
    ).to.equal('http://pathto.example/featured-image.png');

    // correct society image
    expect(
      headerContainer
        .find({
          ref: 'society-image'
        })
        .attributes('src')
    ).to.equal('http://pathto.example/logo-image.png');
  });

  it('shows no society image when none is given', async () => {
    await createWithPerformances([]);
    headerContainer.vm.production.society.logo = null;
    await headerContainer.vm.$forceUpdate();
    expect(
      headerContainer
        .findComponent({
          ref: 'society-image'
        })
        .exists()
    ).to.be.false;
  });

  it('shows online only performances', async () => {
    await createWithPerformances([
      {
        venue: {
          name: 'The New Vic',
          slug: 'the-new-vic',
          publiclyListed: false
        },
        isInperson: false,
        isOnline: true
      },
      {
        venue: {
          name: 'The Newer Vic',
          slug: 'the-newer-vic',
          publiclyListed: true
        },
        isInperson: false,
        isOnline: true
      }
    ]);

    expect(headerContainer.vm.venues).to.be.empty;
    expect(fixTextSpacing(headerContainer.text())).to.contain('View Online');
    expect(headerContainer.findAllComponents(NuxtLinkStub).length).to.equal(1);
  });

  it('shows online and in person performances', async () => {
    await createWithPerformances([
      {
        venue: {
          name: 'The Newer Vic',
          slug: 'the-newer-vic',
          publiclyListed: true
        },
        isInperson: true,
        isOnline: true
      }
    ]);

    // test online and live
    expect(fixTextSpacing(headerContainer.text())).to.contain(
      'Live at The Newer Vic and Online '
    );
    expect(headerContainer.findAllComponents(NuxtLinkStub).length).to.equal(2);
  });

  it('links to the production when prop set', async () => {
    await createWithPerformances([], [], {}, true, true, true);
    expect(
      headerContainer.findAllComponents(NuxtLinkStub).at(0).attributes('to')
    ).to.equal('/production/legally-ginger');
  });

  it('shows venue overflow', async () => {
    await createWithPerformances([
      {
        venue: {
          name: 'The Newer Vic',
          slug: 'the-newer-vic'
        },
        isInperson: true,
        isOnline: true
      },
      {
        start: DateTime.fromISO('2020-11-14'),
        venue: {
          name: 'The New Vic',
          slug: 'the-new-vic'
        },
        isInperson: true,
        isOnline: false
      },
      {
        start: DateTime.fromISO('2020-11-15'),
        venue: {
          name: 'Anson Theatre',
          slug: 'anson-theatre'
        },
        isInperson: true,
        isOnline: false
      },
      {
        start: DateTime.fromISO('2020-11-15'),
        venue: {
          name: 'Pegg Rooms',
          slug: 'pegg-rooms'
        },
        isInperson: true,
        isOnline: false
      },
      {
        start: DateTime.fromISO('2020-11-15'),
        venue: {
          name: 'Winston Rooms',
          slug: 'winston-rooms'
        },
        isInperson: true,
        isOnline: false
      }
    ]);

    // test venue overflow
    expect(fixTextSpacing(headerContainer.text())).to.contain(
      'Live at The Newer VicandThe New VicandAnson Theatre and others and Online'
    );
  });

  it('has tickets button that emits event', async () => {
    await createWithPerformances([
      {
        venue: {
          name: 'The Newer Vic',
          slug: 'the-newer-vic',
          publiclyListed: true
        },
        isInperson: true,
        isOnline: true
      }
    ]);
    await headerContainer.find('button').trigger('click');
    expect(headerContainer.emitted('on-buy-tickets-click').length).to.eq(1);
  });

  // no buy tickets when not bookable
  it('doesnt show buy tickets button when not bookable', async () => {
    await createWithPerformances([{}], [], {
      isBookable: false
    });
    expect(fixTextSpacing(headerContainer.text())).not.to.contain(
      'Tickets from £1.20'
    );
    expect(headerContainer.find('button').exists()).to.be.false;
  });

  it.each([
    [true, 'Get Tickets'],
    [false, 'Buy Tickets']
  ])(
    'shows buy tickets button with correct wording for free tickets',
    async (free, text) => {
      await createWithPerformances([{}], [], {
        minSeatPrice: free ? null : 120
      });
      expect(headerContainer.find('button').text()).to.equal(text);
    }
  );

  it('doesnt show buy tickets button when told to not be present', async () => {
    await createWithPerformances([{}], [], {}, false);
    expect(headerContainer.find('button').exists()).to.be.false;
  });

  it('doesnt show detailed data when told to not show', async () => {
    await createWithPerformances([{}], [], {}, false, false);

    expect(headerContainer.text()).to.contain('Legally Ginger');
    expect(fixTextSpacing(headerContainer.text())).to.contain('by STA');
    expect(headerContainer.text()).to.not.contain('14 Nov - 18 Nov 2020');
    expect(headerContainer.text()).to.not.contain('1 hour, 42 minutes');
    expect(headerContainer.text()).to.not.contain('Tickets from £1.20');
  });

  it.each([null, 10])('shows interval length when able', async (duration) => {
    await createWithPerformances([
      Performance({ intervalDurationMins: duration })
    ]);

    expect(fixTextSpacing(headerContainer.text())).to.contain(
      duration ? '2 hours (inc. interval)' : '2 hours'
    );
  });

  describe('Production Fee Display', function () {
    it('doesnt display fees if none exist', async () => {
      await createWithPerformances([]);

      expect(headerContainer.vm.miscCostsDisplay).to.equal('');
      expect(headerContainer.text()).to.not.contain('(exc. fees)');
    });

    it('doesnt display if tickets are free', async () => {
      await createWithPerformances(
        [{}],
        [
          {
            id: 1,
            name: 'Booking Fee',
            description: 'Supports theatre maintainance and website',
            percentage: 0.05
          }
        ],
        {
          minSeatPrice: null
        }
      );

      expect(headerContainer.text()).to.not.contain('(exc. fees)');
    });

    const feeTestCases = [
      {
        a: [0.05, null],
        b: [null, null],
        expected: '5%',
        testMessage: 'percentage only'
      },
      {
        a: [null, 100],
        b: [null, null],
        expected: '£1',
        testMessage: 'fixed fee only'
      },
      {
        a: [0.05, null],
        b: [null, 100],
        expected: '5% + £1',
        testMessage: 'percentage and fixed fee, handling £s'
      },
      {
        a: [0.1, null],
        b: [null, 25],
        expected: '10% + 25p',
        testMessage: 'percentage and fixed fee, handling pence'
      },
      {
        a: [null, 50],
        b: [0.05, null],
        expected: '5% + 50p',
        testMessage: 'percentage and fixed fee, while order agnostic'
      }
    ];

    it.each(feeTestCases)(
      'calculates correct fee with $testMessage',
      async ({ a, b, expected }) => {
        await createWithPerformances(
          [{}],
          [
            {
              id: 1,
              name: 'Theatre Improvement Levy',
              description: 'Makes the STA stonks',
              percentage: a[0],
              value: a[1]
            },
            {
              id: 2,
              name: 'Booking Fee',
              description: 'Oh no Square charges us money',
              percentage: b[0],
              value: b[1]
            }
          ]
        );

        expect(headerContainer.vm.miscCostsDisplay).to.equal(expected);
        expect(headerContainer.text()).to.contain('(exc. fees)');
      }
    );
  });

  afterEach(() => {
    // Clean up the component after each test.
    headerContainer = null;
  });

  const createWithPerformances = async (
    performances,
    miscCostsData = [],
    productionOverrides,
    showBuyTicketsButton = true,
    showDetailedInfo = true,
    clickableProductionName = false
  ) => {
    const production = Production(productionOverrides);
    production.performances = GenericNodeConnection(
      performances.map((performance) => Performance(performance))
    );

    headerContainer = await mount(ProductionBanner, {
      shallow: false,
      props: {
        production,
        showBuyTicketsButton,
        showDetailedInfo,
        clickableProductionName
      },
      data() {
        return {
          miscCosts: miscCostsData
        };
      }
    });
  };
});
