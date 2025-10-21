import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  stubDefineNuxtRouteMiddleware,
  loadMiddleware,
  stubNavigateTo,
  mockAuthStore,
  mockBoxOfficeStore
} from '../support/middleware';

describe('middleware: lockdown-mode.global', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    stubDefineNuxtRouteMiddleware();
    stubNavigateTo();
  });

  it('does nothing when not in lockdown', async () => {
    mockBoxOfficeStore({ lockdownMode: false });
    mockAuthStore({ isLoggedIn: true });
    const middleware = await loadMiddleware(
      '@/middleware/lockdown-mode.global'
    );

    const result = await middleware(
      { path: '/anything' } as any,
      undefined as any
    );
    expect(result).toBeUndefined();
  });

  it('does nothing when in lockdown but not logged in', async () => {
    mockBoxOfficeStore({ lockdownMode: true });
    mockAuthStore({ isLoggedIn: false });
    const middleware = await loadMiddleware(
      '@/middleware/lockdown-mode.global'
    );

    const result = await middleware(
      { path: '/anything' } as any,
      undefined as any
    );
    expect(result).toBeUndefined();
  });

  it('allows /box-office paths in lockdown', async () => {
    mockBoxOfficeStore({ lockdownMode: true });
    mockAuthStore({ isLoggedIn: true });
    const middleware = await loadMiddleware(
      '@/middleware/lockdown-mode.global'
    );

    const result = await middleware(
      { path: '/box-office/something' } as any,
      undefined as any
    );
    expect(result).toBeUndefined();
  });

  it('redirects to /box-office when in lockdown and trying to access other paths', async () => {
    mockBoxOfficeStore({ lockdownMode: true });
    mockAuthStore({ isLoggedIn: true });
    const middleware = await loadMiddleware(
      '@/middleware/lockdown-mode.global'
    );

    const result = await middleware(
      { path: '/not-allowed' } as any,
      undefined as any
    );
    expect(result).toEqual('/box-office');
  });
});
