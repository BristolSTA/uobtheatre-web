import { mount } from '@vue/test-utils';
import { expect } from 'chai';

import { makeServer } from '@/fakeApi';
import Venue from '@/views/venues/Venue.vue';

import { waitFor } from '../../helpers';
import { fixTextSpacing } from '../../helpers.js';

describe('Venue page', function () {
  let venuePageComponent;
  let server;
  let address;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });

    // Create a venue and address
    address = {
      building_name: 'Wills Memorial Building',
      street: 'Queens Road',
      building_number: '69',
      city: 'London',
      postcode: 'BS69 420',
      latitude: '123.4567',
      longitude: '987.654',
    };
    server.create('venue', {
      name: 'Anson Theatre',
      slug: 'anson-theatre',
      description: 'not the anson rooms',
      image: 'http://pathto.example/venue-image.png',
      publicly_listed: true,
      internal_capacity: '420',
      address: address,
    });

    venuePageComponent = mount(Venue, {
      mocks: {
        $route: {
          params: {
            venueSlug: 'anson-theatre',
          },
        },
      },
    });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('starts by showing loading screen', () => {
    expect(venuePageComponent.text()).to.contain('Loading Venue...');
  });

  it('fetches the venue', async () => {
    await waitFor(() => venuePageComponent.vm.venue);
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

    expect(venuePageComponent.find('#venueMap').exists()).to.be.true;
  });

  describe('venue address', () => {
    let addressContainer;
    beforeEach(async () => {
      await waitFor(() => venuePageComponent.vm.venue);
      addressContainer = venuePageComponent.findComponent({ ref: 'address' });
    });

    // building number and name
    it('has the correct address', async () => {
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
            building_name: 'Wills Memorial Building',
            building_number: null,
          }),
        },
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
            building_name: null,
            building_number: '69',
          }),
        },
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
            building_name: null,
            building_number: null,
          }),
        },
      });
      expect(fixTextSpacing(addressContainer.text())).to.contain('Queens Road');
    });
  });

  it('checks map doesnt exist with invalid lat or long', async () => {
    await waitFor(() => venuePageComponent.vm.venue);
    await venuePageComponent.setData({
      venue: { address: { latitude: null } },
    });

    expect(venuePageComponent.find('#venueMap').exists()).to.be.false;
  });

  it('handles invalid venue', async () => {
    let fake404Handler = jest.fn();
    venuePageComponent = mount(Venue, {
      mixins: [
        {
          methods: {
            handle404: fake404Handler,
          },
        },
      ],
      mocks: {
        $route: {
          params: {
            venueSlug: 'anson-theatre-allowed',
          },
        },
      },
    });
    await waitFor(() => fake404Handler.mock.calls.length);
    expect(fake404Handler.mock.calls.length).to.eq(1);
  });
});
