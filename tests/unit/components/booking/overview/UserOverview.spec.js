import { mount, fixTextSpacing } from '#testSupport/helpers';
import { expect } from 'vitest';

import UserOverview from '@/components/booking/overview/UserOverview.vue';

describe('User Overview', () => {
  let userOverviewComponent;

  beforeEach(async () => {
    userOverviewComponent = await mount(UserOverview, {
      shallow: false,
      pinia: {
        initialState: {
          auth: {
            user: {
              firstName: 'Joe',
              lastName: 'Bloggs',
              email: 'joe.bloggs@example.org'
            }
          }
        }
      }
    });
  });

  it('shows users details from pinia', () => {
    expect(fixTextSpacing(userOverviewComponent.text())).to.contain(
      'Joe Bloggs'
    );
    expect(fixTextSpacing(userOverviewComponent.text())).to.contain(
      'joe.bloggs@example.org'
    );
  });
});
