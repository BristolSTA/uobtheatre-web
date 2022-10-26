import { mount } from '@vue/test-utils';
import { expect } from 'chai';

import InfiniteScroll from '@/components/ui/InfiniteScroll';

jest.mock('@/utils.js', () => ({
  ...jest.requireActual('@/utils.js'),
  isInViewport: jest.fn(() => false),
}));
describe('Infinite Scroll', () => {
  let infiniteScrollComponent, apolloQueryMock, promiseResolve;
  const fakeQuery = {
    some: 'GQL Tag query',
  };
  jest.spyOn(window, 'addEventListener');
  jest.spyOn(window, 'removeEventListener');

  beforeEach(() => {
    // Reset mocks
    window.addEventListener.mockClear();
    window.removeEventListener.mockClear();
    infiniteScrollComponent = mount(InfiniteScroll, {
      mocks: {
        $apollo: {
          query: (apolloQueryMock = jest.fn(
            () =>
              new Promise((resolve) => {
                promiseResolve = resolve;
              })
          )),
        },
      },
      propsData: {
        apolloQuery: fakeQuery,
      },
    });
  });

  it('registers scroll callback on mount', () => {
    expect(window.addEventListener.mock.calls[0][0]).to.eq('scroll');
    expect(window.addEventListener.mock.calls[0][1]).to.eq(
      infiniteScrollComponent.vm.handleScroll
    );
  });

  it('removes scroll callback on destory', () => {
    infiniteScrollComponent.destroy();
    expect(window.removeEventListener.mock.calls[0][0]).to.eq('scroll');
    expect(window.removeEventListener.mock.calls[0][1]).to.eq(
      infiniteScrollComponent.vm.handleScroll
    );
  });

  it('has loader at start', () => {
    expect(
      infiniteScrollComponent.findComponent({ ref: 'bottom-loader' }).exists()
    );
  });

  it('runs first page query on mount and emits events (no next page)', async () => {
    // Should be loading
    expect(infiniteScrollComponent.emitted('loadingChange').length).to.eq(1);
    expect(infiniteScrollComponent.emitted('loadingChange')[0][0]).to.be.true;

    expect(apolloQueryMock.mock.calls).length(1);
    expect(apolloQueryMock.mock.calls[0][0].query).to.eq(fakeQuery);
    expect(apolloQueryMock.mock.calls[0][0].variables).to.include({
      afterCursor: null,
    });

    // Resolve the query
    const result = {
      data: {
        queryName: {
          pageInfo: {
            endCursor: null,
            hasNextPage: false,
          },
        },
      },
    };
    promiseResolve(result);
    await infiniteScrollComponent.vm.$nextTick();

    // Shouldnt be loading anymore
    expect(infiniteScrollComponent.emitted('loadingChange').length).to.eq(2);
    expect(infiniteScrollComponent.emitted('loadingChange')[1][0]).to.be.false;

    // The inner query data should be returned
    expect(infiniteScrollComponent.emitted('newData').length).to.eq(1);
    expect(infiniteScrollComponent.emitted('newData')[0][0]).to.eq(
      result.data.queryName
    );

    expect(
      infiniteScrollComponent.findComponent({ ref: 'bottom-loader' }).exists()
    ).to.be.false;
  });

  it('runs first page query on mount and emits events (next page)', async () => {
    // Resolve the query
    const result = {
      data: {
        queryName: {
          pageInfo: {
            endCursor: 'abcdefg',
            hasNextPage: true,
          },
        },
      },
    };
    promiseResolve(result);
    await infiniteScrollComponent.vm.$nextTick();

    // Shouldnt be loading anymore
    expect(infiniteScrollComponent.emitted('loadingChange').length).to.eq(2);
    expect(infiniteScrollComponent.emitted('loadingChange')[1][0]).to.be.false;

    // The inner query data should be returned
    expect(infiniteScrollComponent.emitted('newData').length).to.eq(1);
    expect(infiniteScrollComponent.emitted('newData')[0][0]).to.eq(
      result.data.queryName
    );

    expect(
      infiniteScrollComponent.findComponent({ ref: 'bottom-loader' }).exists()
    ).to.be.true;
  });

  it('runs query with next cursor when loader scrolled into view', async () => {
    // Resolve the query
    const result = {
      data: {
        queryName: {
          pageInfo: {
            endCursor: 'abcdefg',
            hasNextPage: true,
          },
        },
      },
    };
    promiseResolve(result);
    await infiniteScrollComponent.vm.$nextTick();

    apolloQueryMock.mockClear();
    expect(
      infiniteScrollComponent.findComponent({ ref: 'bottom-loader' }).exists()
    ).to.be.true;

    // Set the bottom loader to have a mock pixel height of 800
    Object.defineProperty(
      infiniteScrollComponent.vm.$refs['bottom-loader'],
      'offsetTop',
      {
        writable: false,
        value: 800,
      }
    );

    // Expecting not to trigger the fetch routine (loader @ 800px, bottom of browser @ 768px)
    infiniteScrollComponent.vm.handleScroll();
    expect(apolloQueryMock.mock.calls).length(0);

    // Should trigger fetch (loader @ 800px, bottom of browser @ 1000px)
    window.scrollY = 1000 - 768;
    infiniteScrollComponent.vm.handleScroll();
    expect(apolloQueryMock.mock.calls).length(1);
    expect(apolloQueryMock.mock.calls[0][0].query).to.eq(fakeQuery);
    expect(apolloQueryMock.mock.calls[0][0].variables).to.include({
      afterCursor: 'abcdefg',
    });

    result.data.queryName.pageInfo.hasNextPage = false;
    promiseResolve(result);
    await infiniteScrollComponent.vm.$nextTick();
    await infiniteScrollComponent.vm.$nextTick();

    expect(infiniteScrollComponent.emitted('loadingChange').length).to.eq(4);
    expect(infiniteScrollComponent.emitted('newData').length).to.eq(2);
    expect(
      infiniteScrollComponent.findComponent({ ref: 'bottom-loader' }).exists()
    ).to.be.false;
  });

  it('does nothing when scrolls with no bottom loader', async () => {
    promiseResolve({
      data: {
        queryName: {
          pageInfo: {
            endCursor: null,
            hasNextPage: false,
          },
        },
      },
    });
    apolloQueryMock.mockClear();
    await infiniteScrollComponent.vm.$nextTick();

    expect(
      infiniteScrollComponent.findComponent({ ref: 'bottom-loader' }).exists()
    ).to.be.false;

    infiniteScrollComponent.vm.handleScroll();

    expect(apolloQueryMock.mock.calls).length(0);
  });
});
