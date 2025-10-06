import { expect } from 'vitest';
import { fixTextSpacing, mount } from '#testSupport/helpers';
import {
  GenericApolloResponse,
  GenericNodeConnection
} from '#testSupport/helpers/api';

import FakeVenue from '#testSupport/fixtures/Venue';
import Production from '#testSupport/fixtures/Production';
import FakeAddress from '#testSupport/fixtures/Address';

import VenueAccessibility from '@/pages/venue/[slug]/accessibility.vue';
import { flushPromises } from '@vue/test-utils';

describe('Venue Accessibility page', function () {
  let venuePageComponent;
  let addressContainer;
  let venueInfoContainer;

  async function mountComponent(
    addressChanges = {},
    includeAccessibilityInfo = true,
    overrides = {}
  ) {
    venuePageComponent = await mount(VenueAccessibility, {
      shallow: false,
      global: {
        components: { Index: VenueAccessibility },
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
                ]),
                ...overrides
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
    venueInfoContainer = venuePageComponent.find({ ref: 'venueInfo' });
  }

  beforeEach(async () => {
    await mountComponent();
  });

  it('fetches the venue', async () => {
    expect(venuePageComponent.text()).to.contain('Anson Theatre');
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

    // what3words
    it('shows what3words', async () => {
      await mountComponent();

      expect(venueInfoContainer.text()).to.contain(
        'what3words: ///example.example.example'
      );
    });

    // no what3words
    it('does not show what3words if not present', async () => {
      await mountComponent({
        what3words: null
      });

      expect(venueInfoContainer.text()).to.not.contain('what3words:');
    });
  });

  describe('venue contact details', () => {
    it('has the correct contact details', async () => {
      expect(venueInfoContainer.text()).to.contain('Website:uobtheatre.com');
      expect(venueInfoContainer.text()).to.contain(
        'Contact:support@uobtheatre.com'
      );
    });

    it('does not display contact details if not present', async () => {
      await mountComponent({}, true, {
        website: null,
        email: null
      });

      expect(venueInfoContainer.text()).to.not.contain('Website:');
      expect(venueInfoContainer.text()).to.not.contain('Contact:');
    });
  });

  describe('hidden fields behaviour', () => {
    it('hides what3words when not present', async () => {
      await mountComponent({ what3words: null });
      expect(venueInfoContainer.text()).to.not.contain('what3words:');
    });
  });

  it('displays venue accessibility info', async () => {
    expect(venuePageComponent.text()).to.contain(
      'Wheelchair access available, quiet room'
    );
  });

  it('checks map doesnt exist with invalid lat or long', async () => {
    await mountComponent({
      latitude: null
    });

    expect(venuePageComponent.find('[data-test="map"]').exists()).to.be.false;
  });

  it('handles invalid venue', async () => {
    await expect(async () => {
      await mount(VenueAccessibility, {
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
