import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  stubDefineNuxtRouteMiddleware,
  stubAbortNavigation,
  stubCreateSafeErrorDeps,
  mockAuthStoreWithPermissionMethod,
  loadMiddleware
} from '../support/middleware';

describe('middleware: require-production-permissions', () => {
  let abortNavigationMock: ReturnType<typeof vi.fn>;
  let useAuthStoreMock: ReturnType<typeof vi.fn>;
  let hasPermissionsMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    // Stub Nuxt helpers and createSafeError deps
    stubDefineNuxtRouteMiddleware();
    abortNavigationMock = stubAbortNavigation();
    stubCreateSafeErrorDeps();

    // Mock the auth store used by the middleware
    const mocked = mockAuthStoreWithPermissionMethod(
      'hasPermissionsForProduction'
    );
    useAuthStoreMock = mocked.useAuthStoreMock as any;
    hasPermissionsMock = mocked.permissionMethodMock as any;
  });

  it('aborts when productionSlug is not a string', async () => {
    const middleware = await loadMiddleware(
      '@/middleware/require-production-permissions'
    );

    await middleware({
      params: { productionSlug: 42 as any },
      meta: { requiredPermissions: ['perm:a'] }
    });

    expect(abortNavigationMock).toHaveBeenCalledTimes(1);
    expect(useAuthStoreMock).not.toHaveBeenCalled();
  });

  it('allows when no requiredPermissions provided', async () => {
    const middleware = await loadMiddleware(
      '@/middleware/require-production-permissions'
    );

    await middleware({
      params: { productionSlug: 'slug' },
      meta: {}
    });

    expect(abortNavigationMock).not.toHaveBeenCalled();
    expect(useAuthStoreMock).not.toHaveBeenCalled();
  });

  it('aborts with config error when requiredPermissions is not an array', async () => {
    const middleware = await loadMiddleware(
      '@/middleware/require-production-permissions'
    );

    await middleware({
      params: { productionSlug: 'slug' },
      meta: { requiredPermissions: 'nope' as any }
    });

    expect(abortNavigationMock).toHaveBeenCalledTimes(1);
    expect(abortNavigationMock).toHaveBeenCalledWith(
      'Invalid permission configuration'
    );
  });

  it('aborts with config error when requiredPermissions is an empty array', async () => {
    const middleware = await loadMiddleware(
      '@/middleware/require-production-permissions'
    );

    await middleware({
      params: { productionSlug: 'slug' },
      meta: { requiredPermissions: [] }
    });

    expect(abortNavigationMock).toHaveBeenCalledTimes(1);
    expect(abortNavigationMock).toHaveBeenCalledWith(
      'Invalid permission configuration'
    );
  });

  it('allows navigation when user has required permissions for the production', async () => {
    const middleware = await loadMiddleware(
      '@/middleware/require-production-permissions'
    );
    hasPermissionsMock.mockResolvedValue(true);

    await middleware({
      params: { productionSlug: 'prod-allow' },
      meta: { requiredPermissions: ['perm:a', 'perm:b'] }
    });

    expect(useAuthStoreMock).toHaveBeenCalledTimes(1);
    expect(hasPermissionsMock).toHaveBeenCalledWith('prod-allow', [
      'perm:a',
      'perm:b'
    ]);
    expect(abortNavigationMock).not.toHaveBeenCalled();
  });

  it('aborts with 401 error when user lacks required permissions', async () => {
    const middleware = await loadMiddleware(
      '@/middleware/require-production-permissions'
    );
    hasPermissionsMock.mockResolvedValue(false);

    await middleware({
      params: { productionSlug: 'prod-deny' },
      meta: { requiredPermissions: ['perm:x'] }
    });

    expect(useAuthStoreMock).toHaveBeenCalledTimes(1);
    expect(hasPermissionsMock).toHaveBeenCalledWith('prod-deny', ['perm:x']);
    expect(abortNavigationMock).toHaveBeenCalledTimes(1);
    const [firstArg] = abortNavigationMock.mock.calls[0]!;
    expect(firstArg).toMatchObject({
      statusCode: 401,
      message: 'You do not have permission to access this page'
    });
  });
});
