import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  stubDefineNuxtRouteMiddleware,
  loadMiddleware,
  stubNavigateTo,
  mockAuthStore
} from '../support/middleware';

describe('middleware: admin', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    stubDefineNuxtRouteMiddleware();
    stubNavigateTo();
  });

  it('redirects to / when not logged in', async () => {
    const { hasPermissionMock } = mockAuthStore({ isLoggedIn: false });
    const middleware = await loadMiddleware('@/middleware/admin');

    const result = await middleware({} as any, undefined as any);

    expect(result).toEqual('/');
    expect(hasPermissionMock).not.toHaveBeenCalled();
  });

  it('redirects to / when missing admin_open permission', async () => {
    mockAuthStore({
      isLoggedIn: true,
      hasPermissionImpl: (p) => (p === 'admin_open' ? false : false)
    });
    const middleware = await loadMiddleware('@/middleware/admin');

    const result = await middleware({} as any, undefined as any);

    expect(result).toEqual('/');
  });

  it('allows when logged in and has admin_open', async () => {
    mockAuthStore({
      isLoggedIn: true,
      hasPermissionImpl: (p) => p === 'admin_open'
    });
    const middleware = await loadMiddleware('@/middleware/admin');

    const result = await middleware({} as any, undefined as any);

    expect(result).toBeUndefined();
  });
});
