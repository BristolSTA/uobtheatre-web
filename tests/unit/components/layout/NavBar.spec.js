import { mount } from '@vue/test-utils';
import NavBar from '@/layout/NavBar.vue';

describe('NavBar', () => {
  let navbarComponent;

  beforeEach(() => {
    navbarComponent = mount(NavBar, {
      stubs: ['router-link'],
    });
  });

  it('displays the site name', () => {
    expect(navbarComponent.text()).toContain('UOB Theatre');
  });

  it('correctly shows navigation links', async () => {
    // Set navbar's navigation links manually
    await navbarComponent.setData({
      navItems: [
        ['/', 'Home'],
        ['/about-us', 'About Us'],
      ],
    });

    let links = navbarComponent.findAll('router-link-stub');

    expect(links.length).toBe(4);

    // First link should direct to home (from the logo/sitename)
    expect(links.at(0).attributes('to')).toBe('/');

    // Second link should be our "Home" link
    expect(links.at(1).attributes('to')).toBe('/');
    expect(links.at(1).text()).toBe('Home');

    // Third link should be our "About Us" link
    expect(links.at(2).attributes('to')).toBe('/about-us');
    expect(links.at(2).text()).toBe('About Us');

    // Final link should be our "Login" button
    expect(links.at(3).attributes('to')).toBe('/login');
    expect(links.at(3).text()).toBe('Login');
  });

  it('can toggle the mobile navbar', async () => {
    let navbar = navbarComponent.findComponent({ ref: 'collapsableNavbar' });
    let navbarToggle = navbarComponent.find('button[role="toggle"]');

    // Test that it is collapsed by default
    expect(navbarComponent.vm.navHidden).toBeTruthy();
    expect(navbar.classes()).toContain('hidden');

    // Test that it can be toggled open
    await navbarToggle.trigger('click');

    expect(navbarComponent.vm.navHidden).toBeFalsy();
    expect(navbar.classes()).not.toContain('hidden');

    // Test that it can be toggled closed
    await navbarToggle.trigger('click');

    expect(navbarComponent.vm.navHidden).toBeTruthy();
    expect(navbar.classes()).toContain('hidden');
  });
});
