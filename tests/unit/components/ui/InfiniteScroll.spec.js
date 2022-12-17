import { flushPromises } from '@vue/test-utils';
import { mount } from '#testSupport/helpers';
import { expect, vi } from 'vitest';

import InfiniteScroll from '@/components/ui/InfiniteScroll.vue';

vi.mock('@/utils/misc.js', () => ({
  isInViewport: vi.fn(() => false)
}));

describe('Infinite Scroll', () => {
  let infiniteScrollComponent, apolloQueryMock, promiseResolve;
  const fakeQuery = {
    some: 'GQL Tag query'
  };
  vi.spyOn(window, 'addEventListener');
  vi.spyOn(window, 'removeEventListener');

  beforeEach(() => {
    // Reset mocks
    window.addEventListener.mockClear();
    window.removeEventListener.mockClear();
    infiniteScrollComponent = mount(InfiniteScroll, {
      apollo: {
        queryMockFn: (apolloQueryMock = vi.fn(
          () =>
            new Promise((resolve) => {
              promiseResolve = resolve;
            })
        ))
      },
      props: {
        apolloQuery: fakeQuery
      }
    });
  });

  it('registers scroll callback on mount', () => {
    expect(window.addEventListener.mock.calls[0][0]).to.eq('scroll');
    expect(window.addEventListener.mock.calls[0][1]).to.eq(
      infiniteScrollComponent.vm.handleScroll
    );
  });

  it('removes scroll callback on destory', () => {
    infiniteScrollComponent.unmount();
    expect(window.removeEventListener.mock.calls[0][0]).to.eq('scroll');
    expect(window.removeEventListener.mock.calls[0][1]).to.eq(
      infiniteScrollComponent.vm.handleScroll
    );
  });

  it('has loader at start', () => {
    expect(
      infiniteScrollComponent.find('[data-test="bottom-loader"]').exists()
    );
  });

  it('runs first page query on mount and emits events (no next page)', async () => {
    // Should be loading
    expect(infiniteScrollComponent.emitted('loadingChange').length).to.eq(1);
    expect(infiniteScrollComponent.emitted('loadingChange')[0][0]).to.be.true;

    expect(apolloQueryMock.mock.calls).length(1);
    expect(apolloQueryMock.mock.calls[0][0].query).toEqual(fakeQuery);
    expect(apolloQueryMock.mock.calls[0][0].variables).to.include({
      afterCursor: null
    });

    // Resolve the query
    const result = {
      data: {
        queryName: {
          pageInfo: {
            endCursor: null,
            hasNextPage: false
          }
        }
      }
    };
    promiseResolve(result);
    await flushPromises();

    // Shouldnt be loading anymore
    expect(infiniteScrollComponent.emitted('loadingChange').length).to.eq(2);
    expect(infiniteScrollComponent.emitted('loadingChange')[1][0]).to.be.false;

    // The inner query data should be returned
    expect(infiniteScrollComponent.emitted('newData').length).to.eq(1);
    expect(infiniteScrollComponent.emitted('newData')[0][0]).to.eq(
      result.data.queryName
    );

    expect(infiniteScrollComponent.find('[data-test="bottom-loader"]').exists())
      .to.be.false;
  });

  it('runs first page query on mount and emits events (next page)', async () => {
    // Resolve the query
    const result = {
      data: {
        queryName: {
          pageInfo: {
            endCursor: 'abcdefg',
            hasNextPage: true
          }
        }
      }
    };
    promiseResolve(result);
    await flushPromises();

    // Shouldnt be loading anymore
    expect(infiniteScrollComponent.emitted('loadingChange').length).to.eq(2);
    expect(infiniteScrollComponent.emitted('loadingChange')[1][0]).to.be.false;

    // The inner query data should be returned
    expect(infiniteScrollComponent.emitted('newData').length).to.eq(1);
    expect(infiniteScrollComponent.emitted('newData')[0][0]).to.eq(
      result.data.queryName
    );

    expect(infiniteScrollComponent.find('[data-test="bottom-loader"]').exists())
      .to.be.true;
  });

  it('runs query with next cursor when loader scrolled into view', async () => {
    // Resolve the query
    const result = {
      data: {
        queryName: {
          pageInfo: {
            endCursor: 'abcdefg',
            hasNextPage: true
          }
        }
      }
    };
    promiseResolve(result);
    await flushPromises();

    apolloQueryMock.mockClear();
    expect(infiniteScrollComponent.find('[data-test="bottom-loader"]').exists())
      .to.be.true;

    // Set the bottom loader to have a mock pixel height of 800
    Object.defineProperty(
      infiniteScrollComponent.vm.$refs['bottom-loader'],
      'offsetTop',
      {
        writable: false,
        value: 800
      }
    );

    // Expecting not to trigger the fetch routine (loader @ 800px, bottom of browser @ 768px)
    infiniteScrollComponent.vm.handleScroll();
    expect(apolloQueryMock.mock.calls).length(0);

    // Should trigger fetch (loader @ 800px, bottom of browser @ 1000px)
    window.scrollY = 1000 - 768;

    infiniteScrollComponent.vm.handleScroll();
    expect(apolloQueryMock.mock.calls).length(1);
    expect(apolloQueryMock.mock.calls[0][0].query).toEqual(fakeQuery);
    expect(apolloQueryMock.mock.calls[0][0].variables).to.include({
      afterCursor: 'abcdefg'
    });

    result.data.queryName.pageInfo.hasNextPage = false;
    promiseResolve(result);

    await flushPromises();

    expect(infiniteScrollComponent.emitted('loadingChange').length).to.eq(4);
    expect(infiniteScrollComponent.emitted('newData').length).to.eq(2);
    expect(infiniteScrollComponent.find('[data-test="bottom-loader"]').exists())
      .to.be.false;
  });

  it('does nothing when scrolls with no bottom loader', async () => {
    promiseResolve({
      data: {
        queryName: {
          pageInfo: {
            endCursor: null,
            hasNextPage: false
          }
        }
      }
    });
    apolloQueryMock.mockClear();
    await flushPromises();

    expect(infiniteScrollComponent.find('[data-test="bottom-loader"]').exists())
      .to.be.false;

    infiniteScrollComponent.vm.handleScroll();

    expect(apolloQueryMock.mock.calls).length(0);
  });
});
