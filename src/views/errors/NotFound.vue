<template>
  <error>
    <template v-slot:subtitle>
      404 - Page Not Found
    </template>
  </error>
</template>

<script>
import Error from './Error';
export default {
  name: 'Error404',
  components: {
    Error,
  },
};
</script>
