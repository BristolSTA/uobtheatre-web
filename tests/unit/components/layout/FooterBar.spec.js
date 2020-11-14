import { mount } from '@vue/test-utils';
import FooterBar from '@/layout/FooterBar.vue';

describe('FooterBar', function () {
  let footerBarComponent;

  beforeEach(() => {
    footerBarComponent = mount(FooterBar, {
      stubs: ['router-link'],
    });
  });

  it('displays our name and current year', () => {
    expect(footerBarComponent.text()).toContain(
      "Bristol Stage Technicians' Association"
    );
    expect(footerBarComponent.text()).toContain(new Date().getFullYear());
  });

  it('displays links correctly', async () => {
    // Set navbar's navigation links manually
    await footerBarComponent.setData({
      navItems: [
        ['/privacy', 'Privacy'],
        ['/terms', 'Terms'],
      ],
    });

    let links = footerBarComponent.findAll('ul router-link-stub');

    expect(links.length).toBe(2);

    // First link should direct to privacy
    expect(links.at(0).attributes('to')).toBe('/privacy');
    expect(links.at(0).text()).toBe('Privacy');

    // Second link should be terms
    expect(links.at(1).attributes('to')).toBe('/terms');
    expect(links.at(1).text()).toBe('Terms');
  });
});
