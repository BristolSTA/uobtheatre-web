import { mount, RouterLinkStub } from '@vue/test-utils';
import { expect } from 'chai';
import lo from 'lodash';

import { makeServer as makeAPIServer } from '@/fakeApi';
import { createProvider } from '@/vue-apollo';

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
    }, 2);
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
  let mountedComponent = mount(component, mountOptionsWithRouter(options));
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

const mountOptionsWithRouter = function (options = {}) {
  return Object.assign(options, {
    stubs: {
      RouterLink: RouterLinkStub,
    },
  });
};

const mountOptionsWithApollo = function (options = {}) {
  return Object.assign(options, {
    apolloProvider: createProvider(),
  });
};

const makeServer = () => {
  return makeAPIServer({ environment: 'test' });
};

const executeWithServer = (callback, closeServer = true) => {
  let server = makeServer();
  if (callback) callback(server);
  if (closeServer) server.shutdown();
  return server;
};

const serialize = (model, server, innersToSerialize = []) => {
  let serializedModel = server.serializerOrRegistry.serialize(model);

  innersToSerialize.forEach((relationship) => {
    let serializedAccessor = Array.isArray(relationship)
      ? relationship[0]
      : relationship;
    let modelAccessor = Array.isArray(relationship)
      ? relationship[1]
      : relationship;
    return lo.set(
      serializedModel,
      relationship,
      lo.get(serializedModel, serializedAccessor).map((_, index) => {
        return serialize(model[modelAccessor].models[index], server);
      })
    );
  });

  return serializedModel;
};

const createFromFactoryAndSerialize = (
  modelName,
  count = 1,
  overrides = {},
  server = null,
  innersToSerialize = []
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

  let serialized = serialize(returnData, server, innersToSerialize);

  if (!exisitingServer) server.shutdown();
  return serialized;
};

let assertNoVisualDifference = (recieved, expected) => {
  expect(JSON.stringify(recieved)).to.eq(JSON.stringify(expected));
};

let mapRelationshipsToEdges = (resource, relationships) => {
  relationships.forEach((relationship) => {
    if (resource[relationship]) {
      resource[relationship] = {
        edges: resource[relationship].map((node) => {
          return {
            node,
          };
        }),
      };
    }
  });
  return resource;
};

export {
  assertNoVisualDifference,
  createFromFactoryAndSerialize,
  executeWithServer,
  fixTextSpacing,
  makeServer,
  mapRelationshipsToEdges,
  mountOptionsWithApollo,
  mountOptionsWithRouter,
  mountWithRouterMock,
  RouterLinkStub,
  serialize,
  waitFor,
  waitForDOM,
  waitForTick,
};
