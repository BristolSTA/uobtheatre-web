import { mount } from '@vue/test-utils';
import MaintenanceBanner from '@/components/layout/LayoutMaintenanceBanner.vue';

describe('Maintenance Banner', () => {
  let maintenanceBannerComponent;

  beforeEach(() => {
    maintenanceBannerComponent = mount(MaintenanceBanner, {
      shallow: false,
      apollo: {
        queryResponses: [
          GenericApolloResponse('maintenance', { maintenance: true })
        ]
      }
    });
  });

  it('displays the maintenance banner', () => {
    expect(maintenanceBannerComponent.text()).toContain('Under maintenance');
  });
});
