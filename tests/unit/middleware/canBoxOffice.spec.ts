import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  stubDefineNuxtRouteMiddleware,
  loadMiddleware,
  stubNavigateTo,
  mockAuthStore
} from '../support/middleware';

describe('middleware: can-boxoffice', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    stubDefineNuxtRouteMiddleware();
    stubNavigateTo();
  });

  it('redirects to / when missing boxoffice_open', async () => {
    mockAuthStore({
      isLoggedIn: true,
      hasPermissionImpl: (p) => (p === 'boxoffice_open' ? false : false)
    });
    const middleware = await loadMiddleware('@/middleware/can-boxoffice');

    const result = await middleware({} as any, undefined as any);

    expect(result).toEqual('/');
  });

  it('allows when has boxoffice_open', async () => {
    mockAuthStore({
      isLoggedIn: true,
      hasPermissionImpl: (p) => p === 'boxoffice_open'
    });
    const middleware = await loadMiddleware('@/middleware/can-boxoffice');

    const result = await middleware({} as any, undefined as any);

    expect(result).toBeUndefined();
  });
});
