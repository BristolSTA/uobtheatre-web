import { mount, RouterLinkStub } from '@vue/test-utils'
import { expect } from 'chai'
import config from '@/config'

import { makeServer as makeAPIServer } from '@/fakeApi'
import { createProvider } from '@/plugins/vue-apollo.config'

const defaultApolloClientOptions = {
  httpEndpoint: '/fakeapi/graphql/',
  apollo: {
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache',
      },
    },
  },
}

const defaultVueApolloOptions = {
  $query: {
    fetchPolicy: 'no-cache',
  },
}

let apolloProvider = createProvider(
  defaultApolloClientOptions,
  defaultVueApolloOptions
)

/**
 * Waits for a certain DOM element to be present
 *
 * @param {any} wrapper Vue Wrapper
 * @param {string} selector CSS Selector
 * @returns {Promise} Resolves once DOM element found
 */
const waitForDOM = function (wrapper, selector) {
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      const userEl = wrapper.findAll(selector)
      if (userEl.length > 0) {
        clearInterval(timer)
        resolve()
      }
    }, 100)
  })
}

/**
 * Waits for a given callback function to return true
 *
 * @param {Function} callback Callable function to check every cycle. Passes when it returns truthy
 * @returns {Promise} Resolves once DOM element found
 */
const waitFor = function (callback) {
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      if (callback()) {
        clearInterval(timer)
        resolve()
      }
    }, 2)
  })
}

/**
 * Fixes test "contains" issues caused by content being spread over new lines.
 * Removes double-spacing / new lining in a given string.
 *
 * @param {string} text Text to fix
 * @returns {string} Fixed text
 */
const fixTextSpacing = function (text) {
  return text.replace(/\s\s+/g, ' ')
}

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
      error: jest.fn(),
      app: {
        apolloProvider,
      },
    },
    contextOptions
  )

  if (component.asyncData) {
    const dataObject = await component.asyncData.call(null, contextOptions)

    // If the error handler has been called, abort
    if (contextOptions.error.mock.calls.length) {
      return
    }
    mountOptions.data = () => {
      return dataObject
    }
  }

  // Mount the component
  const mountedComponent = mount(
    component,
    generateMountOptions(['router'], mountOptions)
  )

  return mountedComponent
}

/**
 * Generates Vue mount options based on a request list of pre-built option sets
 *
 * @param {Array<string>} types List of types to include. Current options: 'router', 'apollo'
 * @param {?object} options Optional options object to merge into generated option set
 * @returns {object} Vue mounting options
 */
const generateMountOptions = function (types = [], options = {}) {
  if (!options.stubs) options.stubs = {}
  if (!options.mocks) options.mocks = {}
  if (types.includes('config')) {
    options.mocks.$config = config()
  }
  if (types.includes('apollo') || types.includes('apollo-new')) {
    options.mocks.$apollo = generateApolloMock(options.apollo)
    delete options.apollo
  }
  if (types.includes('router')) {
    options.stubs.NuxtLink = RouterLinkStub
  }
  return options
}

const generateApolloMock = function (options) {
  let queryCount = 0
  let mutationCount = 0
  const queryCallstack = options ? options.queryResponses : []
  const mutationCallstack = options ? options.mutationResponses : []

  return {
    query: jest.fn(() => {
      queryCount++
      if (queryCallstack[queryCount - 1])
        return Promise.resolve(queryCallstack[queryCount - 1])
      return Promise.resolve()
    }),
    mutate: jest.fn(() => {
      mutationCount++
      if (mutationCallstack[mutationCount - 1])
        return Promise.resolve(mutationCallstack[mutationCount - 1])
      return Promise.resolve()
    }),
  }
}

/**
 * Makes a MirageJS testing server
 *
 * @returns {any} Mirage JS server instance
 */
const makeServer = () => {
  return makeAPIServer({ environment: 'test' })
}

/**
 * Creates and executes a function with a MirageJS server instance
 *
 * @param {Function} callback Callback function. Called with the first parameter being the MirageJS server
 * @param {boolean} closeServer True = Server will be shutdown after callback executed. False = Not shutdown
 * @returns {any} Mirage JS server instance
 */
const executeWithServer = async (callback, closeServer = true) => {
  const server = makeServer()
  if (callback) await callback(server)
  if (closeServer) {
    server.shutdown()
  }
  return server
}

/**
 * Asserts no visual differnce between recieved and expected objects
 *
 * @param {object|Array|string} recieved Recieved object
 * @param {object|Array|string} expected Expected object
 */
const assertNoVisualDifference = (recieved, expected) => {
  expect(JSON.stringify(recieved)).to.eq(JSON.stringify(expected))
}

/**
 * Runs a GraphQL query through apollo.
 * Useful for getting data from the Fake API like the real components will
 *
 * @param {object} options Dictionary of options for the apollo query
 * @returns {Promise} Apollo Query Promise
 */
const runApolloQuery = (options) => {
  return apolloProvider.defaultClient.query(
    Object.assign(
      {
        fetchPolicy: 'no-cache',
      },
      options
    )
  )
}

/**
 * Seeds a user if doesn't already exist, and programatically logs that user in
 *
 * @param {any} server MirageJS Server Instance
 * @param {object} overrides Optional dictionary of overrides for the user model
 * @returns {object} MirageJS User Node Model
 */
const seedAndAuthAsUser = (server, overrides = {}) => {
  const options = Object.assign(
    {
      token: '1234abcd',
    },
    overrides
  )
  apolloProvider = createProvider(
    Object.assign(defaultApolloClientOptions, {
      getAuth: () => `JWT ${options.token}`,
    }),
    defaultVueApolloOptions
  )

  let user = server.schema.userNodes.findBy({ token: options.token })

  if (!user) user = server.create('userNode', options)
  return user
}

export {
  assertNoVisualDifference,
  executeWithServer,
  fixTextSpacing,
  generateMountOptions,
  generateApolloMock,
  makeServer,
  mountWithRouterMock,
  RouterLinkStub,
  runApolloQuery,
  seedAndAuthAsUser,
  waitFor,
  waitForDOM,
}
