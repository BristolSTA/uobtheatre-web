<template>
  <div v-if="(crumbs && crumbs.length) || useAuto" class="bg-sta-gray-light">
    <div :class="[wide ? 'px-4' : 'container']">
      <div class="flex align-middle py-1 text-sta-gray-lightest font-semibold">
        <div
          v-for="(crumb, index) in crumbsToUse"
          :key="index"
          class="flex pr-2 text-sm"
        >
          <NuxtLink
            v-if="crumb.path && crumb.path !== $route.fullPath"
            :to="crumb.path"
          >
            <span class="text-sta-orange-light hover:text-white">{{
              crumb.text ? crumb.text : crumb.title
            }}</span>
            <font-awesome-icon
              v-if="index !== crumbsToUse.length - 1"
              class="ml-2"
              icon="chevron-right"
            />
          </NuxtLink>
          <template v-else>
            {{ crumb.text ? crumb.text : crumb.title }}
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import startCase from 'lodash/startCase';
export default {
  name: 'Breadcrumbs',
  props: {
    crumbs: {
      default: null,
      type: Array
    },
    wide: {
      default: false,
      type: Boolean
    },
    useAuto: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    crumbsToUse() {
      return this.crumbs || (this.useAuto ? this.routeCrumbs : []);
    },
    routeCrumbs() {
      const fullPath = useRoute().fullPath.split('?')[0];
      const params = fullPath.startsWith('/')
        ? fullPath.substring(1).split('/')
        : fullPath.split('/');
      const crumbs = [];
      let path = '';
      params.forEach((param) => {
        path = `${path}/${param}`;
        const match = useRouter().resolve(path);
        if (match.name !== null && !param.endsWith('=')) {
          crumbs.push({
            title: startCase(param.replace(/-/g, ' ').toLowerCase()),
            ...match
          });
        }
      });
      return crumbs;
    }
  }
};
</script>
