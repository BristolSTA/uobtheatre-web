import { mount, fixTextSpacing } from '#testSupport/helpers';
import { NuxtLinkStub } from '#testSupport/stubs';
import { expect } from 'vitest';
import FooterBar from '@/components/layout/LayoutFooterBar.vue';

describe('FooterBar', function () {
  let footerBarComponent;

  beforeEach(() => {
    footerBarComponent = mount(FooterBar, {
      shallow: false
    });
  });

  it('displays our name and current year', () => {
    expect(fixTextSpacing(footerBarComponent.text())).to.contain(
      `Bristol Stage Technicians' Association ${new Date().getFullYear()}`
    );
  });

  it('displays links correctly', async () => {
    // Set navbar's navigation links manually
    await footerBarComponent.setData({
      navItems: [
        ['/privacy', 'Privacy'],
        ['/terms', 'Terms']
      ]
    });
    const links = footerBarComponent.find('ul').findAllComponents(NuxtLinkStub);

    expect(links.length).to.equal(2);

    // First link should direct to privacy
    expect(links.at(0).attributes('href')).to.equal('/privacy');
    expect(links.at(0).text()).to.equal('Privacy');

    // Second link should be terms
    expect(links.at(1).attributes('href')).to.equal('/terms');
    expect(links.at(1).text()).to.equal('Terms');
  });
});
