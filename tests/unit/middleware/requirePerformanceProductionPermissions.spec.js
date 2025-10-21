import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  stubDefineNuxtRouteMiddleware,
  stubAbortNavigation,
  stubCreateSafeErrorDeps,
  mockAuthStoreWithPermissionMethod,
  loadMiddleware
} from '../support/middleware';

describe('middleware: require-performance-production-permissions', () => {
  let abortNavigationMock;
  let useAuthStoreMock;
  let hasPermissionsMock;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    // Stub Nuxt helpers and createSafeError deps
    stubDefineNuxtRouteMiddleware();
    abortNavigationMock = stubAbortNavigation();
    stubCreateSafeErrorDeps();

    // Mock the auth store used by the middleware
    const mocked = mockAuthStoreWithPermissionMethod(
      'hasPermissionsForPerformanceProduction'
    );
    useAuthStoreMock = mocked.useAuthStoreMock;
    hasPermissionsMock = mocked.permissionMethodMock;
  });

  it('aborts when performanceId is not a string', async () => {
    const middleware = await loadMiddleware(
      '@/middleware/require-performance-production-permissions'
    );

    // performanceId invalid (number)
    await middleware({
      params: { performanceId: 123 },
      meta: { requiredPermissions: ['perm:a'] }
    });

    expect(abortNavigationMock).toHaveBeenCalledTimes(1);
    // Should not try to read the store if id invalid
    expect(useAuthStoreMock).not.toHaveBeenCalled();
  });

  it('allows when no requiredPermissions provided on route meta', async () => {
    const middleware = await loadMiddleware(
      '@/middleware/require-performance-production-permissions'
    );

    await middleware({
      params: { performanceId: 'abc' },
      meta: {}
    });

    expect(abortNavigationMock).not.toHaveBeenCalled();
    expect(useAuthStoreMock).not.toHaveBeenCalled();
  });

  it('aborts with config error when requiredPermissions is not an array', async () => {
    const middleware = await loadMiddleware(
      '@/middleware/require-performance-production-permissions'
    );

    await middleware({
      params: { performanceId: 'perf-1' },
      meta: { requiredPermissions: 'not-an-array' }
    });

    expect(abortNavigationMock).toHaveBeenCalledTimes(1);
    expect(abortNavigationMock).toHaveBeenCalledWith(
      'Invalid permission configuration'
    );
  });

  it('aborts with config error when requiredPermissions is an empty array', async () => {
    const middleware = await loadMiddleware(
      '@/middleware/require-performance-production-permissions'
    );

    await middleware({
      params: { performanceId: 'perf-1' },
      meta: { requiredPermissions: [] }
    });

    expect(abortNavigationMock).toHaveBeenCalledTimes(1);
    expect(abortNavigationMock).toHaveBeenCalledWith(
      'Invalid permission configuration'
    );
  });

  it('allows navigation when user has required permissions', async () => {
    const middleware = await loadMiddleware(
      '@/middleware/require-performance-production-permissions'
    );
    hasPermissionsMock.mockResolvedValue(true);

    await middleware({
      params: { performanceId: 'perf-allow' },
      meta: { requiredPermissions: ['perm:a', 'perm:b'] }
    });

    expect(useAuthStoreMock).toHaveBeenCalledTimes(1);
    expect(hasPermissionsMock).toHaveBeenCalledWith('perf-allow', [
      'perm:a',
      'perm:b'
    ]);
    expect(abortNavigationMock).not.toHaveBeenCalled();
  });

  it('aborts with 401 error when user lacks permissions', async () => {
    const middleware = await loadMiddleware(
      '@/middleware/require-performance-production-permissions'
    );
    hasPermissionsMock.mockResolvedValue(false);

    await middleware({
      params: { performanceId: 'perf-deny' },
      meta: { requiredPermissions: ['perm:x'] }
    });

    expect(useAuthStoreMock).toHaveBeenCalledTimes(1);
    expect(hasPermissionsMock).toHaveBeenCalledWith('perf-deny', ['perm:x']);
    expect(abortNavigationMock).toHaveBeenCalledTimes(1);

    // Ensure the error object passed has the expected details
    const [firstArg] = abortNavigationMock.mock.calls[0];
    expect(firstArg).toMatchObject({
      statusCode: 401,
      message: 'You do not have permission to access this page'
    });
  });
});
