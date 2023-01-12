import { mount, fixTextSpacing } from '#testSupport/helpers';
import { NuxtLinkStub } from '#testSupport/stubs';
import { expect } from 'vitest';

import OverviewBox from '~~/components/ui/UiCard.vue';
import VenueOverview from '@/components/booking/overview/VenueOverview.vue';

import Venue from '#testSupport/fixtures/Venue';

describe('Venue Overview', function () {
  let venueOverviewComponent;

  beforeEach(async () => {
    venueOverviewComponent = await mount(VenueOverview, {
      shallow: false,
      data() {
        return {
          venue: Venue()
        };
      },
      props: {
        venueData: Venue()
      }
    });
  });

  it('starts by showing loading spinner', () => {
    expect(
      venueOverviewComponent.findComponent({ name: 'FontAwesomeIcon' }).exists()
    );
  });

  it('has overview box component', () => {
    expect(venueOverviewComponent.findComponent(OverviewBox).exists()).to.be
      .true;

    expect(venueOverviewComponent.text()).to.contain('Venue');
  });

  describe('correct venue information', () => {
    beforeEach(async () => {
      await venueOverviewComponent.vm.$nextTick();
    });

    it('has working links', () => {
      expect(
        venueOverviewComponent
          .findAllComponents(NuxtLinkStub)
          .at(0)
          .attributes('to')
      ).to.equal('/venue/anson-theatre');
    });

    // building number and name
    it('has the correct address and name', () => {
      expect(venueOverviewComponent.text()).to.contain('Anson Theatre');
      expect(fixTextSpacing(venueOverviewComponent.text())).to.contain(
        'Wills Memorial Building69 Queens Road'
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
            buildingNumber: null
          })
        }
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
            buildingNumber: '69'
          })
        }
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
            buildingNumber: null
          })
        }
      });
      expect(fixTextSpacing(venueOverviewComponent.text())).to.contain(
        'Queens Road'
      );
    });
  });
});
