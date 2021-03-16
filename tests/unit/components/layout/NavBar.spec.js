import { expect } from 'chai';

import DropdownNavItem from '@/components/layout/nav/DropdownNavItem.vue';
import NavBar from '@/components/layout/NavBar.vue';
import ClickableLink from '@/components/ui/ClickableLink.vue';
import { authService } from '@/services';
import store from '@/store';

import {
  fixTextSpacing,
  mountWithRouterMock,
  RouterLinkStub,
} from '../../helpers';

describe('NavBar', function () {
  let navbarComponent, routerPushFake;

  beforeEach(async () => {
    navbarComponent = await mountWithRouterMock(NavBar, {
      store,
      mocks: {
        $route: {},
        $router: {
          push: (routerPushFake = jest.fn()),
        },
      },
    });
  });

  it('displays the site name', () => {
    expect(navbarComponent.text()).to.contain('UOB Theatre');
  });

  it('correctly shows navigation links', async () => {
    // Set navbar's navigation links manually
    await navbarComponent.setData({
      navItems: [
        ['/', 'Home'],
        ['/about-us', 'About Us'],
      ],
    });

    let links = navbarComponent.findAllComponents(RouterLinkStub);
    expect(links.length).to.equal(5); // Link on logo, Home, About us, Login and Register in submenu

    // First link should be the link on the sitename
    expect(links.at(0).props('to').name).to.equal('home');

    // Second link should be our "Home" link
    expect(links.at(1).props('to')).to.eq('/');
    expect(links.at(1).text()).to.eq('Home');

    // Third link should be our "About Us" link
    expect(links.at(2).props('to')).to.eq('/about-us');
    expect(links.at(2).text()).to.eq('About Us');

    // Fourth link should be our "Login" section in the dropdown
    expect(links.at(3).props('to').name).to.eq('login');

    // Final link should be our "Register" section in the dropdown
    expect(links.at(4).props('to').name).to.eq('signup');
  });

  it('can toggle the mobile navbar', async () => {
    let navbar = navbarComponent.find('nav');
    let navbarToggle = navbarComponent.find('button[role="toggle"]');

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
    jest.spyOn(authService, 'isLoggedIn').mockReturnValue(false);
    expect(navbarComponent.text()).to.contain('Hello. Sign in');
    expect(
      navbarComponent
        .findComponent(DropdownNavItem)
        .findComponent(RouterLinkStub)
        .props('to').name
    ).to.eq('login');
    expect(
      navbarComponent
        .findComponent(DropdownNavItem)
        .findAllComponents(RouterLinkStub)
        .at(1)
        .props('to').name
    ).to.eq('signup');
    jest.clearAllMocks();
  });

  it('shows user context bar when authenticated', async () => {
    jest.spyOn(authService, 'isLoggedIn').mockReturnValue(true);
    jest.spyOn(authService, 'logout');
    await navbarComponent.vm.$forceUpdate();

    expect(fixTextSpacing(navbarComponent.text())).to.contain('Hi, Guest');
    expect(navbarComponent.findComponent(DropdownNavItem).text()).to.contain(
      'Your Account'
    );
    expect(navbarComponent.findComponent(DropdownNavItem).text()).to.contain(
      'Your Bookings'
    );

    let logoutButton = navbarComponent.findComponent(ClickableLink);
    expect(logoutButton.text()).to.eq('Log Out');

    await logoutButton.trigger('click');

    expect(authService.logout.mock.calls.length).to.eq(1);
    expect(routerPushFake.mock.calls.length).to.eq(1);
    expect(routerPushFake.mock.calls[0][0].name).to.eq('home'); // Redirects home on logout
    jest.clearAllMocks();
  });
});
