<template>
  <div>
    <safe-table v-if="assignedUsers.length">
      <thead>
        <table-row>
          <table-head-item>User</table-head-item>
          <table-head-item
            v-for="(permission, index) in assignablePermissions"
            :key="index"
          >
            {{ permission.description }}
          </table-head-item>
        </table-row>
      </thead>
      <tbody>
        <table-row v-for="(assignedUser, index) in assignedUsers" :key="index">
          <table-row-item class="text-center">
            {{ assignedUser.user.firstName }} {{ assignedUser.user.lastName
            }}<br />
            <sta-button
              :small="true"
              class="
                bg-sta-rouge
                hover:bg-sta-rouge-dark
                transition-colors
                mt-2
              "
              @click="removeUser(assignedUser)"
              >Remove</sta-button
            >
          </table-row-item>
          <table-row-item
            v-for="(permission, apIndex) in assignablePermissions"
            :key="apIndex"
          >
            <boolean-input
              :checked="
                assignedUser.assignedPermissions.includes(permission.name)
              "
              :disabled="!permission.userCanAssign"
              @change="togglePermission(assignedUser, permission)"
            />
          </table-row-item>
        </table-row>
      </tbody>
    </safe-table>
    <div class="mt-4 p-2 bg-sta-gray-dark rounded">
      <form-label>
        User Email Address <required-star />
        <template #control>
          <input v-model="newUser.email" type="email" class="text-black" />
        </template>
        <template #helper>
          This user must have an account on this site
        </template>
      </form-label>
      <safe-table>
        <thead>
          <table-row :striped="false">
            <table-head-item
              v-for="(permission, index) in userAssignablePermissions"
              :key="index"
            >
              {{ permission.description }}
            </table-head-item>
          </table-row>
        </thead>
        <tbody>
          <table-row :striped="false">
            <table-row-item
              v-for="(assignablePermission, index) in userAssignablePermissions"
              :key="index"
            >
              <input
                v-model="newUser.permissions"
                type="checkbox"
                :value="assignablePermission.name"
              />
            </table-row-item>
          </table-row>
        </tbody>
      </safe-table>
      <sta-button
        class="bg-sta-green hover:bg-sta-green-dark transition-colors"
        @click="addNewUser"
        >Add New</sta-button
      >
    </div>
  </div>
</template>

<script>
import SafeTable from '@/components/ui/Tables/SafeTable.vue'
import BooleanInput from '@/components/ui/Inputs/BooleanInput.vue'
import TableHeadItem from '@/components/ui/Tables/TableHeadItem.vue'
import TableRowItem from '@/components/ui/Tables/TableRowItem.vue'
import TableRow from '@/components/ui/Tables/TableRow.vue'
import StaButton from '@/components/ui/StaButton.vue'
import FormLabel from '@/components/ui/FormLabel.vue'
import RequiredStar from '@/components/ui/Form/RequiredStar.vue'
export default {
  components: {
    SafeTable,
    BooleanInput,
    TableHeadItem,
    TableRowItem,
    TableRow,
    StaButton,
    FormLabel,
    RequiredStar,
  },
  props: {
    assignablePermissions: {
      type: Array,
      required: true,
    },
    assignedUsers: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      newUser: {
        email: null,
        permissions: [],
      },
    }
  },
  computed: {
    userAssignablePermissions() {
      return this.assignablePermissions.filter((ap) => ap.userCanAssign)
    },
  },
  methods: {
    togglePermission(user, permission) {
      user.modified = true
      if (user.assignedPermissions.includes(permission.name)) {
        user.assignedPermissions = user.assignedPermissions.filter(
          (permissionName) => permissionName !== permission.name
        )
      } else {
        user.assignedPermissions.push(permission.name)
      }
    },
    addNewUser() {
      this.$emit('add', this.newUser)
    },
    removeUser(user) {
      this.$emit('remove', user)
    },
  },
}
</script>
