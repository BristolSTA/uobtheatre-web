import Vue from 'vue';
import VueRouter from 'vue-router';
import Meta from 'vue-meta';
import NProgress from 'nprogress';

import Home from '../views/Home.vue';
import Venues from '../views/Venues.vue';
import NotFoundError from '../views/errors/NotFound.vue';
const Production = () => import('../views/production/Production.vue');

Vue.use(VueRouter);
Vue.use(Meta);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/production/:productionSlug',
    name: 'production',
    component: Production,
  },
  {
    path: '/venues',
    name: 'venues',
    component: Venues,
  },
  { path: '/404', name: '404', component: NotFoundError },
  { path: '*', redirect: '/404' },
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
