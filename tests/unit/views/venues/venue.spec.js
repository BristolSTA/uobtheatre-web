import { expect } from 'chai';

import { makeServer } from '@/fakeApi';
import Venue from '@/views/venues/Venue.vue';

import { mountWithRouterMock, waitFor } from '../../helpers';

describe('Venue page', function () {
  let venuePageComponent;
  let server;

  beforeEach(async () => {
    server = makeServer({ environment: 'test' });

    // Create a venue
    server.create('VenueNode', {
      name: 'Anson Theatre',
      slug: 'anson-theatre',
      description: 'not the anson rooms',
      image: server.create('GrapheneImageFieldNode', {
        url: 'http://pathto.example/venue-image.png',
      }),
      publiclyListed: true,
      internalCapacity: '420',
      address: server.create('AddressNode', {
        buildingName: 'Wills Memorial Building',
        street: 'Queens Road',
        buildingNumber: '69',
        city: 'London',
        postcode: 'BS69 420',
        latitude: '123.4567',
        longitude: '987.654',
      }),
    });

    venuePageComponent = await mountWithRouterMock(
      Venue,
      {},
      {
        params: {
          venueSlug: 'anson-theatre',
        },
      }
    );
  });

  afterEach(() => {
    server.shutdown();
  });

  it('fetches the venue', async () => {
    expect(venuePageComponent.vm.venue.name).to.eq('Anson Theatre');

    expect(venuePageComponent.text()).to.contain('Anson Theatre');

    expect(venuePageComponent.text()).to.contain('not the anson rooms');

    expect(venuePageComponent.text()).to.contain('Capacity: Max 420');

    expect(
      venuePageComponent
        .findComponent({
          ref: 'image',
        })
        .attributes('src')
    ).to.equal('http://pathto.example/venue-image.png');

    expect(venuePageComponent.findComponent({ ref: 'mapContainer' }).exists())
      .to.be.true;
  });

  describe('venue address', () => {
    let addressContainer;
    beforeEach(async () => {
      await waitFor(() => venuePageComponent.vm.venue);
      addressContainer = venuePageComponent.findComponent({ ref: 'address' });
    });

    it('has the correct address', async () => {
      expect(addressContainer.text()).to.contain('Wills Memorial Building');
      expect(addressContainer.text()).to.contain('69');
      expect(addressContainer.text()).to.contain('Queens Road');
      expect(addressContainer.text()).to.contain('London');
      expect(addressContainer.text()).to.contain('BS69 420');
    });
  });

  it('checks map doesnt exist with invalid lat or long', async () => {
    await venuePageComponent.setData({
      venue: { address: { latitude: null } },
    });

    expect(venuePageComponent.findComponent({ ref: 'mapContainer' }).exists())
      .to.be.false;
  });

  it('handles invalid venue', async () => {
    let fakeRouterNext = jest.fn();
    venuePageComponent = await mountWithRouterMock(
      Venue,
      {},
      {
        params: {
          venueSlug: 'anson-theatre-allowed',
        },
      },
      null,
      fakeRouterNext
    );
    await waitFor(() => fakeRouterNext.mock.calls.length);
    expect(fakeRouterNext.mock.calls.length).to.eq(1);
    expect(fakeRouterNext.mock.calls[0][0]).to.include({ name: '404' });
  });
});
