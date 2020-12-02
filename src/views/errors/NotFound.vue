<template>
  <error>
    <template v-slot:subtitle> 404 - Page Not Found </template>
  </error>
</template>

<script>
import Error from './Error';
export default {
  name: 'error-404',
  components: {
    Error,
  },
};
</script>
