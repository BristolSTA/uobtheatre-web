import { mount } from '@vue/test-utils';
import { expect } from 'chai';

import { makeServer } from '@/fakeApi';
import Venue from '@/views/venues/Venue.vue';

import {
  createFromFactoryAndSerialize,
  executeWithServer,
  waitFor,
} from '../../helpers';

describe('Venue page', function () {
  let venuePageComponent;
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });

    // Create a venue
    server.create('venue', {
      name: 'Anson Theatre',
      slug: 'anson-theatre',
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
