import { vi } from 'vitest';

/**
 * Make defineNuxtRouteMiddleware return the original handler (no-op wrapper)
 */
export function stubDefineNuxtRouteMiddleware() {
  vi.stubGlobal('defineNuxtRouteMiddleware', (fn: any) => fn);
}

/**
 * Stub abortNavigation and return the created mock
 */
export function stubAbortNavigation() {
  const abortNavigationMock = vi.fn();
  vi.stubGlobal('abortNavigation', abortNavigationMock);
  return abortNavigationMock;
}

/**
 * Stub the globals used by createSafeError and return the created mocks
 */
export function stubCreateSafeErrorDeps() {
  const afterEach = vi.fn();
  const createErrorMock = vi.fn((e: any) => e);
  const showErrorMock = vi.fn();
  const clearErrorMock = vi.fn();

  vi.stubGlobal('useRouter', () => ({ afterEach }));
  vi.stubGlobal('createError', createErrorMock);
  vi.stubGlobal('showError', showErrorMock);
  vi.stubGlobal('clearError', clearErrorMock);

  return { afterEach, createErrorMock, showErrorMock, clearErrorMock };
}

/**
 * Mock the auth store and expose a permission-check method with the given name.
 * Returns the useAuthStore mock function and the mock for the permission method.
 */
export function mockAuthStoreWithPermissionMethod(
  methodName:
    | 'hasPermissionsForProduction'
    | 'hasPermissionsForPerformanceProduction'
) {
  const permissionMethodMock = vi.fn();
  const useAuthStoreMock = vi.fn(() => ({
    [methodName]: permissionMethodMock
  }));

  vi.doMock('@/store/auth', () => ({
    __esModule: true,
    default: useAuthStoreMock
  }));

  return { useAuthStoreMock, permissionMethodMock } as const;
}

/**
 * Dynamically import a middleware module and return its default export
 * This is used to avoid loading the middleware before stubs/mocks are set up!
 */
export async function loadMiddleware(modulePath: string) {
  return (await import(modulePath)).default;
}

/**
 * Stub navigateTo and return its mock (returns argument by default)
 */
export function stubNavigateTo() {
  const navigateToMock = vi.fn((arg: any) => arg);
  vi.stubGlobal('navigateTo', navigateToMock);
  return navigateToMock;
}

/**
 * Mock the auth store with isLoggedIn and hasPermission support
 */
export function mockAuthStore(overrides?: {
  isLoggedIn?: boolean;
  hasPermissionImpl?: (permission: string) => boolean | Promise<boolean>;
}) {
  const hasPermissionMock = vi.fn(overrides?.hasPermissionImpl as any);
  const store = {
    isLoggedIn: overrides?.isLoggedIn ?? false,
    hasPermission: hasPermissionMock
  } as any;

  const useAuthStoreMock = vi.fn(() => store);
  vi.doMock('@/store/auth', () => ({
    __esModule: true,
    default: useAuthStoreMock
  }));
  vi.doMock('~~/store/auth', () => ({
    __esModule: true,
    default: useAuthStoreMock
  }));

  return { useAuthStoreMock, hasPermissionMock, store } as const;
}

/**
 * Mock the box office store with a lockdownMode flag
 */
export function mockBoxOfficeStore(overrides?: { lockdownMode?: boolean }) {
  const store = {
    lockdownMode: overrides?.lockdownMode ?? false
  } as any;

  const useBoxOfficeStoreMock = vi.fn(() => store);
  vi.doMock('~~/store/box-office', () => ({
    __esModule: true,
    default: useBoxOfficeStoreMock
  }));

  return { useBoxOfficeStoreMock, store } as const;
}
