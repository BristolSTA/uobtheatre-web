<template>
  <sidebar class="flex-none" @close="$emit('close')">
    <sidebar-item icon="home" href="/administration" :is-root="true">
      Dashboard
    </sidebar-item>
    <!-- <sidebar-item icon="users" href="/administration/users">Users</sidebar-item>
    <sidebar-item icon="people-arrows" href="/administration/societies"
      >Societies</sidebar-item
    > -->
    <sidebar-item icon="theater-masks" href="/administration/productions">
      Productions
    </sidebar-item>
    <sidebar-item icon="ticket" href="/administration/tools/booking-lookup">
      All Bookings
    </sidebar-item>
    <sidebar-item
      v-if="authStore.hasPermission('finance_reports')"
      icon="money-bill"
      href="/administration/finance-reports"
    >
      Finance Reports
    </sidebar-item>
  </sidebar>
</template>

<script>
import Sidebar from '../ui/Nav/Sidebar.vue';
import SidebarItem from '../ui/Nav/SidebarItem.vue';
import useAuthStore from '@/store/auth';

export default {
  components: { Sidebar, SidebarItem },
  emits: ['close'],
  data() {
    return {
      authStore: useAuthStore()
    };
  },
  watch: {
    $route() {
      this.$emit('close');
    }
  }
};
</script>
