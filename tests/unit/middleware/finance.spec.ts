import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  stubDefineNuxtRouteMiddleware,
  loadMiddleware,
  stubNavigateTo,
  mockAuthStore
} from '../support/middleware';

describe('middleware: finance', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    stubDefineNuxtRouteMiddleware();
    stubNavigateTo();
  });

  it('redirects to / when not authed and no admin', async () => {
    mockAuthStore({
      isLoggedIn: false,
      hasPermissionImpl: (p) => false
    });
    const middleware = await loadMiddleware('@/middleware/finance');

    const result = await middleware({} as any, undefined as any);
    expect(result).toEqual('/');
  });

  it('redirects to /admin when admin_open but no finance_reports', async () => {
    mockAuthStore({
      isLoggedIn: true,
      hasPermissionImpl: (p) => p === 'admin_open'
    });
    const middleware = await loadMiddleware('@/middleware/finance');
    const result = await middleware({} as any, undefined as any);

    expect(result).toEqual('/administration/');
  });

  it('allows when has finance_reports', async () => {
    mockAuthStore({
      isLoggedIn: true,
      hasPermissionImpl: (p) => p === 'finance_reports'
    });
    const middleware = await loadMiddleware('@/middleware/finance');
    const result = await middleware({} as any, undefined as any);

    expect(result).toBeUndefined();
  });
});
