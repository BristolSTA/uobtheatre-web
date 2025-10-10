// Middleware to check if the user has the required permissions to access a production page
// The required permission(s) should be specified as an array the page's metadata as `requiredPermission`
// If the user does not have the required permission, they will be shown an error message
import useAuthStore from '@/store/auth';

export default defineNuxtRouteMiddleware(async (to) => {
  const productionSlug = to.params.productionSlug;

  if (typeof productionSlug !== 'string') {
    // If the productionSlug is not a string, abort navigation (will look like a 404)
    return abortNavigation();
  }

  // Get the permission from the page's metadata
  const requiredPermissions = to.meta.requiredPermissions;

  if (!requiredPermissions) {
    // If no permission is required, allow access
    return;
  } else if (
    !Array.isArray(requiredPermissions) ||
    requiredPermissions.length === 0
  ) {
    return abortNavigation('Invalid permission configuration.');
  }

  // Check if the user has the required permission for the production
  const authStore = useAuthStore();
  const hasPermission = await authStore.hasPermissionsForProduction(
    productionSlug,
    requiredPermissions
  );

  if (!hasPermission) {
    return abortNavigation(
      'You do not have permission to access this page for this production.'
    );
  }
});
