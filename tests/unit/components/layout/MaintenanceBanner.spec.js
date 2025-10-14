import { mount } from '@vue/test-utils';

import MaintenanceBanner from '@/components/layout/LayoutMaintenanceBanner.vue';
import SiteMessage from '../../support/fixtures/SiteMessage';
import { vi } from 'vitest';
import { GenericNodeConnection } from '../../support/helpers/api';

import cookie from 'js-cookie';

describe('Maintenance Banner', () => {
  let maintenanceBannerComponent;

  afterEach(() => {
    maintenanceBannerComponent = null;
    vi.clearAllMocks();
    vi.resetAllMocks();
    cookie.remove('siteMessagesDismissed');
    cookie.remove('siteMessagesDismissedExpiry');
  });

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
    await createWithoutMessage();

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
      // [type, ongoing]
      ['Upcoming Maintenance', 'MAINTENANCE', false],
      ['Ongoing Maintenance', 'MAINTENANCE', true],
      ['Upcoming Information', 'INFORMATION', false],
      ['Ongoing Information', 'INFORMATION', true],
      ['Upcoming Alert', 'ALERT', false],
      ['Ongoing Alert', 'ALERT', true]
    ])(
      'shows fallback title if no title set for %s',
      async (testName, type, ongoing) => {
        // If ongoing is true, date eventStart
        await createWithMessage({ type: type, title: '' }, ongoing);

        const typeMap = maintenanceBannerComponent.vm.$data.typeMap;
        // Combine type and if its ongoing (e.g. ongoingMaintenance, upcomingAlert)
        const typeMapType = `${ongoing ? 'ongoing' : 'upcoming'}${type.charAt(0)}${type.slice(1).toLowerCase()}`;

        expect(maintenanceBannerComponent.text()).toContain(
          typeMap[typeMapType].titleText
        );
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
        '#maintenanceBannerDismiss'
      );
    };

    it('no button rendered when dismissal banned', async () => {
      await createWithMessage({ dismissalPolicy: 'BANNED' });

      findElements();
      expect(dismissButton.exists()).toBe(false);
    });

    it('can dismiss the banner and set a cookie', async () => {
      const setCookieSpy = vi.spyOn(cookie, 'set');
      await createWithMessage();

      findElements();
      dismissButton.trigger('click');

      // Set the cookie with the message ID
      expect(setCookieSpy).toHaveBeenCalledWith(
        'siteMessagesDismissed',
        SiteMessage().id.toString(),
        expect.any(Object)
      );

      // Set the second cookie with the expiry time
      expect(setCookieSpy).toHaveBeenCalledWith(
        'siteMessagesDismissedExpiry',
        expect.any(String),
        expect.any(Object)
      );
    });

    it('does not appear if id in cookies', async () => {
      vi.spyOn(cookie, 'get').mockReturnValue(SiteMessage().id.toString());
      await createWithMessage({ dismissalPolicy: 'BANNED' }, false);

      // The banner still exists, but should not display the message
      expect(maintenanceBannerComponent.exists()).toBe(true);
      expect(maintenanceBannerComponent.text()).not.toContain(
        SiteMessage().message
      );
    });

    it('appears if a different id is in cookies', async () => {
      vi.spyOn(cookie, 'get').mockReturnValue(SiteMessage().id.toString());
      await createWithMessage({ id: 2 });

      expect(maintenanceBannerComponent.exists()).toBe(true);
      expect(maintenanceBannerComponent.text()).toContain(
        SiteMessage().message
      );
    });
  });

  describe('multiple message handling', () => {
    it('displays ongoing messages before upcoming ones', async () => {
      await createWithMessages([
        SiteMessage({ title: 'Less Important Message Soon' }, false),
        SiteMessage({ title: 'Important Message Now!!' }, true)
      ]);

      expect(maintenanceBannerComponent.exists()).toBe(true);
      expect(maintenanceBannerComponent.text()).toContain(
        'Important Message Now!!'
      );
    });

    it('cycles through messages when next/prev button clicked', async () => {
      await createWithMessages([
        SiteMessage({ title: 'Less Important Message Soon' }, false),
        SiteMessage({ title: 'Important Message Now!!' }, true)
      ]);

      const nextButton = maintenanceBannerComponent.find(
        '#maintenanceBannerNext'
      );
      expect(maintenanceBannerComponent.text()).toContain(
        'Important Message Now!!'
      );

      await nextButton.trigger('click');
      expect(maintenanceBannerComponent.text()).toContain(
        'Less Important Message Soon'
      );

      const prevButton = maintenanceBannerComponent.find(
        '#maintenanceBannerPrev'
      );
      await prevButton.trigger('click');
      expect(maintenanceBannerComponent.text()).toContain(
        'Important Message Now!!'
      );
    });

    it('does not show next/prev buttons if only one message', async () => {
      await createWithMessage();

      const nextButton = maintenanceBannerComponent.find(
        '#maintenanceBannerNext'
      );
      const prevButton = maintenanceBannerComponent.find(
        '#maintenanceBannerPrev'
      );

      expect(nextButton.exists()).toBe(false);
      expect(prevButton.exists()).toBe(false);
    });

    it('hides next button on last message and prev button on first message', async () => {
      await createWithMessages([
        SiteMessage({ title: 'Less Important Message Soon' }, false),
        SiteMessage({ title: 'Important Message Now!!' }, true)
      ]);

      const nextButton = maintenanceBannerComponent.find(
        '#maintenanceBannerNext'
      );
      const prevButton = maintenanceBannerComponent.find(
        '#maintenanceBannerPrev'
      );

      // On first message, prev button should be hidden
      expect(prevButton.classes()).toContain('invisible');
      expect(nextButton.classes()).not.toContain('invisible');

      // Go to next message
      await nextButton.trigger('click');

      // On last message, next button should be hidden
      expect(nextButton.classes()).toContain('invisible');
      expect(prevButton.classes()).not.toContain('invisible');
    });

    it('shows the next message when the current one is dismissed', async () => {
      await createWithMessages([
        SiteMessage({ title: 'Less Important Message Soon' }, false),
        SiteMessage({ title: 'Important Message Now!!' }, true)
      ]);

      const dismissButton = maintenanceBannerComponent.find(
        '#maintenanceBannerDismiss'
      );
      expect(maintenanceBannerComponent.text()).toContain(
        'Important Message Now!!'
      );

      await dismissButton.trigger('click');
      expect(maintenanceBannerComponent.text()).toContain(
        'Less Important Message Soon'
      );
    });

    it('shows the previous message when the final one is dismissed', async () => {
      await createWithMessages([
        SiteMessage({ title: 'Less Important Message Soon' }, false),
        SiteMessage({ title: 'Important Message Now!!' }, true)
      ]);

      const dismissButton = maintenanceBannerComponent.find(
        '#maintenanceBannerDismiss'
      );
      expect(maintenanceBannerComponent.text()).toContain(
        'Important Message Now!!'
      );

      const nextButton = maintenanceBannerComponent.find(
        '#maintenanceBannerNext'
      );

      await nextButton.trigger('click');
      expect(maintenanceBannerComponent.text()).toContain(
        'Less Important Message Soon'
      );

      await dismissButton.trigger('click');
      expect(maintenanceBannerComponent.text()).toContain(
        'Important Message Now!!'
      );
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

  /**
   * Asynchronously creates and mounts the MaintenanceBanner component with no messages.
   *
   * @returns {Promise<void>} A promise that resolves when the component is mounted.
   *
   * @example
   * await createWithoutMessage();
   */
  const createWithoutMessage = async () => {
    maintenanceBannerComponent = await mount(MaintenanceBanner, {
      shallow: false,
      global: {
        mocks: {
          $apollo: {
            query: vi.fn().mockResolvedValue({
              data: {
                siteMessages: GenericNodeConnection([])
              }
            })
          }
        }
      }
    });
  };

  const createWithMessages = async (messages) => {
    maintenanceBannerComponent = await mount(MaintenanceBanner, {
      shallow: false,
      global: {
        mocks: {
          $apollo: {
            query: vi.fn().mockResolvedValue({
              data: {
                siteMessages: GenericNodeConnection(messages)
              }
            })
          }
        }
      }
    });
  };
});
