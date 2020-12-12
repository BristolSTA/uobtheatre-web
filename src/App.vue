<template>
  <div id="app">
    <Layout>
      <router-view />
    </Layout>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Layout from '@/components/layout/Layout.vue';
import NProgress from 'nprogress';
import { authService } from '@/services';

export default {
  components: {
    Layout,
  },
  metaInfo() {
    const appName = this.$appName;
    return {
      // if no subcomponents specify a metaInfo.title, this title will be used
      title: appName,
      // all titles will be injected into this template
      titleTemplate: `%s | ${appName}`,
      meta: [
        {
          name: 'description',
          content:
            'From Aristophanes to Ayckbourn, from Puccini to pantomime, Bristol Student Theatre has it all. Find out about our performances, buy tickets, discover our societies and how to get involved, and sign up to our newsletter to stay updated with all the latest shows.',
        },
        {
          name: 'keywords',
          content:
            'bristol,student,theatre,performing,arts,university,winston,bristol su',
        },
      ],
    };
  },
  computed: mapState(['loading']),
  watch: {
    loading(newValue) {
      if (newValue) {
        NProgress.start();
      } else {
        NProgress.done();
      }
    },
  },
  mounted() {
    authService.refreshAuthStatus();
  },
};
</script>
