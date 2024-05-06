import { expect } from 'vitest';

import { fixTextSpacing, mount } from '#testSupport/helpers';
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
    addressChanges = {}
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
            FakeVenue({
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
            })
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
      await mountComponent(
        ({},
        {
          accessibilityInfo: null
        })
      );
      console.log(accessibilityInfoContainer.text());
      expect(accessibilityInfoContainer.text()).to.contain(
        'No accessibility information available for this venue'
      );
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
