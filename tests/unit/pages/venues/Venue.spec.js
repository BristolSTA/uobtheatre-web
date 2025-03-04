import { expect } from 'vitest';
import { fixTextSpacing, mount } from '#testSupport/helpers';
import { NuxtLinkStub } from '#testSupport/stubs';
import {
  GenericApolloResponse,
  GenericNodeConnection
} from '#testSupport/helpers/api';

import FakeVenue from '#testSupport/fixtures/Venue';
import Production from '#testSupport/fixtures/Production';
import FakeAddress from '#testSupport/fixtures/Address';

import Venue from '@/pages/venue/[slug]/index.vue';
import { flushPromises } from '@vue/test-utils';

describe('Venue page', function () {
  let venuePageComponent;
  let addressContainer;
  let accessibilityInfoContainer;

  async function mountComponent(
    addressChanges = {},
    includeAccessibilityInfo = true
  ) {
    venuePageComponent = await mount(Venue, {
      shallow: false,
      global: {
        components: { Index: Venue },
        stubs: ['UiMap']
      },
      apollo: {
        queryResponses: [
          GenericApolloResponse(
            'venue',
            FakeVenue(
              {
                address: FakeAddress(addressChanges),
                productions: GenericNodeConnection([
                  Production({
                    name: 'Bins',
                    slug: 'bins',
                    isBookable: false,
                    end: '2020-10-18T00:00:00'
                  }),
                  Production({
                    name: 'Centuary',
                    slug: 'centuary',
                    isBookable: false,
                    end: '2019-10-19T00:00:00'
                  })
                ])
              },
              undefined,
              undefined,
              includeAccessibilityInfo
            )
          )
        ]
      },
      routeInfo: {
        params: {
          slug: 'anson-theatre'
        }
      }
    });
    await flushPromises();
    await venuePageComponent.vm.$nextTick();

    addressContainer = venuePageComponent.find('[data-test="address-details"]');
    accessibilityInfoContainer = venuePageComponent.find({
      ref: 'accessibilityInfo'
    });
  }

  beforeEach(async () => {
    await mountComponent();
  });

  it('fetches the venue', async () => {
    expect(venuePageComponent.text()).to.contain('Anson Theatre');
    expect(venuePageComponent.text()).to.contain('not the anson rooms');
    expect(fixTextSpacing(venuePageComponent.text())).to.contain(
      'Capacity:Max 420'
    );

    expect(venuePageComponent.find('[data-test="map"]').exists()).to.be.true;
  });

  describe('venue address', () => {
    // building number and name
    it('has the correct address', async () => {
      await mountComponent();
      expect(fixTextSpacing(addressContainer.text())).to.contain(
        'Wills Memorial Building69 Queens Road'
      );
      expect(addressContainer.text()).to.contain('London');
      expect(addressContainer.text()).to.contain('BS69 420');
    });

    // no building number
    it('has the correct address', async () => {
      await mountComponent({
        buildingName: 'Wills Memorial Building',
        buildingNumber: null
      });
      expect(fixTextSpacing(addressContainer.text())).to.contain(
        'Wills Memorial Building Queens Road'
      );
    });

    // no building name
    it('has the correct address', async () => {
      await mountComponent({
        buildingName: null,
        buildingNumber: '69'
      });

      expect(fixTextSpacing(addressContainer.text())).to.contain(
        '69 Queens Road'
      );
    });

    // no building name or number
    it('has the correct address', async () => {
      await mountComponent({
        buildingName: null,
        buildingNumber: null
      });

      expect(fixTextSpacing(addressContainer.text())).to.contain('Queens Road');
    });
  });

  describe('venue accessibility', () => {
    it('displayes accessibility info', async () => {
      expect(accessibilityInfoContainer.text()).to.contain(
        'Wheelchair access available'
      );
    });

    it('displays default text if no accessibility info present', async () => {
      await mountComponent(undefined, false);
      console.log(accessibilityInfoContainer.text());
      expect(accessibilityInfoContainer.text()).to.contain(
        'No accessibility information has been listed for this venue'
      );
    });
  });

  describe('venue production list', () => {
    let links;
    let table;
    let tableRows;
    beforeEach(() => {
      table = venuePageComponent.find({ ref: 'production-list' });
      tableRows = table.findAll('tr');
      links = table.findAllComponents(NuxtLinkStub);
    });

    it('correct number of productions', () => {
      expect(tableRows.length).to.equal(2);
      expect(links.length).to.equal(2);
    });

    it('table rows have correct text', () => {
      expect(tableRows.at(0).text()).to.contain('Bins');
      expect(tableRows.at(0).text()).to.contain('October 2020');

      expect(tableRows.at(1).text()).to.contain('Centuary');
      expect(tableRows.at(1).text()).to.contain('October 2019');
    });

    it('has correct links', () => {
      expect(links.at(0).attributes('to')).to.equal('/production/bins');
      expect(links.at(1).attributes('to')).to.equal('/production/centuary');
    });
  });

  it('checks map doesnt exist with invalid lat or long', async () => {
    await mountComponent({
      latitude: null
    });

    expect(venuePageComponent.find('[data-test="map"]').exists()).to.be.false;
  });

  it('handles invalid venue', async () => {
    await expect(async () => {
      await mount(Venue, {
        apollo: {
          queryResponses: [GenericApolloResponse('venue')]
        },
        routeInfo: {
          params: {
            slug: 'anson-theatre-allowed'
          }
        }
      });
    }).rejects.toThrowError();

    expect(createError).toHaveBeenCalledOnce();
  });
});
