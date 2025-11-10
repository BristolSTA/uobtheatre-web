import { mount } from '#testSupport/helpers';

import siteMessageModal from '@/components/layout/LayoutSiteMessageModal.vue';
import SiteMessage from '../../support/fixtures/SiteMessage';
import { vi } from 'vitest';
import { GenericNodeConnection } from '../../support/helpers/api';

import cookie from 'js-cookie';

describe('Maintenance Banner', () => {
  let siteMessageModalComponent;

  afterEach(() => {
    siteMessageModalComponent = null;
    vi.clearAllMocks();
    vi.resetAllMocks();
    cookie.remove('siteMessagesDismissed');
    cookie.remove('siteMessagesDismissedExpiry');
  });

  it('displays the maintenance banner when it has data', async () => {
    await createWithMessage();
    expect(siteMessageModalComponent.exists()).toBe(true);
    expect(siteMessageModalComponent.text()).toContain(SiteMessage().message);
  });

  it('does not display the maintenance banner when no event exists', async () => {
    siteMessageModalComponent = await mount(siteMessageModal, {
      shallow: false,
      props: {
        location: 'SITEWIDE_MODAL'
      },
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

    expect(siteMessageModalComponent.exists()).toBe(true);
    expect(siteMessageModalComponent.text()).not.toContain(
      SiteMessage().message
    );
  });

  it('does not display the maintenance banner when there are no active events', async () => {
    await createWithoutMessage();

    expect(siteMessageModalComponent.exists()).toBe(true);
    expect(siteMessageModalComponent.text()).not.toContain(
      SiteMessage().message
    );
  });

  describe('maintenance banner component', () => {
    it('displays the correct message', async () => {
      await createWithMessage();

      expect(siteMessageModalComponent.text()).toContain(SiteMessage().message);
    });

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

        const typeMap = siteMessageModalComponent.vm.$data.typeMap;
        // Combine type and if its ongoing (e.g. ongoingMaintenance, upcomingAlert)
        const typeMapType = `${ongoing ? 'ongoing' : 'upcoming'}${type.charAt(0)}${type.slice(1).toLowerCase()}`;

        expect(siteMessageModalComponent.text()).toContain(
          typeMap[typeMapType].titleText
        );
      }
    );

    if (
      ('displays the correct title',
      async () => {
        await createWithMessage({ title: 'Custom Title' });

        expect(siteMessageModalComponent.text()).toContain('Custom Title');
      })
    );

    describe('back button', () => {
      it('displays on non-sitewide dismissal banned modals', async () => {
        await createWithMessage(
          { dismissalPolicy: 'BANNED' },
          false,
          'PRODUCTION_CREATION_MODAL'
        );

        const backButton = siteMessageModalComponent.find(
          '#siteMessageModalBackButton'
        );
        expect(backButton.exists()).toBe(true);
        expect(backButton.text()).toContain('Go Back');
      });

      it('does not display on sitewide modals', async () => {
        await createWithMessage({}, false, 'SITEWIDE_MODAL');

        const backButton = siteMessageModalComponent.find(
          '#siteMessageModalBackButton'
        );
        expect(backButton.exists()).toBe(false);
      });

      it('does not display on non-banned modals', async () => {
        await createWithMessage({}, false, 'PRODUCTION_CREATION_MODAL');

        const backButton = siteMessageModalComponent.find(
          '#siteMessageModalBackButton'
        );
        expect(backButton.exists()).toBe(false);
      });

      it('goes back on the router when clicked', async () => {
        await createWithMessage(
          { dismissalPolicy: 'BANNED' },
          false,
          'PRODUCTION_CREATION_MODAL'
        );

        const backButton = siteMessageModalComponent.find(
          '#siteMessageModalBackButton'
        );
        expect(backButton.exists()).toBe(true);
        await backButton.trigger('click');

        const router = useRouter();
        expect(router.back).toHaveBeenCalled();
      });
    });
  });

  describe('dismissal behaviour', () => {
    let dismissButton;

    const findElements = () => {
      dismissButton = siteMessageModalComponent.find(
        '#siteMessageModalDismiss'
      );
    };

    it('button hidden when dismissal banned', async () => {
      await createWithMessage({ dismissalPolicy: 'BANNED' });

      findElements();
      expect(dismissButton.exists()).toBe(true);
      expect(dismissButton.classes()).toContain('invisible');
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
      expect(siteMessageModalComponent.exists()).toBe(true);
      expect(siteMessageModalComponent.text()).not.toContain(
        SiteMessage().message
      );
    });

    it('appears if a different id is in cookies', async () => {
      vi.spyOn(cookie, 'get').mockReturnValue(SiteMessage().id.toString());
      await createWithMessage({ id: 2 });

      expect(siteMessageModalComponent.exists()).toBe(true);
      expect(siteMessageModalComponent.text()).toContain(SiteMessage().message);
    });
  });

  it('does not show next/prev buttons if only one message', async () => {
    await createWithMessage();

    const nextButton = siteMessageModalComponent.find('#siteMessageModalNext');
    const prevButton = siteMessageModalComponent.find('#siteMessageModalPrev');

    expect(nextButton.exists()).toBe(false);
    expect(prevButton.exists()).toBe(false);
  });

  describe('multiple message handling', () => {
    beforeEach(async () => {
      await createWithMessages([
        SiteMessage(
          {
            displayLocation: 'SITEWIDE_MODAL',
            title: 'Less Important Message Soon'
          },
          false
        ),
        SiteMessage(
          {
            displayLocation: 'SITEWIDE_MODAL',
            title: 'Important Message Now!!'
          },
          true
        )
      ]);
    });

    it('displays ongoing messages before upcoming ones', async () => {
      expect(siteMessageModalComponent.exists()).toBe(true);
      expect(siteMessageModalComponent.text()).toContain(
        'Important Message Now!!'
      );
    });

    it('cycles through messages when next/prev button clicked', async () => {
      const nextButton = siteMessageModalComponent.find(
        '#siteMessageModalNext'
      );
      expect(siteMessageModalComponent.text()).toContain(
        'Important Message Now!!'
      );

      await nextButton.trigger('click');
      expect(siteMessageModalComponent.text()).toContain(
        'Less Important Message Soon'
      );

      const prevButton = siteMessageModalComponent.find(
        '#siteMessageModalPrev'
      );
      await prevButton.trigger('click');
      expect(siteMessageModalComponent.text()).toContain(
        'Important Message Now!!'
      );
    });

    it('hides next button on last message and prev button on first message', async () => {
      const nextButton = siteMessageModalComponent.find(
        '#siteMessageModalNext'
      );
      const prevButton = siteMessageModalComponent.find(
        '#siteMessageModalPrev'
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
      const dismissButton = siteMessageModalComponent.find(
        '#siteMessageModalDismiss'
      );
      expect(siteMessageModalComponent.text()).toContain(
        'Important Message Now!!'
      );

      await dismissButton.trigger('click');
      expect(siteMessageModalComponent.text()).toContain(
        'Less Important Message Soon'
      );
    });

    it('shows the previous message when the final one is dismissed', async () => {
      const dismissButton = siteMessageModalComponent.find(
        '#siteMessageModalDismiss'
      );
      expect(siteMessageModalComponent.text()).toContain(
        'Important Message Now!!'
      );

      const nextButton = siteMessageModalComponent.find(
        '#siteMessageModalNext'
      );

      await nextButton.trigger('click');
      expect(siteMessageModalComponent.text()).toContain(
        'Less Important Message Soon'
      );

      await dismissButton.trigger('click');
      expect(siteMessageModalComponent.text()).toContain(
        'Important Message Now!!'
      );
    });
  });

  /**
   * Asynchronously creates and mounts the siteMessageModal component with a mocked Apollo query.
   *
   * @param {Object} overrides - An object containing properties to override in the SiteMessage.
   * @param {Boolean} ongoing - Whether the message is ongoing.
   * @param {String} location - The display location for the site messages.
   * @returns {Promise<void>} A promise that resolves when the component is mounted.
   *
   * @example
   * await createWithMessage({ message: 'Site is under maintenance' });
   */
  const createWithMessage = async (
    overrides,
    ongoing,
    location = 'SITEWIDE_MODAL'
  ) => {
    siteMessageModalComponent = await mount(siteMessageModal, {
      shallow: false,
      props: {
        location: location
      },
      global: {
        mocks: {
          $apollo: {
            query: vi.fn().mockResolvedValue({
              data: {
                siteMessages: GenericNodeConnection(
                  Array(1).fill(
                    SiteMessage(
                      { displayLocation: location, ...overrides },
                      ongoing
                    )
                  )
                )
              }
            })
          }
        }
      }
    });
  };

  /**
   * Asynchronously creates and mounts the siteMessageModal component with no messages.
   *
   * @returns {Promise<void>} A promise that resolves when the component is mounted.
   * @param {String} location - The display location for the site messages.
   *
   * @example
   * await createWithoutMessage();
   */
  const createWithoutMessage = async (location = 'SITEWIDE_MODAL') => {
    siteMessageModalComponent = await mount(siteMessageModal, {
      shallow: false,
      props: {
        location: location
      },
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

  /**
   * Asynchronously creates and mounts the siteMessageModal component with multiple messages.
   *
   * @param {Array} messages - An array of SiteMessage objects to be used as mock data.
   * @param {String} location - The display location for the site messages.
   * @returns {Promise<void>} A promise that resolves when the component is mounted.
   *
   * @example
   * await createWithMessages([
   *   SiteMessage({ message: 'First message' }),
   *   SiteMessage({ message: 'Second message' })
   * ]);
   */

  const createWithMessages = async (messages, location = 'SITEWIDE_MODAL') => {
    siteMessageModalComponent = await mount(siteMessageModal, {
      shallow: false,
      props: {
        location: location
      },
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
