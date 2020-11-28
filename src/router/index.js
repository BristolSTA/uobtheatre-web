import Vue from 'vue';
import VueRouter from 'vue-router';
import Meta from 'vue-meta';
import NProgress from 'nprogress';

import Home from '../views/Home.vue';
import Production from '../views/Production.vue';

Vue.use(VueRouter);
Vue.use(Meta);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },

  {
    path: '/production/:productionSlug',
    name: 'production',
    component: Production,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

// Set up navigation guards for loading stuff
router.beforeResolve((to, _from, next) => {
  if (to.name) {
    NProgress.start();
  }
  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
