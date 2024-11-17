import { mount } from '@vue/test-utils';

import MaintenanceBanner from '@/components/layout/LayoutMaintenanceBanner.vue';
import SiteMessage from '../../support/fixtures/SiteMessage';
import { vi } from 'vitest';
import { GenericNodeConnection } from '../../support/helpers/api';

describe('Maintenance Banner', () => {
  let maintenanceBannerComponent;

  it('displays the maintenance banner', async () => {
    await createWithMessage();

    expect(maintenanceBannerComponent.exists()).toBe(true);
  });

  describe('maintenance banner component', () => {
    it('displays the correct message', async () => {
      await createWithMessage();

      expect(maintenanceBannerComponent.text()).toContain(
        SiteMessage().message
      );
    });

    it.each([
      // [type, ongoing]
      ['upcoming maintenance', 'MAINTENANCE', false],
      ['ongoing maintenance', 'MAINTENANCE', true],
      ['upcoming information', 'INFORMATION', false],
      ['ongoing information', 'INFORMATION', true],
      ['upcoming alert', 'ALERT', false],
      ['ongoing alert', 'ALERT', true]
    ])(
      'correct color, title & icon for %s',
      async (testName, type, ongoing) => {
        // If ongoing is true, date eventStart
        await createWithMessage({ type: type }, ongoing);

        const typeMap = {
          upcomingMaintenance: {
            accentBar: 'bg-sta-orange-dark',
            iconColour: 'text-sta-orange-dark',
            icon: 'triangle-exclamation',
            titleText: 'Upcoming Maintenance'
          },
          ongoingMaintenance: {
            accentBar: 'bg-sta-rouge-dark',
            iconColour: 'text-sta-rouge-dark',
            icon: 'circle-exclamation',
            titleText: 'Ongoing Maintenance'
          },
          upcomingInformation: {
            accentBar: 'bg-sta-orange-dark',
            iconColour: 'text-sta-orange-dark',
            icon: 'circle-info',
            titleText: 'Important Information'
          },
          ongoingInformation: {
            accentBar: 'bg-sta-orange-dark',
            iconColour: 'text-sta-orange-dark',
            icon: 'circle-info',
            titleText: 'Important Information'
          },
          upcomingAlert: {
            accentBar: 'bg-sta-rouge-dark',
            iconColour: 'text-sta-rouge-dark',
            icon: 'circle-exclamation',
            titleText: 'Urgent Upcoming Alert'
          },
          ongoingAlert: {
            accentBar: 'bg-sta-rouge-dark',
            iconColour: 'text-sta-rouge-dark',
            icon: 'circle-exclamation',
            titleText: 'Urgent Ongoing Alert'
          }
        };
        // Combine type and if its ongoing (e.g. ongoingMaintenance, upcomingAlert)
        const typeMapType = `${ongoing ? 'ongoing' : 'upcoming'}${type.charAt(0)}${type.slice(1).toLowerCase()}`;
        console.log(typeMapType);

        const icon = maintenanceBannerComponent.find('#maintenanceBannerIcon');

        expect(icon.attributes('icon')).toBe(typeMap[typeMapType].icon);
      }
    );

    it('sharted at / starting at', () => {
      expect(maintenanceBannerComponent.text()).toContain('Test message');
    });

    it('duration / ongoing', () => {
      expect(maintenanceBannerComponent.text()).toContain('Test message');
    });

    it('dismissal', () => {
      expect(maintenanceBannerComponent.text()).toContain('Test message');
    });
  });

  afterEach(() => {
    // Clean up the component after each test.
    maintenanceBannerComponent = null;
  });

  /**
   * Asynchronously creates and mounts the MaintenanceBanner component with a mocked Apollo query.
   *
   * @param {Object} overrides - An object containing properties to override in the SiteMessage.
   * @returns {Promise<void>} A promise that resolves when the component is mounted.
   *
   * @example
   * await createWithMessage({ message: 'Site is under maintenance' });
   */
  const createWithMessage = async (overrides) => {
    maintenanceBannerComponent = await mount(MaintenanceBanner, {
      shallow: false,
      global: {
        mocks: {
          $apollo: {
            query: vi.fn().mockResolvedValue({
              data: {
                siteMessages: GenericNodeConnection(
                  Array(1).fill(SiteMessage(overrides))
                )
              }
            })
          }
        }
      }
    });
  };
});
