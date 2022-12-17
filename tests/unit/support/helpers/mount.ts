import { mount as vtuMount } from '@vue/test-utils';
import { Router, _RouteLocationBase } from 'vue-router';
import { vi } from 'vitest';
import { useApollo as originalUseApollo } from '@nuxtjs/apollo/dist/runtime/composables';
import { merge } from 'lodash';
import { createTestingPinia } from '@pinia/testing';

//@ts-ignore
globalThis.defineAppConfig = (options: any) => options;
// vi.stubGlobal('defineAppConfig', (options: any) => options);
import appConfig from '@/app.config';

interface ApolloMountingOptions {
  mutationResponses?: object[];
  queryResponses?: object[];
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
  const { mutationResponses = [], queryResponses = [] } = mountingOptions;

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
    query: queryMock,
    mutate: mutationMock
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
  if (mockRouter) registerRouterStub();

  // Stub out "useRoute" composable
  if (routeInfo) vi.stubGlobal('useRoute', () => routeInfo);

  // Stub out the "useAppConfig" composable
  vi.stubGlobal('useAppConfig', () => appConfig);

  return vtuMount(component, {
    ...merge({}, stubMountOptions, vtuMountOptions),
    shallow
  });
}
