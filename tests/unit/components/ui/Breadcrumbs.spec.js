import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { RouterLinkStub } from '@vue/test-utils';
import { expect } from 'chai';

import Breadcrumbs from '@/components/ui/Breadcrumbs.vue';

import { mountWithRouterMock } from '../../helpers';

describe('Breadcrumbs', () => {
  let breadcrumsComponent;

  beforeEach(async () => {
    breadcrumsComponent = await mountWithRouterMock(Breadcrumbs, {
      propsData: {
        crumbs: [
          { text: 'Whats On', route: { name: 'productions' } },
          {
            text: 'Legally Ginger',
            route: {
              name: 'production',
              params: {
                productionSlug: 'legally-ginger',
              },
            },
          },
          { text: 'Book' },
        ],
      },
    });
  });

  it('has 2 chevrons', () => {
    expect(
      breadcrumsComponent.findAllComponents(FontAwesomeIcon).length
    ).to.equal(2);
  });

  it('has corrct text', () => {
    expect(breadcrumsComponent.text()).to.contain('Whats On');
    expect(breadcrumsComponent.text()).to.contain('Legally Ginger');
    expect(breadcrumsComponent.text()).to.contain('Book');
  });

  it('has correct links', async () => {
    expect(
      breadcrumsComponent.findAllComponents(RouterLinkStub).length
    ).to.equal(2);
    expect(
      breadcrumsComponent.findAllComponents(RouterLinkStub).at(0).props('to')
        .name
    ).to.equal('productions');
    expect(
      breadcrumsComponent.findAllComponents(RouterLinkStub).at(1).props('to')
        .name
    ).to.equal('production');
    expect(
      breadcrumsComponent.findAllComponents(RouterLinkStub).at(1).props('to')
        .params.productionSlug
    ).to.equal('legally-ginger');
  });
});
