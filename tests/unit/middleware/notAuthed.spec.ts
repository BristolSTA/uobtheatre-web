import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  stubDefineNuxtRouteMiddleware,
  loadMiddleware,
  stubNavigateTo,
  mockAuthStore
} from '../support/middleware';

describe('middleware: not-authed', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    stubDefineNuxtRouteMiddleware();
    stubNavigateTo();
  });

  it('redirects to / when already logged in', async () => {
    mockAuthStore({ isLoggedIn: true });
    const middleware = await loadMiddleware('@/middleware/not-authed');

    const result = await middleware({} as any, undefined as any);
    expect(result).toEqual('/');
  });

  it('allows when not authed', async () => {
    mockAuthStore({ isLoggedIn: false });
    const middleware = await loadMiddleware('@/middleware/not-authed');

    const result = await middleware({} as any, undefined as any);
    expect(result).toBeUndefined();
  });
});
