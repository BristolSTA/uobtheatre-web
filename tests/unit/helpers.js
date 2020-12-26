import { mount, RouterLinkStub } from '@vue/test-utils';

import { makeServer as makeAPIServer } from '@/fakeApi';

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

const makeServer = () => {
  return makeAPIServer({ environment: 'test' });
};

const executeWithServer = (callback) => {
  let server = makeServer();
  callback(server);
  server.shutdown;
};

const serialize = (model, server) => {
  return server.serializerOrRegistry.serialize(model);
};

const createFromFactoryAndSerialize = (
  modelName,
  count = 1,
  overrides = {},
  server = null
) => {
  let exisitingServer = server != null;
  if (!exisitingServer) {
    server = makeServer();
  }
  let returnData;
  if (count == 1) {
    returnData = server.create(modelName, overrides);
  } else {
    returnData = server.createList(modelName, count, overrides);
  }

  let serialized = serialize(returnData, server);
  if (!exisitingServer) server.shutdown();
  return serialized;
};

export {
  createFromFactoryAndSerialize,
  executeWithServer,
  fixTextSpacing,
  makeServer,
  mountWithRouterMock,
  RouterLinkStub,
  serialize,
  waitFor,
  waitForDOM,
  waitForTick,
};
