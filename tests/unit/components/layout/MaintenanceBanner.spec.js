import { mount } from '@vue/test-utils';

import MaintenanceBanner from '@/components/layout/LayoutMaintenanceBanner.vue';
import SiteMessage from '../../support/fixtures/SiteMessage';
import { vi } from 'vitest';
import { GenericNodeConnection } from '../../support/helpers/api';

describe('Maintenance Banner', () => {
  let maintenanceBannerComponent;

  it('displays the maintenance banner when it has data', async () => {
    await createWithMessage();

    expect(maintenanceBannerComponent.exists()).toBe(true);
    expect(maintenanceBannerComponent.text()).toContain(SiteMessage().message);
  });

  it('does not display the maintenance banner when no event exists', async () => {
    maintenanceBannerComponent = await mount(MaintenanceBanner, {
      shallow: false,
      global: {
        mocks: {
          $apollo: {
            query: vi.fn().mockResolvedValue({
              data: {
                siteMessages: null
              }
            })
          }
        }
      }
    });

    expect(maintenanceBannerComponent.exists()).toBe(true);
    expect(maintenanceBannerComponent.text()).not.toContain(
      SiteMessage().message
    );
  });

  it('does not display the maintenance banner when there are no active events', async () => {
    await createWithMessage({ active: false, toDisplay: false });

    expect(maintenanceBannerComponent.exists()).toBe(true);
    expect(maintenanceBannerComponent.text()).not.toContain(
      SiteMessage().message
    );
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

        const typeMap = maintenanceBannerComponent.vm.$data.typeMap;
        // Combine type and if its ongoing (e.g. ongoingMaintenance, upcomingAlert)
        const typeMapType = `${ongoing ? 'ongoing' : 'upcoming'}${type.charAt(0)}${type.slice(1).toLowerCase()}`;

        const icon = maintenanceBannerComponent.find('#maintenanceBannerIcon');

        expect(icon.attributes('icon')).toBe(typeMap[typeMapType].icon);
      }
    );

    it.each([
      ["'started on' for ongoing messages", 'Started On:', true],
      ["'starting on' for upcomong messages", 'Starting On:', false]
    ])('correctly shows %s', async (testName, expectedText, ongoing) => {
      await createWithMessage({}, ongoing);

      expect(maintenanceBannerComponent.text()).toContain(expectedText);
    });

    it('correctly shows the duration for finite events', async () => {
      await createWithMessage();

      expect(maintenanceBannerComponent.text()).toContain(
        'Expected Duration: 22 hours'
      );
    });

    it("correctly shows 'ongoing' for indefinite events", async () => {
      await createWithMessage({ indefiniteOverride: true });

      expect(maintenanceBannerComponent.text()).toContain('Duration: Ongoing');
    });
  });

  describe('dismissal behaviour', () => {
    let dismissButton;

    const findElements = () => {
      dismissButton = maintenanceBannerComponent.find(
        'button#maintenanceBannerDismiss'
      );
    };

    it('cannot dismiss banner when dismissal banned', async () => {
      await createWithMessage({ dismissalPolicy: 'BANNED' });

      findElements();
      dismissButton.trigger('click');

      expect(maintenanceBannerComponent.vm.$data.preventDismiss).toBe(true);
      expect(
        maintenanceBannerComponent.vm.$data.maintenanceBannerDismissed
      ).toBe(false);
    });

    it('dismissed the banner', async () => {
      await createWithMessage();

      expect(
        maintenanceBannerComponent.vm.$data.maintenanceBannerDismissed
      ).toBe(false);

      findElements();
      dismissButton.trigger('click');

      expect(
        maintenanceBannerComponent.vm.$data.maintenanceBannerDismissed
      ).toBe(true);
      // Order matters here! The cookie is set for the next test
    });

    it('sets cookies, and it does not appear if id in cookies', async () => {
      // Order matters here! The cookie is set in the previous test.
      await createWithMessage({ dismissalPolicy: 'BANNED' });

      expect(maintenanceBannerComponent.exists()).toBe(true);
      expect(maintenanceBannerComponent.text()).not.toContain(
        SiteMessage().message
      );
    });

    it('appears if a different id is in cookies', async () => {
      // Order matters here! The cookie is set in the previous tests.
      await createWithMessage({ id: 2 });

      expect(maintenanceBannerComponent.exists()).toBe(true);
      expect(maintenanceBannerComponent.text()).toContain(
        SiteMessage().message
      );
    });

    afterEach(() => {
      // Clean up the compqonent after each test.
      maintenanceBannerComponent = null;
    });
  });

  /**
   * Asynchronously creates and mounts the MaintenanceBanner component with a mocked Apollo query.
   *
   * @param {Object} overrides - An object containing properties to override in the SiteMessage.
   * @param {Boolean} ongoing - Whether the message is ongoing.
   * @returns {Promise<void>} A promise that resolves when the component is mounted.
   *
   * @example
   * await createWithMessage({ message: 'Site is under maintenance' });
   */
  const createWithMessage = async (overrides, ongoing) => {
    maintenanceBannerComponent = await mount(MaintenanceBanner, {
      shallow: false,
      global: {
        mocks: {
          $apollo: {
            query: vi.fn().mockResolvedValue({
              data: {
                siteMessages: GenericNodeConnection(
                  Array(1).fill(SiteMessage(overrides, ongoing))
                )
              }
            })
          }
        }
      }
    });
  };
});
