import {
  mount,
  fixTextSpacing,
  setCompositionData
} from '#testSupport/helpers';
import { NuxtLinkStub } from '#testSupport/stubs';
import { expect, vi } from 'vitest';
import useAuthStore from '@/store/auth.ts';

import DropdownNavItem from '@/components/layout/DropdownNavItem.vue';
import NavBar from '@/components/layout/LayoutNavBar.vue';
import ClickableLink from '@/components/ui/ClickableLink.vue';
import { ref } from 'vue';

describe('NavBar', function () {
  let navbarComponent, routerPushFake, logoutFn;

  beforeEach(async () => {
    navbarComponent = await mount(NavBar, {
      shallow: false,
      routeInfo: ref({})
    });
  });

  it('displays the site name', () => {
    expect(navbarComponent.text()).to.contain('UOB Theatre');
  });

  it('correctly shows navigation links', async () => {
    // Set navbar's navigation links manually
    setCompositionData(navbarComponent, {
      navItems: [
        ['/', 'Home'],
        ['/about-us', 'About Us']
      ]
    });

    await navbarComponent.vm.$forceUpdate();

    const links = navbarComponent.findAllComponents(NuxtLinkStub);
    expect(links.length).to.equal(5); // Link on logo, Home, About us, Login and Register in submenu

    // First link should be the link on the sitename
    expect(links.at(0).attributes('to')).to.equal('/');

    // Second link should be our "Home" link
    expect(links.at(1).attributes('to')).to.eq('/');
    expect(links.at(1).text()).to.eq('Home');

    // Third link should be our "About Us" link
    expect(links.at(2).attributes('to')).to.eq('/about-us');
    expect(links.at(2).text()).to.eq('About Us');

    // Fourth link should be our "Login" section in the dropdown
    expect(links.at(3).attributes('to')).to.eq('/login');

    // Final link should be our "Register" section in the dropdown
    expect(links.at(4).attributes('to')).to.eq('/signup');
  });

  it('can toggle the mobile navbar', async () => {
    const navbar = navbarComponent.find('nav');
    const navbarToggle = navbarComponent.find('button[role="toggle"]');

    // Test that it is collapsed by default
    expect(navbarComponent.vm.open).to.be.false;
    expect(navbar.classes()).to.contain('hidden');

    // Test that it can be toggled open
    await navbarToggle.trigger('click');

    expect(navbarComponent.vm.open).to.be.true;
    expect(navbar.classes()).not.to.contain('hidden');

    // Test that it can be toggled closed
    await navbarToggle.trigger('click');

    expect(navbarComponent.vm.open).to.be.false;
    expect(navbar.classes()).to.contain('hidden');
  });

  it('shows login dropdown when not authenticated', () => {
    expect(navbarComponent.text()).to.contain('Hello. Sign in');
    expect(
      navbarComponent
        .findComponent(DropdownNavItem)
        .findComponent(NuxtLinkStub)
        .attributes('to')
    ).to.eq('/login');
    expect(
      navbarComponent
        .findComponent(DropdownNavItem)
        .findAllComponents(NuxtLinkStub)
        .at(1)
        .attributes('to')
    ).to.eq('/signup');
    vi.clearAllMocks();
  });

  it('shows user context bar when authenticated', async () => {
    const store = useAuthStore();
    store.user = { firstName: 'Joe', lastName: 'Bloggs' };
    await navbarComponent.vm.$forceUpdate();

    expect(fixTextSpacing(navbarComponent.text())).to.contain('Hi, Joe');
    expect(navbarComponent.findComponent(DropdownNavItem).text()).to.contain(
      'Your Account'
    );
    expect(navbarComponent.findComponent(DropdownNavItem).text()).to.contain(
      'Your Bookings'
    );

    const logoutButton = navbarComponent.findComponent(ClickableLink);
    expect(logoutButton.text()).to.eq('Log Out');

    await logoutButton.trigger('click');

    expect(store.logout).toHaveBeenCalledOnce();
  });
});
