import { mount } from '@vue/test-utils';
import { expect } from 'chai';

import InfiniteScroll from '@/components/ui/InfiniteScroll';

import { waitFor } from '../../helpers';

describe('Infinite Scroll', () => {
  let component, apolloQueryMock, promiseResolve;
  let fakeQuery = {
    some: 'GQL Tag query',
  };
  jest.spyOn(window, 'addEventListener');
  jest.spyOn(window, 'removeEventListener');

  beforeEach(() => {
    // Reset mocks
    window.addEventListener.mockClear();
    window.removeEventListener.mockClear();
    component = mount(InfiniteScroll, {
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

  it('registers scroll callback on mount', async () => {
    expect(window.addEventListener.mock.calls[0][0]).to.eq('scroll');
    expect(window.addEventListener.mock.calls[0][1]).to.eq(
      component.vm.handleScroll
    );
  });

  it('removes scroll callback on destory', async () => {
    component.destroy();
    expect(window.removeEventListener.mock.calls[0][0]).to.eq('scroll');
    expect(window.removeEventListener.mock.calls[0][1]).to.eq(
      component.vm.handleScroll
    );
  });

  it('has loader at start', () => {
    expect(component.findComponent({ ref: 'bottom-loader' }).exists());
  });

  it('runs first page query on mount and emits events (no next cursor)', async () => {
    // Should be loading
    expect(component.emitted('loadingChange').length).to.eq(1);
    expect(component.emitted('loadingChange')[0][0]).to.be.true;

    expect(apolloQueryMock.mock.calls).length(1);
    expect(apolloQueryMock.mock.calls[0][0].query).to.eq(fakeQuery);
    expect(apolloQueryMock.mock.calls[0][0].variables).to.include({
      afterCursor: null,
    });

    // Resolve the query
    let result = {
      data: {
        queryName: {
          pageInfo: {
            endCursor: null,
          },
        },
      },
    };
    promiseResolve(result);
    await component.vm.$nextTick();

    // Shouldnt be loading anymore
    expect(component.emitted('loadingChange').length).to.eq(2);
    expect(component.emitted('loadingChange')[1][0]).to.be.false;

    // The inner query data should be returned
    expect(component.emitted('newData').length).to.eq(1);
    expect(component.emitted('newData')[0][0]).to.eq(result.data.queryName);

    expect(component.findComponent({ ref: 'bottom-loader' }).exists()).to.be
      .false;
  });

  it('runs first page query on mount and emits events (next cursor)', async () => {
    // Resolve the query
    let result = {
      data: {
        queryName: {
          pageInfo: {
            endCursor: 'abcdefg',
          },
        },
      },
    };
    promiseResolve(result);
    await component.vm.$nextTick();

    // Shouldnt be loading anymore
    expect(component.emitted('loadingChange').length).to.eq(2);
    expect(component.emitted('loadingChange')[1][0]).to.be.false;

    // The inner query data should be returned
    expect(component.emitted('newData').length).to.eq(1);
    expect(component.emitted('newData')[0][0]).to.eq(result.data.queryName);

    expect(component.findComponent({ ref: 'bottom-loader' }).exists()).to.be
      .true;
  });

  it('runs query with next cursor when loader scrolled into view', async () => {
    // Resolve the query
    let result = {
      data: {
        queryName: {
          pageInfo: {
            endCursor: 'abcdefg',
          },
        },
      },
    };
    promiseResolve(result);
    await component.vm.$nextTick();

    apolloQueryMock.mockClear();
    expect(component.findComponent({ ref: 'bottom-loader' }).exists()).to.be
      .true;

    // Set the bottom loader to have a mock pixel height of 800
    Object.defineProperty(component.vm.$refs['bottom-loader'], 'offsetTop', {
      writable: false,
      value: 800,
    });

    // Expecting not to trigger the fetch routine (loader @ 800px, bottom of browser @ 768px)
    component.vm.handleScroll();
    expect(apolloQueryMock.mock.calls).length(0);

    // Should trigger fetch (loader @ 800px, bottom of browser @ 1000px)
    window.scrollY = 1000 - 768;
    component.vm.handleScroll();
    expect(apolloQueryMock.mock.calls).length(1);
    expect(apolloQueryMock.mock.calls[0][0].query).to.eq(fakeQuery);
    expect(apolloQueryMock.mock.calls[0][0].variables).to.include({
      afterCursor: 'abcdefg',
    });

    result.data.queryName.pageInfo.endCursor = null;
    promiseResolve(result);
    await waitFor(() => !component.vm.loading);

    expect(component.emitted('loadingChange').length).to.eq(4);
    expect(component.emitted('newData').length).to.eq(2);
    expect(component.findComponent({ ref: 'bottom-loader' }).exists()).to.be
      .false;
  });

  it('does nothing when scrolls with no bottom loader', async () => {
    promiseResolve({
      data: {
        queryName: {
          pageInfo: {
            endCursor: null,
          },
        },
      },
    });
    apolloQueryMock.mockClear();
    await component.vm.$nextTick();

    expect(component.findComponent({ ref: 'bottom-loader' }).exists()).to.be
      .false;

    component.vm.handleScroll();

    expect(apolloQueryMock.mock.calls).length(0);
  });
});
