import useAuthStore from '~~/store/auth';

export function verifyUserHasPermission(
  permission: string,
  object?: { assignedPermissions: string[] }
) {
  const authStore = useAuthStore();
  if (
    !authStore.user || !object
      ? !authStore.user?.permissions?.includes(permission)
      : object.assignedPermissions.includes(permission)
  )
    throw createSafeError({ statusCode: 401 });
}
