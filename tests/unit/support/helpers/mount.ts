import { mount as vtuMount } from '@vue/test-utils';
import { Router, _RouteLocationBase } from 'vue-router';
import { vi } from 'vitest';
import { useApollo as originalUseApollo } from '@nuxtjs/apollo/dist/runtime/composables';
import { merge } from 'lodash';
import { createTestingPinia } from '@pinia/testing';
import publicConfig from '@/config.public';

//@ts-ignore
globalThis.defineAppConfig = (options: any) => options;
// vi.stubGlobal('defineAppConfig', (options: any) => options);
import appConfig from '@/app.config';

interface ApolloMountingOptions {
  mutationResponses?: object[];
  queryResponses?: object[];
  mutationMockFn?: () => Promise<any>;
  queryMockFn?: () => Promise<any>;
}

interface MountOptions {
  apollo?: ApolloMountingOptions;
  routeInfo?: Partial<_RouteLocationBase>;
  mockRouter?: boolean;
  pinia?: Parameters<typeof createTestingPinia>[0];
}

/**
 * Stubs the "useApollo" composable and "$apollo" property to mock responses to calls
 */
function registerApolloStub(mountingOptions: ApolloMountingOptions) {
  // Compose the client mock
  const {
    mutationResponses = [],
    queryResponses = [],
    queryMockFn,
    mutationMockFn
  } = mountingOptions;

  const queryMock = vi.fn((options): Promise<any> => {
    if (queryResponses[queryMock.mock.calls.length - 1]) {
      return Promise.resolve(queryResponses[queryMock.mock.calls.length - 1]);
    }

    console.warn(
      `Unhandled apollo query. ${
        queryMock.mock.calls.length - 1
      } previous calls, but only ${queryResponses.length} in stack`,
      options.query
    );
    return Promise.resolve();
  });

  const mutationMock = vi.fn((options): Promise<any> => {
    if (mutationResponses[mutationMock.mock.calls.length - 1]) {
      return Promise.resolve(
        mutationResponses[mutationMock.mock.calls.length - 1]
      );
    }

    console.warn(
      `Unhandled apollo mutation. ${
        mutationMock.mock.calls.length - 1
      } previous calls, but only ${mutationResponses.length} in stack`,
      options.mutation
    );
    return Promise.resolve();
  });

  const mockClient = {
    mock: { mutationResponses, queryResponses },
    query: queryMockFn ?? queryMock,
    mutate: mutationMockFn ?? mutationMock
  };

  // Stub "useApollo" composable
  const useApolloInner: ReturnType<typeof originalUseApollo> = {
    getToken: vi.fn().mockResolvedValue(null),
    clients: undefined,
    onLogin: vi.fn().mockResolvedValue(null),
    onLogout: vi.fn().mockResolvedValue(null)
  };

  vi.stubGlobal('useApollo', () => useApolloInner);

  // Stub "useApolloClient" composable
  vi.stubGlobal('useApolloClient', () => ({
    resolveClient: vi.fn(() => mockClient),
    client: mockClient
  }));

  return {
    global: {
      mocks: {
        $apollo: mockClient
      }
    }
  };
}

/**
 * Stubs the "useRouter" composable with mock functions
 */
function registerRouterStub() {
  // We define the return of useRouter outside of the function so that the mocks remain the same over multiple calls
  const routerInner: Partial<Router> = {
    replace: vi.fn().mockResolvedValue(null),
    push: vi.fn().mockResolvedValue(null)
  };

  vi.stubGlobal('useRouter', () => routerInner);
  return {
    global: {
      mocks: {
        useRouter: () => routerInner
      }
    }
  };
}

/**
 * Stubs the "useRoute" composable
 */
function registerRouteStub(routeOpt: Partial<_RouteLocationBase> | undefined) {
  const useRouteMock = () => {
    if (routeOpt) return routeOpt;

    console.error(
      "useRoute was called, but was not initalised by mount(). Include the 'routeInfo' mouting property."
    );
    return {};
  };

  vi.stubGlobal('useRoute', useRouteMock);
  return {
    global: {
      mocks: {
        useRoute: useRouteMock
      }
    }
  };
}

export default function (
  component: Parameters<typeof vtuMount>[0],
  options?: Parameters<typeof vtuMount>[1] & MountOptions
) {
  // Extract out config options
  const {
    mockRouter = true,
    routeInfo,
    apollo,
    shallow = true,
    pinia,
    ...vtuMountOptions
  } = options ?? {};

  let stubMountOptions = {
    global: {
      plugins: [createTestingPinia(pinia)] // Install Pinia mock
    }
  };

  const addStubMountOptions = (options: object) =>
    merge(stubMountOptions, options);

  // Mock apollo functionality
  if (apollo) addStubMountOptions(registerApolloStub(apollo));

  // Stub out "useRouter" composable
  if (mockRouter) addStubMountOptions(registerRouterStub());

  // Stub out "useRoute" composable
  addStubMountOptions(registerRouteStub(routeInfo));

  // Stub out the "useAppConfig" composable
  vi.stubGlobal('useAppConfig', () => appConfig);

  // Stub out the "useRuntimeConfig" composable
  vi.stubGlobal('useRuntimeConfig', () => ({
    public: publicConfig()
  }));

  return vtuMount(component, {
    ...merge({}, stubMountOptions, vtuMountOptions),
    shallow
  });
}
