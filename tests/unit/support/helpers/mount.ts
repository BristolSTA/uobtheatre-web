import { mount as vtuMount } from '@vue/test-utils';
import { Router, _RouteLocationBase } from 'vue-router';
import { vi } from 'vitest';

interface ApolloMountingOptions {}

interface MountOptions {
  apollo?: ApolloMountingOptions;
  routeInfo?: Partial<_RouteLocationBase>;
  mockRouter?: boolean;
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
  const {
    mockRouter = true,
    routeInfo,
    shallow = true,
    ...vtuMountOptions
  } = options ?? {};

  // Stub out "useRouter" composable
  if (mockRouter) registerRouterStub();

  // Stub out "useRoute" composable
  if (routeInfo) vi.stubGlobal('useRoute', () => routeInfo);

  return vtuMount(component, { ...vtuMountOptions, shallow });
}
