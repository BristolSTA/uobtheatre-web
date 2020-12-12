import { expect } from 'chai';

import NavBar from '@/components/layout/NavBar.vue';
import ClickableLink from '@/components/ui/ClickableLink.vue';
import { authService } from '@/services';
import store from '@/store';

import { mountWithRouterMock, RouterLinkStub } from '../../helpers';

describe('NavBar', function () {
  let navbarComponent;

  beforeEach(() => {
    navbarComponent = mountWithRouterMock(NavBar, {
      store,
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
    expect(links.length).to.equal(4); // Link on logo, Home, About us and Login button

    // Second link should be our "Home" link
    expect(links.at(1).props('to')).to.equal('/');
    expect(links.at(1).text()).to.equal('Home');

    // Third link should be our "About Us" link
    expect(links.at(2).props('to')).to.equal('/about-us');
    expect(links.at(2).text()).to.equal('About Us');

    // Final link should be our "Login" button
    expect(links.at(3).props('to').name).to.equal('login');
    expect(links.at(3).text()).to.equal('Login');
  });

  it('can toggle the mobile navbar', async () => {
    let navbar = navbarComponent.findComponent({ ref: 'collapsableNavbar' });
    let navbarToggle = navbarComponent.find('button[role="toggle"]');

    // Test that it is collapsed by default
    expect(navbarComponent.vm.navHidden).to.be.true;
    expect(navbar.classes()).to.contain('hidden');

    // Test that it can be toggled open
    await navbarToggle.trigger('click');

    expect(navbarComponent.vm.navHidden).to.be.false;
    expect(navbar.classes()).not.to.contain('hidden');

    // Test that it can be toggled closed
    await navbarToggle.trigger('click');

    expect(navbarComponent.vm.navHidden).to.be.true;
    expect(navbar.classes()).to.contain('hidden');
  });

  it('shows login or logout button and does correct actions', async () => {
    jest.spyOn(authService, 'isLoggedIn').mockReturnValue(false);
    let links = () => navbarComponent.findAllComponents(RouterLinkStub);
    let logInButton = links().at(links().length - 1);

    expect(logInButton.text()).to.eq('Login');
    expect(logInButton.props('to').name).to.eq('login');

    authService.isLoggedIn.mockReturnValue(true);
    jest.spyOn(authService, 'logout');
    await navbarComponent.vm.$nextTick();
    let logoutButton = navbarComponent.findComponent(ClickableLink);

    expect(logoutButton.text()).to.eq('Log Out');

    await logoutButton.trigger('click');

    expect(authService.logout.mock.calls.length).to.eq(1);

    jest.clearAllMocks();
  });
});
