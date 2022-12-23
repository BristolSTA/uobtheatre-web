import { expect } from 'vitest';

import { fixTextSpacing, mount } from '#testSupport/helpers';
import { GenericApolloResponse } from '#testSupport/helpers/api';

import FakeVenue from '#testSupport/fixtures/Venue';

import Venue from '@/pages/venue/[slug]/index.vue';

describe('Venue page', function () {
  let venuePageComponent;
  let address;

  beforeEach(async () => {
    venuePageComponent = await mount(Venue, {
      apollo: {
        queryResponses: [GenericApolloResponse('venue', FakeVenue())]
      },
      routeInfo: {
        params: {
          slug: 'anson-theatre'
        }
      }
    });
  });

  it('fetches the venue', async () => {
    await venuePageComponent.vm.$nextTick();
    expect(venuePageComponent.vm.venue.name).to.eq('Anson Theatre');
    expect(venuePageComponent.text()).to.contain('Anson Theatre');
    expect(venuePageComponent.text()).to.contain('not the anson rooms');
    expect(fixTextSpacing(venuePageComponent.text())).to.contain(
      'Capacity: Max 420'
    );

    expect(
      venuePageComponent
        .find({
          ref: 'image'
        })
        .attributes('src')
    ).to.equal('http://pathto.example/venue-image.png');

    expect(venuePageComponent.find({ ref: 'venue-map' }).exists()).to.be.true;
  });

  describe('venue address', () => {
    let addressContainer;
    beforeEach(async () => {
      await venuePageComponent.vm.$nextTick();
      addressContainer = venuePageComponent.find({ ref: 'address' });
    });

    // building number and name
    it('has the correct address', () => {
      expect(fixTextSpacing(addressContainer.text())).to.contain(
        'Wills Memorial Building 69 Queens Road'
      );
      expect(addressContainer.text()).to.contain('London');
      expect(addressContainer.text()).to.contain('BS69 420');
    });

    // no building number
    it('has the correct address', async () => {
      await venuePageComponent.setData({
        venue: {
          address: Object.assign({}, address, {
            buildingName: 'Wills Memorial Building',
            buildingNumber: null
          })
        }
      });
      expect(fixTextSpacing(addressContainer.text())).to.contain(
        'Wills Memorial Building Queens Road'
      );
    });

    // no building name
    it('has the correct address', async () => {
      await venuePageComponent.setData({
        venue: {
          address: Object.assign({}, address, {
            buildingName: null,
            buildingNumber: '69'
          })
        }
      });
      expect(fixTextSpacing(addressContainer.text())).to.contain(
        '69 Queens Road'
      );
    });

    // no building name or number
    it('has the correct address', async () => {
      await venuePageComponent.setData({
        venue: {
          address: Object.assign({}, address, {
            buildingName: null,
            buildingNumber: null
          })
        }
      });
      expect(fixTextSpacing(addressContainer.text())).to.contain('Queens Road');
    });
  });

  it('checks map doesnt exist with invalid lat or long', async () => {
    await venuePageComponent.setData({
      venue: { address: { latitude: null } }
    });

    expect(venuePageComponent.find({ ref: 'venue-map' }).exists()).to.be.false;
  });

  it.only('handles invalid venue', async () => {
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

    expect(createError).toHaveBeenCalledWith({
      statusCode: 404,
      message: 'This venue does not exist'
    });
  });
});
