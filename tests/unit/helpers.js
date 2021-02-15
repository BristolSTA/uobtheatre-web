import { mount, RouterLinkStub } from '@vue/test-utils';
import { expect } from 'chai';

import { makeServer as makeAPIServer } from '@/fakeApi';
import store from '@/store';
import { createClient, createProvider } from '@/vue-apollo';

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

const mountWithRouterMock = async function (
  component,
  options = {},
  to,
  from,
  next
) {
  // eslint-disable-next-line no-undef
  if (!next) next = jest.fn();

  let mountedComponent = mount(
    component,
    generateMountOptions(['router'], options)
  );

  if (component.beforeRouteEnter) {
    await component.beforeRouteEnter.call(
      mountedComponent.vm,
      to,
      from,
      // eslint-disable-next-line no-undef
      next.mockImplementation(async (callback) => {
        if (typeof callback === 'function') await callback(mountedComponent.vm);
        return;
      })
    );
  }

  return mountedComponent;
};

const generateMountOptions = function (types = [], options = {}) {
  if (!options['stubs']) options.stubs = {};
  if (types.includes('apollo')) {
    options.apolloProvider = createProvider();
  }
  if (types.includes('router')) {
    options.stubs.RouterLink = RouterLinkStub;
  }
  return options;
};

const makeServer = () => {
  return makeAPIServer({ environment: 'test' });
};

const executeWithServer = async (callback, closeServer = true) => {
  let server = makeServer();
  if (callback) await callback(server);
  if (closeServer) {
    server.shutdown();
  }
  return server;
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
let client = null;
let runApolloQuery = (options) => {
  if (!client) {
    let { apolloClient } = createClient();
    client = apolloClient;
  }
  return client.query(
    Object.assign(
      {
        fetchPolicy: 'no-cache',
      },
      options
    )
  );
};
let seedAndAuthAsUser = (server, overrides = {}) => {
  let options = Object.assign(
    {
      token: '1234abcd',
    },
    overrides
  );
  store.commit('SET_AUTH_TOKEN', options.token);

  let user = server.schema.userNodes.findBy({ token: options.token });

  if (!user) user = server.create('userNode', options);
  return user;
};

export {
  assertNoVisualDifference,
  executeWithServer,
  fixTextSpacing,
  generateMountOptions,
  makeServer,
  mapRelationshipsToEdges,
  mountWithRouterMock,
  RouterLinkStub,
  runApolloQuery,
  seedAndAuthAsUser,
  waitFor,
  waitForDOM,
  waitForTick,
};
