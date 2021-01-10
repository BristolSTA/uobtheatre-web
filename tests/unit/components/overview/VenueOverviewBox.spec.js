import { RouterLinkStub } from '@vue/test-utils';
import { expect } from 'chai';

import OverviewBox from '@/components/overview/OverviewBox.vue';
import VenueOverview from '@/components/overview/VenueOverview.vue';
import { makeServer } from '@/fakeApi';

import { mountWithRouterMock, waitFor } from '../../helpers';

describe('Venue page', function () {
  let venueOverviewComponent;
  let server;
  let venue;

  beforeEach(async () => {
    server = makeServer({ environment: 'test' });

    // Create a venue
    venue = server.create('venue', {
      name: 'Anson Theatre',
      slug: 'anson-theatre',
      description: 'not the anson rooms',
      image: 'http://pathto.example/venue-image.png',
      publicly_listed: true,
      internal_capacity: '420',
      address: {
        building_name: 'Wills Memorial Building',
        street: 'Queens Road',
        building_number: '69',
        city: 'London',
        postcode: 'BS69 420',
        latitude: '123.4567',
        longitude: '987.654',
      },
    });

    venueOverviewComponent = await mountWithRouterMock(VenueOverview, {
      propsData: {
        venue_slug: venue.slug,
      },
    });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('starts by showing loading screen', () => {
    expect(venueOverviewComponent.text()).to.contain('Loading Venue...');
  });

  it('has overview box component', async () => {
    await waitFor(() => venueOverviewComponent.vm.venue);

    expect(venueOverviewComponent.findComponent(OverviewBox).exists()).to.be
      .true;

    expect(venueOverviewComponent.text()).to.contain('Venue');
  });

  describe('overview box component', () => {
    let infoBox;
    beforeEach(async () => {
      await waitFor(() => venueOverviewComponent.vm.venue);

      infoBox = venueOverviewComponent.findComponent(OverviewBox);
    });

    it('has working links', async () => {
      expect(
        infoBox.findAllComponents(RouterLinkStub).at(0).props('to').name
      ).to.equal('venue');
      expect(
        infoBox.findAllComponents(RouterLinkStub).at(0).props('to').params
          .venueSlug
      ).to.equal('anson-theatre');
    });

    it('has the correct address and name', async () => {
      expect(infoBox.text()).to.contain('Anson Theatre');
      expect(infoBox.text()).to.contain('Wills Memorial Building');
      expect(infoBox.text()).to.contain('69');
      expect(infoBox.text()).to.contain('Queens Road');
      expect(infoBox.text()).to.contain('London');
      expect(infoBox.text()).to.contain('BS69 420');
    });
  });

  it('handles invalid venue', async () => {
    let fake404Handler = jest.fn();
    venueOverviewComponent = await mountWithRouterMock(VenueOverview, {
      mixins: [
        {
          methods: {
            handle404: fake404Handler,
          },
        },
      ],
      propsData: {
        venue_slug: 'anson-not-theatre',
      },
    });
    await waitFor(() => fake404Handler.mock.calls.length);
    expect(fake404Handler.mock.calls.length).to.eq(1);
  });
});
