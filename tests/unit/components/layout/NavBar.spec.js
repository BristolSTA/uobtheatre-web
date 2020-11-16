import { mount } from '@vue/test-utils';
import { expect } from 'chai';
import NavBar from '@/layout/NavBar.vue';

describe('NavBar', () => {
  let navbarComponent;

  beforeEach(() => {
    navbarComponent = mount(NavBar, {
      stubs: ['router-link'],
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

    let links = navbarComponent.findAll('router-link-stub');

    expect(links.length).to.equal(4);

    // Second link should be our "Home" link
    expect(links.at(1).attributes('to')).to.equal('/');
    expect(links.at(1).text()).to.equal('Home');

    // Third link should be our "About Us" link
    expect(links.at(2).attributes('to')).to.equal('/about-us');
    expect(links.at(2).text()).to.equal('About Us');

    // Final link should be our "Login" button
    expect(links.at(3).attributes('to')).to.equal('/login');
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
});
