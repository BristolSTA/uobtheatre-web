<template>
  <div>
    <user-auth-box />
  </div>
</template>

<script>
import UserAuthBox from './UserAuthBox.vue';

export default {
  components: { UserAuthBox },
  name: 'login',
  data() {
    return {};
  },
};
</script>
