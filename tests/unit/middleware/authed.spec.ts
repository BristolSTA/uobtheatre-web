import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  stubDefineNuxtRouteMiddleware,
  loadMiddleware,
  stubNavigateTo,
  mockAuthStore
} from '../support/middleware';

describe('middleware: authed', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    stubDefineNuxtRouteMiddleware();
    stubNavigateTo();
  });

  it('redirects to /login with redirect when not authed', async () => {
    mockAuthStore({ isLoggedIn: false });
    const middleware = await loadMiddleware('@/middleware/authed');

    const to = { fullPath: '/some/protected' } as any;
    const result = await middleware(to, undefined as any);

    expect(result).toEqual({
      path: '/login',
      query: { redirect: '/some/protected' }
    });
  });

  it('allows when authed', async () => {
    mockAuthStore({ isLoggedIn: true });
    const middleware = await loadMiddleware('@/middleware/authed');

    const result = await middleware(
      { fullPath: '/x' } as any,
      undefined as any
    );

    expect(result).toBeUndefined();
  });
});
