<template>
  <div id="app">
    <Layout>
      <router-view />
    </Layout>
  </div>
</template>

<script>
import Layout from '@/layout/Layout.vue';

export default {
  components: {
    Layout,
  },
};
</script>
