<template>
  <AdminPage title="Edit Permissions">
    <template #toolbar>
      <UiStaButton
        v-if="production?.assignedUsers?.length"
        class="bg-sta-green hover:bg-sta-green-dark transition-colors"
        icon="save"
        @click="savePermissions"
      >
        Save
      </UiStaButton>
    </template>
    <all-errors-display :errors="errors" />
    <permissions-assigner
      :assignable-permissions="production?.assignablePermissions ?? []"
      :assigned-users="production?.assignedUsers ?? []"
      @add="addUserPermissions"
      @remove="removeUserPermissions"
    />
  </AdminPage>
</template>

<script lang="ts" setup>
import Swal from 'sweetalert2';

import PermissionsAssigner from '@/components/admin/permissions/PermissionsAssigner.vue';
import { getValidationErrors } from '~~/utils/api';
import { loadingSwal, successToast } from '~~/utils/alerts';
import AllErrorsDisplay from '@/components/ui/AllErrorsDisplay.vue';
import {
  AdminProductionPermissionsDocument,
  AdminProductionPermissionsQuery,
  AdminProductionPermissionsQueryVariables,
  useProductionPermissionsMutationsMutation
} from '~~/graphql/codegen/operations';
import Errors from '~~/classes/Errors';

const { data, refresh } = await useAsyncQuery<AdminProductionPermissionsQuery>({
  query: AdminProductionPermissionsDocument,
  variables: {
    slug: useRoute().params.productionSlug
  } as AdminProductionPermissionsQueryVariables,
  cache: false
});

const production = computed(() => data.value?.production);

if (!production.value) {
  throw createSafeError({
    statusCode: 404,
    message: 'This production does not exist'
  });
}
if (production?.value?.assignedUsers === null) {
  throw createSafeError({
    statusCode: 401,
    message: 'You do not have permission to alter permissions'
  });
}

const errors = ref<Errors | undefined>(undefined);

async function savePermissions() {
  const changedUsers = production.value?.assignedUsers
    ? production.value.assignedUsers.filter((user: any) => user?.modified)
    : [];

  const mutations: (boolean | Promise<boolean>)[] = changedUsers.map(
    (assignedUser) => {
      if (!assignedUser?.user) return false;
      return setUserPermissions(
        assignedUser.user.email,
        (assignedUser.assignedPermissions?.filter(
          (perm) => perm !== null
        ) as string[]) ?? []
      );
    }
  );

  await Promise.all(mutations);

  if (!errors) {
    successToast.fire({ title: 'Users updated succesfully' });
    refresh();
  }
}

interface IPermissionUser {
  email: string;
  permissions: string[];
}

async function addUserPermissions(newUser: IPermissionUser) {
  loadingSwal.fire();
  if (!(await setUserPermissions(newUser.email, newUser.permissions))) {
    return Swal.close();
  }
  successToast.fire({ title: 'User has been added' });
  refresh();
}

async function removeUserPermissions(assignedUser: { user: IPermissionUser }) {
  loadingSwal.fire();
  if (!(await setUserPermissions(assignedUser.user.email, []))) {
    return Swal.close();
  }
  successToast.fire({ title: 'User has been removed' });
  refresh();
}

async function setUserPermissions(
  email: string,
  permissions: string[]
): Promise<boolean> {
  errors.value = undefined;
  if (!production) return false;
  try {
    await doMutation(
      useProductionPermissionsMutationsMutation({
        variables: {
          productionId: production.value?.id,
          userEmail: email,
          permissions
        }
      }),
      'productionPermissions'
    );
  } catch (e) {
    errors.value = getValidationErrors(e);
    return false;
  }
  return true;
}
</script>
