import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { expect } from 'chai';

import OverviewBox from '@/components/booking/overview/OverviewBox.vue';
import VenueOverview from '@/components/booking/overview/VenueOverview.vue';

import {
  executeWithServer,
  fixTextSpacing,
  generateMountOptions,
  waitFor,
} from '../../../helpers';

describe('Venue Overview', function () {
  let venueOverviewComponent;
  let server;
  let venue;

  beforeEach(async () => {
    // Create a venue and address
    let address = {
      buildingName: 'Wills Memorial Building',
      street: 'Queens Road',
      buildingNumber: '69',
      city: 'London',
      postcode: 'BS69 420',
      latitude: '123.4567',
      longitude: '987.654',
    };

    server = await executeWithServer(async (server) => {
      venue = server.create('venueNode', {
        name: 'Anson Theatre',
        slug: 'anson-theatre',
        description: 'not the anson rooms',
        image: server.create('ImageNode', {
          url: 'http://pathto.example/venue-image.png',
        }),
        publiclyListed: true,
        internalCapacity: '420',
        address: server.create('addressNode', address),
      });

      venueOverviewComponent = mount(
        VenueOverview,
        generateMountOptions(['apollo', 'router'], {
          propsData: {
            venueData: 'anson-theatre',
          },
        })
      );
    }, false);
  });

  afterEach(() => {
    server.shutdown();
  });

  it('skips api call if data object is passed', async () => {
    venueOverviewComponent = mount(
      VenueOverview,
      generateMountOptions(['apollo', 'router'], {
        propsData: {
          venueData: venue,
        },
      })
    );

    await waitFor(() => venueOverviewComponent.vm.venue);
    expect(venueOverviewComponent.text()).to.contain('Anson Theatre');
    expect(fixTextSpacing(venueOverviewComponent.text())).to.contain(
      'Wills Memorial Building 69 Queens Road'
    );
  });

  it('starts by showing loading spinner', () => {
    expect(venueOverviewComponent.findComponent(FontAwesomeIcon).exists());
  });

  it('has overview box component', async () => {
    await waitFor(() => venueOverviewComponent.vm.venue);

    expect(venueOverviewComponent.findComponent(OverviewBox).exists()).to.be
      .true;

    expect(venueOverviewComponent.text()).to.contain('Venue');
  });

  describe('correct venue information', () => {
    beforeEach(async () => {
      await waitFor(() => venueOverviewComponent.vm.venue);
    });

    it('has working links', async () => {
      expect(
        venueOverviewComponent
          .findAllComponents(RouterLinkStub)
          .at(0)
          .props('to').name
      ).to.equal('venue');
      expect(
        venueOverviewComponent
          .findAllComponents(RouterLinkStub)
          .at(0)
          .props('to').params.venueSlug
      ).to.equal('anson-theatre');
    });

    // building number and name
    it('has the correct address and name', async () => {
      expect(venueOverviewComponent.text()).to.contain('Anson Theatre');
      expect(fixTextSpacing(venueOverviewComponent.text())).to.contain(
        'Wills Memorial Building 69 Queens Road'
      );
      expect(venueOverviewComponent.text()).to.contain('London');
      expect(venueOverviewComponent.text()).to.contain('BS69 420');
    });

    // no building number
    it('has the correct address (no building number)', async () => {
      await venueOverviewComponent.setData({
        venue: {
          address: Object.assign({}, venueOverviewComponent.vm.venue.address, {
            buildingName: 'Wills Memorial Building',
            buildingNumber: null,
          }),
        },
      });
      expect(fixTextSpacing(venueOverviewComponent.text())).to.contain(
        'Wills Memorial Building Queens Road'
      );
    });

    // no building name
    it('has the correct address (no building name)', async () => {
      await venueOverviewComponent.setData({
        venue: {
          address: Object.assign({}, venueOverviewComponent.vm.venue.address, {
            buildingName: null,
            buildingNumber: '69',
          }),
        },
      });
      expect(fixTextSpacing(venueOverviewComponent.text())).to.contain(
        '69 Queens Road'
      );
    });

    // no building name or number
    it('has the correct address (no building name or number)', async () => {
      await venueOverviewComponent.setData({
        venue: {
          address: Object.assign({}, venueOverviewComponent.vm.venue.address, {
            buildingName: null,
            buildingNumber: null,
          }),
        },
      });
      expect(fixTextSpacing(venueOverviewComponent.text())).to.contain(
        'Queens Road'
      );
    });
  });
});
