import { mount } from '@vue/test-utils';
import { expect, vi } from 'vitest';

import Breadcrumbs from '@/components/ui/UiBreadcrumbs.vue';
import { NuxtLinkStub } from '../../stubs';

describe('Breadcrumbs', () => {
  let breadcrumbsComponent;

  beforeEach(async () => {
    vi.stubGlobal('useRoute', () => ({
      fullPath: '/productions/legally-ginger/book'
    }));
    breadcrumbsComponent = await mount(Breadcrumbs, {
      global: {
        stubs: {
          'font-awesome-icon': true,
          NuxtLink: NuxtLinkStub
        }
      },

      props: {
        crumbs: [
          { text: 'Whats On', path: '/productions' },
          {
            text: 'Legally Ginger',
            path: '/productions/legally-ginger'
          },
          { text: 'Book' }
        ]
      }
    });
  });

  it('has 2 chevrons', () => {
    expect(breadcrumbsComponent.findAll('font-awesome-icon-stub')).length(2);
  });

  it('has corrct text', () => {
    expect(breadcrumbsComponent.text()).to.contain('Whats On');
    expect(breadcrumbsComponent.text()).to.contain('Legally Ginger');
    expect(breadcrumbsComponent.text()).to.contain('Book');
  });

  it('has correct links', () => {
    expect(
      breadcrumbsComponent.findAllComponents(NuxtLinkStub).length
    ).to.equal(2);
    expect(
      breadcrumbsComponent.findAllComponents(NuxtLinkStub)[0].attributes('to')
    ).to.equal('/productions');
    expect(
      breadcrumbsComponent.findAllComponents(NuxtLinkStub)[1].attributes('to')
    ).to.equal('/productions/legally-ginger');
  });
});
