import { mount, RouterLinkStub } from '@vue/test-utils';

const waitForDOM = function (wrapper, selector) {
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      const userEl = wrapper.findAll(selector);
      if (userEl.length > 0) {
        clearInterval(timer);
        resolve();
      }
    }, 100);
  });
};

const waitFor = function (callback) {
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      if (callback()) {
        clearInterval(timer);
        resolve();
      }
    }, 100);
  });
};

const waitForTick = function (Vue, callback) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    let maxAttempts = 200;
    let attempts = 0;

    while (attempts < maxAttempts) {
      attempts++;
      await Vue.$nextTick();
      if (callback()) {
        resolve();
      }
    }
  });
};

const fixTextSpacing = function (text) {
  return text.replace(/\s\s+/g, ' ');
};

const mountWithRouterMock = async function (component, options = {}) {
  let mountedComponent = mount(
    component,
    Object.assign(options, {
      stubs: {
        RouterLink: RouterLinkStub,
      },
    })
  );
  if (component.beforeRouteEnter) {
    await component.beforeRouteEnter.call(
      mountedComponent.vm,
      undefined,
      undefined,
      (callback) => {
        callback(mountedComponent.vm);
      }
    );
  }

  return mountedComponent;
};

export {
  fixTextSpacing,
  mountWithRouterMock,
  RouterLinkStub,
  waitFor,
  waitForDOM,
  waitForTick,
};
