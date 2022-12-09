import { mount, RouterLinkStub } from '@vue/test-utils';
import { expect, vi } from 'vitest';
import config from '~~/config.public';
import { createTestingPinia } from '@pinia/testing';

/**
 * Fixes test "contains" issues caused by content being spread over new lines.
 * Removes double-spacing / new lining in a given string.
 *
 * @param {string} text Text to fix
 * @returns {string} Fixed text
 */
const fixTextSpacing = function (text) {
  return text.replace(/\s\s+/g, ' ');
};

/**
 * Mounts a vue component, mocking Vue Router funcitons including stubbing router-links and simulating beforeRouteEnter navigiation guards
 *
 * @param {Class} component Vue Component
 * @param {object} mountOptions Mounting options dictionary
 * @param {object} to "to" route mock
 * @param {object} from "from" route mock
 * @param {?Function} next Optional custom implementation of "next" function
 * @returns {any} Vue Wrapper
 */
const mountWithRouterMock = async function (
  component,
  mountOptions = {},
  contextOptions = {}
) {
  contextOptions = Object.assign(
    {
      error: vi.fn(),
      app: {
        apolloProvider: {
          defaultClient: mountOptions.mocks ? mountOptions.mocks.$apollo : null
        }
      }
    },
    contextOptions
  );

  if (component.asyncData) {
    const dataObject = await component.asyncData.call(null, contextOptions);

    // If the error handler has been called, abort
    if (contextOptions.error.mock.calls.length) {
      return;
    }
    mountOptions.data = () => {
      return dataObject;
    };
  }

  // Mount the component
  const mountedComponent = mount(
    component,
    generateMountOptions(
      ['router'],
      Object.assign({}, mountOptions, {
        global: {
          plugins: [createTestingPinia()]
        }
      })
    )
  );

  return mountedComponent;
};

/**
 * Generates Vue mount options based on a request list of pre-built option sets
 *
 * @param {Array<string>} types List of types to include. Current options: 'router', 'apollo'
 * @param {?object} options Optional options object to merge into generated option set
 * @returns {object} Vue mounting options
 */
const generateMountOptions = function (types = [], options = {}) {
  if (!options.stubs) {
    options.stubs = {};
  }
  if (!options.mocks) {
    options.mocks = {};
  }
  if (types.includes('config')) {
    options.mocks.$config = config();
  }
  if (types.includes('apollo')) {
    options.mocks.$apollo = generateApolloMock(options.apollo);
    options.mocks.$apolloProvider = {
      defaultClient: options.mocks.$apollo
    };
    delete options.apollo;
  }
  if (types.includes('router')) {
    options.stubs.NuxtLink = RouterLinkStub;
  }
  return options;
};

const generateApolloMock = function (options) {
  const queryCallstack = options ? options.queryCallstack : [];
  const mutationCallstack = options ? options.mutationCallstack : [];
  const queryCalls = [];
  const mutationCalls = [];

  return {
    mock: {
      queryCalls,
      queryCallstack,
      mutationCalls,
      mutationCallstack,
      handledQueries: () => queryCalls.length,
      handledMutations: () => mutationCalls.length
    },
    query: vi.fn((options) => {
      queryCalls.push(options);
      if (queryCallstack[queryCalls.length - 1]) {
        return Promise.resolve(queryCallstack[queryCalls.length - 1]);
      }

      // eslint-disable-next-line no-console
      console.warn(
        `Unhandled apollo query. ${
          queryCalls.length - 1
        } previous calls, but only ${queryCallstack.length} in stack`,
        options.query
      );
      return Promise.resolve();
    }),
    mutate: vi.fn(() => {
      mutationCalls.push(options);
      if (mutationCallstack[mutationCalls.length - 1]) {
        return Promise.resolve(mutationCallstack[mutationCalls.length - 1]);
      }

      // eslint-disable-next-line no-console
      console.warn(
        `Unhandled apollo mutation. ${
          mutationCalls.length - 1
        } previous calls, but only ${mutationCallstack.length} in stack`,
        options.mutation
      );
      return Promise.resolve();
    })
  };
};

/**
 * Asserts no visual differnce between recieved and expected objects
 *
 * @param {object|Array|string} recieved Recieved object
 * @param {object|Array|string} expected Expected object
 */
const assertNoVisualDifference = (recieved, expected) => {
  expect(JSON.stringify(recieved)).to.eq(JSON.stringify(expected));
};

export {
  assertNoVisualDifference,
  fixTextSpacing,
  generateMountOptions,
  generateApolloMock,
  mountWithRouterMock,
  RouterLinkStub
};
